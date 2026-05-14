// Process API building block: transformation.
// Equivalent to DataWeave in a MuleSoft implementation.
// Takes the flat frontend payload and produces a canonical nested structure.

import { nextIntakeId } from "../data/store.js";

export function transformIntake(raw) {
  const intakeId = nextIntakeId();
  const now = new Date().toISOString();

  const normalized = {
    intakeId,
    schemaVersion: "careflow-intake-v1",
    receivedAt: now,
    patient: {
      name: {
        first: String(raw.firstName || "").trim(),
        last: String(raw.lastName || "").trim()
      },
      dob: String(raw.dateOfBirth || "").trim(),
      contact: {
        phone: String(raw.phone || "").trim() || null,
        email: String(raw.email || "").trim().toLowerCase() || null
      }
    },
    appointment: {
      type: raw.appointmentType,
      urgency: raw.urgency || "routine",
      location: raw.preferredLocation
    },
    notes: raw.notes ? String(raw.notes).trim() : null,
    routing: {
      ehrSystem: "mock-ehr",
      schedulingSystem: "mock-scheduling",
      notificationSystem: "mock-notification"
    },
    status: "received"
  };

  return normalized;
}
