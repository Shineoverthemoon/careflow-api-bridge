// Mock System API: EHR.
// Independently callable to demonstrate that System APIs are reusable.

import express from "express";
import { getIntake } from "../data/store.js";

const router = express.Router();

router.get("/:id", (req, res) => {
  const intake = getIntake(req.params.id);
  if (!intake) {
    return res.status(404).json({
      ok: false,
      system: "mock-ehr",
      error: "No EHR record for that intake id",
      id: req.params.id
    });
  }
  res.json({
    ok: true,
    system: "mock-ehr",
    record: {
      ehrId: `EHR-${intake.intakeId.split("-").pop()}`,
      patientName: `${intake.patient.name.last}, ${intake.patient.name.first}`,
      dob: intake.patient.dob,
      preferredLocation: intake.appointment.location,
      lastUpdated: intake.updatedAt || intake.receivedAt
    }
  });
});

export default router;
