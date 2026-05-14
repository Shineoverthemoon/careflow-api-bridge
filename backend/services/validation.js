// Process API building block: validation.
// Returns { ok: true } or { ok: false, errors: [...] }

const REQUIRED_FIELDS = [
  "firstName",
  "lastName",
  "dateOfBirth",
  "appointmentType",
  "preferredLocation"
];

const VALID_APPOINTMENT_TYPES = ["new-patient", "follow-up", "consult", "lab-only"];
const VALID_URGENCY = ["routine", "elevated", "high"];

export function validateIntake(payload) {
  const errors = [];

  if (!payload || typeof payload !== "object") {
    return { ok: false, errors: ["Payload must be a JSON object."] };
  }

  for (const field of REQUIRED_FIELDS) {
    const val = payload[field];
    if (val === undefined || val === null || String(val).trim() === "") {
      errors.push(`Missing required field: ${field}`);
    }
  }

  if (payload.appointmentType && !VALID_APPOINTMENT_TYPES.includes(payload.appointmentType)) {
    errors.push(
      `appointmentType must be one of: ${VALID_APPOINTMENT_TYPES.join(", ")}`
    );
  }

  if (payload.urgency && !VALID_URGENCY.includes(payload.urgency)) {
    errors.push(`urgency must be one of: ${VALID_URGENCY.join(", ")}`);
  }

  if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    errors.push("email is not in a valid format");
  }

  return errors.length === 0 ? { ok: true } : { ok: false, errors };
}

export const VALIDATION_METADATA = {
  requiredFields: REQUIRED_FIELDS,
  validAppointmentTypes: VALID_APPOINTMENT_TYPES,
  validUrgency: VALID_URGENCY
};
