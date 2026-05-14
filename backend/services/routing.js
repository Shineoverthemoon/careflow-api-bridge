// Process API building block: routing + dispatch.
// Applies business rules and calls each mock System API internally.

import { appendLog, updateIntakeStatus } from "../data/store.js";

function applyRoutingRules(normalized) {
  const decisions = {
    schedulingPriority: "standard",
    schedulingQueue: "general",
    notifyChannel: "email",
    reasons: []
  };

  if (normalized.appointment.urgency === "high") {
    decisions.schedulingPriority = "urgent";
    decisions.reasons.push("urgency=high -> priority=urgent");
  } else if (normalized.appointment.urgency === "elevated") {
    decisions.schedulingPriority = "elevated";
    decisions.reasons.push("urgency=elevated -> priority=elevated");
  }

  if (normalized.appointment.type === "new-patient") {
    decisions.schedulingQueue = "new-patient-intake";
    decisions.reasons.push("appointmentType=new-patient -> queue=new-patient-intake");
  } else if (normalized.appointment.type === "follow-up") {
    decisions.schedulingQueue = "follow-up";
    decisions.reasons.push("appointmentType=follow-up -> queue=follow-up");
  } else if (normalized.appointment.type === "lab-only") {
    decisions.schedulingQueue = "lab";
    decisions.notifyChannel = normalized.patient.contact.email ? "email" : "sms";
    decisions.reasons.push("appointmentType=lab-only -> queue=lab");
  } else if (normalized.appointment.type === "consult") {
    decisions.schedulingQueue = "consult";
    decisions.reasons.push("appointmentType=consult -> queue=consult");
  }

  if (!normalized.patient.contact.email && normalized.patient.contact.phone) {
    decisions.notifyChannel = "sms";
    decisions.reasons.push("no email present -> notifyChannel=sms");
  }

  return decisions;
}

// Mock System API: scheduling
function dispatchScheduling(intake, decisions) {
  // In a real MuleSoft world this is an HTTP call to the scheduling System API.
  // Here we simulate the contract synchronously.
  return {
    system: "mock-scheduling",
    accepted: true,
    schedulingId: `SCH-${intake.intakeId.split("-").pop()}`,
    priority: decisions.schedulingPriority,
    queue: decisions.schedulingQueue
  };
}

// Mock System API: EHR
function dispatchEhr(intake) {
  return {
    system: "mock-ehr",
    accepted: true,
    ehrId: `EHR-${intake.intakeId.split("-").pop()}`,
    record: {
      patientName: `${intake.patient.name.last}, ${intake.patient.name.first}`,
      dob: intake.patient.dob,
      preferredLocation: intake.appointment.location
    }
  };
}

// Mock System API: notification
function dispatchNotification(intake, decisions) {
  return {
    system: "mock-notification",
    accepted: true,
    notificationId: `NTF-${intake.intakeId.split("-").pop()}`,
    channel: decisions.notifyChannel,
    to: decisions.notifyChannel === "email"
      ? intake.patient.contact.email
      : intake.patient.contact.phone,
    message: `Intake ${intake.intakeId} received. We will contact you to confirm scheduling.`
  };
}

export function routeAndDispatch(intake) {
  appendLog({
    kind: "routing",
    intakeId: intake.intakeId,
    message: "Applying routing rules"
  });

  const decisions = applyRoutingRules(intake);

  appendLog({
    kind: "routing-decision",
    intakeId: intake.intakeId,
    decisions
  });

  // Dispatch to System APIs
  const ehr = dispatchEhr(intake);
  appendLog({
    kind: "system-api-call",
    intakeId: intake.intakeId,
    system: "mock-ehr",
    result: ehr
  });

  const scheduling = dispatchScheduling(intake, decisions);
  appendLog({
    kind: "system-api-call",
    intakeId: intake.intakeId,
    system: "mock-scheduling",
    result: scheduling
  });

  const notification = dispatchNotification(intake, decisions);
  appendLog({
    kind: "system-api-call",
    intakeId: intake.intakeId,
    system: "mock-notification",
    result: notification
  });

  const downstream = { ehr, scheduling, notification };

  updateIntakeStatus(intake.intakeId, "routed", {
    routingDecisions: decisions,
    downstream
  });

  return { decisions, downstream };
}
