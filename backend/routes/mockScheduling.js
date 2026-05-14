// Mock System API: Scheduling.
// Standalone POST endpoint so it can be exercised directly.

import express from "express";
import { appendLog } from "../data/store.js";

const router = express.Router();

router.post("/", (req, res) => {
  const { intakeId, priority = "standard", queue = "general" } = req.body || {};
  if (!intakeId) {
    return res.status(400).json({
      ok: false,
      system: "mock-scheduling",
      error: "intakeId is required"
    });
  }
  const schedulingId = `SCH-${Date.now()}`;
  appendLog({
    kind: "direct-system-call",
    system: "mock-scheduling",
    intakeId,
    schedulingId,
    priority,
    queue
  });
  res.status(201).json({
    ok: true,
    system: "mock-scheduling",
    schedulingId,
    intakeId,
    priority,
    queue,
    note: "Synthetic mock. No real scheduling occurred."
  });
});

export default router;
