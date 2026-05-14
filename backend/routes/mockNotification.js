// Mock System API: Notification.
// Standalone POST endpoint.

import express from "express";
import { appendLog } from "../data/store.js";

const router = express.Router();

router.post("/", (req, res) => {
  const { intakeId, channel = "email", to, message } = req.body || {};
  if (!intakeId) {
    return res.status(400).json({
      ok: false,
      system: "mock-notification",
      error: "intakeId is required"
    });
  }
  const notificationId = `NTF-${Date.now()}`;
  appendLog({
    kind: "direct-system-call",
    system: "mock-notification",
    intakeId,
    notificationId,
    channel,
    to: to || "(redacted)"
  });
  res.status(201).json({
    ok: true,
    system: "mock-notification",
    notificationId,
    intakeId,
    channel,
    to: to || null,
    message: message || "Synthetic notification — nothing was actually sent.",
    note: "Synthetic mock. No real message dispatched."
  });
});

export default router;
