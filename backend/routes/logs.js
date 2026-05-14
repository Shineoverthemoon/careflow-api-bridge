// Observability endpoint: returns the integration log timeline.
// Equivalent to what MuleSoft Runtime Manager / observability tooling would surface.

import express from "express";
import { getStore } from "../data/store.js";

const router = express.Router();

router.get("/", (req, res) => {
  const { kind, intakeId, limit } = req.query;
  const store = getStore();
  let logs = store.logs;

  if (kind) {
    logs = logs.filter((entry) => entry.kind === kind);
  }
  if (intakeId) {
    logs = logs.filter((entry) => entry.intakeId === intakeId);
  }
  if (limit) {
    const n = parseInt(limit, 10);
    if (!Number.isNaN(n) && n > 0) {
      logs = logs.slice(0, n);
    }
  }

  res.json({
    ok: true,
    count: logs.length,
    logs
  });
});

export default router;
