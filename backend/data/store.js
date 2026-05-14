// In-memory store. Resets on restart. No persistence.
// This is intentional for a demo.

const store = {
  intakes: new Map(),       // intakeId -> normalized payload + status
  logs: [],                  // integration log entries
  intakeCounter: 0
};

export function getStore() {
  return store;
}

export function nextIntakeId() {
  store.intakeCounter += 1;
  const year = new Date().getFullYear();
  const padded = String(store.intakeCounter).padStart(4, "0");
  return `CF-${year}-${padded}`;
}

export function appendLog(entry) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    ...entry
  };
  store.logs.unshift(logEntry); // newest first
  // keep last 200 entries
  if (store.logs.length > 200) {
    store.logs = store.logs.slice(0, 200);
  }
  return logEntry;
}

export function saveIntake(intake) {
  store.intakes.set(intake.intakeId, intake);
  return intake;
}

export function getIntake(intakeId) {
  return store.intakes.get(intakeId);
}

export function updateIntakeStatus(intakeId, status, extras = {}) {
  const existing = store.intakes.get(intakeId);
  if (!existing) return null;
  const updated = { ...existing, status, ...extras, updatedAt: new Date().toISOString() };
  store.intakes.set(intakeId, updated);
  return updated;
}
