// Experience API — the front door for patient intake.
// Receives the flat frontend payload, runs the Process API chain:
//   validate -> transform -> route -> dispatch
// Returns a structured response showing every stage.

import express from "express";
import { validateIntake, VALIDATION_METADATA } from "../services/validation.js";
import { transformIntake } from "../services/transformation.js";
import { routeAndDispatch } from "../services/routing.js";
import { appendLog, saveIntake, getIntake } from "../data/store.js";

const router = express.Router();

router.post("/", (req, res) => {
  const raw = req.body;

  appendLog({
    kind: "intake-received",
    payloadKeys: Object.keys(raw || {})
  });

  // Stage 1: validate
  const validation = validateIntake(raw);
  if (!validation.ok) {
    appendLog({
      kind: "validation-failed",
      errors: validation.errors
    });
    return res.status(400).json({
      ok: false,
      stage: "validation",
      errors: validation.errors,
      requirements: VALIDATION_METADATA
    });
  }

  appendLog({ kind: "validation-passed" });

  // Stage 2: transform
  const normalized = transformIntake(raw);
  saveIntake(normalized);

  appendLog({
    kind: "transformation-complete",
    intakeId: normalized.intakeId
  });

  // Stage 3 + 4: route + dispatch
  const { decisions, downstream } = routeAndDispatch(normalized);

  // Refresh from store (now includes downstream and routingDecisions)
  const finalIntake = getIntake(normalized.intakeId);

  res.status(201).json({
    ok: true,
    stage: "complete",
    raw,
    normalized: finalIntake,
    routingDecisions: decisions,
    downstream
  });
});

router.get("/:id/status", (req, res) => {
  const intake = getIntake(req.params.id);
  if (!intake) {
    return res.status(404).json({
      ok: false,
      error: "Intake not found",
      id: req.params.id
    });
  }
  res.json({ ok: true, intake });
});

export default router;
