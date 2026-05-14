# Sample Payloads

All examples use synthetic data only.

## 1. Happy path — `POST /api/intake`

### Request

```json
{
  "firstName": "Avery",
  "lastName": "Synthetic-Demo",
  "dateOfBirth": "1985-03-12",
  "phone": "555-0142",
  "email": "demo@example.com",
  "appointmentType": "new-patient",
  "urgency": "high",
  "preferredLocation": "Downtown Clinic",
  "notes": "Synthetic demo intake."
}
```

### Response (201 Created)

```json
{
  "ok": true,
  "stage": "complete",
  "raw": { /* echoes request */ },
  "normalized": {
    "intakeId": "CF-2026-0001",
    "schemaVersion": "careflow-intake-v1",
    "receivedAt": "2026-05-13T22:00:00.000Z",
    "patient": {
      "name": { "first": "Avery", "last": "Synthetic-Demo" },
      "dob": "1985-03-12",
      "contact": { "phone": "555-0142", "email": "demo@example.com" }
    },
    "appointment": {
      "type": "new-patient",
      "urgency": "high",
      "location": "Downtown Clinic"
    },
    "notes": "Synthetic demo intake.",
    "routing": {
      "ehrSystem": "mock-ehr",
      "schedulingSystem": "mock-scheduling",
      "notificationSystem": "mock-notification"
    },
    "status": "routed",
    "routingDecisions": {
      "schedulingPriority": "urgent",
      "schedulingQueue": "new-patient-intake",
      "notifyChannel": "email",
      "reasons": [
        "urgency=high -> priority=urgent",
        "appointmentType=new-patient -> queue=new-patient-intake"
      ]
    },
    "downstream": {
      "ehr": { "system": "mock-ehr", "accepted": true, "ehrId": "EHR-0001", "record": { /* ... */ } },
      "scheduling": { "system": "mock-scheduling", "accepted": true, "schedulingId": "SCH-0001", "priority": "urgent", "queue": "new-patient-intake" },
      "notification": { "system": "mock-notification", "accepted": true, "notificationId": "NTF-0001", "channel": "email", "to": "demo@example.com", "message": "Intake CF-2026-0001 received." }
    }
  },
  "routingDecisions": { /* same as above */ },
  "downstream": { /* same as above */ }
}
```

## 2. Validation failure — missing required field

### Request

```json
{
  "lastName": "Synthetic-Demo",
  "dateOfBirth": "1985-03-12",
  "appointmentType": "new-patient",
  "preferredLocation": "Downtown Clinic"
}
```

### Response (400 Bad Request)

```json
{
  "ok": false,
  "stage": "validation",
  "errors": ["Missing required field: firstName"],
  "requirements": {
    "requiredFields": ["firstName", "lastName", "dateOfBirth", "appointmentType", "preferredLocation"],
    "validAppointmentTypes": ["new-patient", "follow-up", "consult", "lab-only"],
    "validUrgency": ["routine", "elevated", "high"]
  }
}
```

## 3. Routing variation — lab-only with no email

### Request

```json
{
  "firstName": "Riley",
  "lastName": "Test-Sample",
  "dateOfBirth": "1990-07-01",
  "phone": "555-0177",
  "email": "",
  "appointmentType": "lab-only",
  "urgency": "routine",
  "preferredLocation": "Westside Lab",
  "notes": ""
}
```

### Routing decisions in response

```json
{
  "schedulingPriority": "standard",
  "schedulingQueue": "lab",
  "notifyChannel": "sms",
  "reasons": [
    "appointmentType=lab-only -> queue=lab",
    "no email present -> notifyChannel=sms"
  ]
}
```

## 4. Intake lookup — `GET /api/intake/CF-2026-0001/status`

### Response (200 OK)

```json
{
  "ok": true,
  "intake": { /* the saved canonical intake including routing + downstream */ }
}
```

## 5. Health — `GET /api/health`

```json
{
  "ok": true,
  "service": "careflow-api-bridge",
  "status": "healthy",
  "uptime": 42.5,
  "counts": { "intakes": 3, "logs": 28 },
  "endpoints": {
    "experience": [ { "method": "POST", "path": "/api/intake" } ],
    "system": [
      { "method": "GET", "path": "/api/mock/ehr/:id" },
      { "method": "POST", "path": "/api/mock/scheduling" },
      { "method": "POST", "path": "/api/mock/notification" }
    ],
    "observability": [
      { "method": "GET", "path": "/api/health" },
      { "method": "GET", "path": "/api/logs" }
    ]
  },
  "disclaimer": "Synthetic demo only. No PHI. No real patient data."
}
```

## 6. Logs — `GET /api/logs?intakeId=CF-2026-0001`

Returns the timeline filtered to one intake. Useful for incident replay.

```json
{
  "ok": true,
  "count": 7,
  "logs": [
    { "timestamp": "...", "kind": "system-api-call", "intakeId": "CF-2026-0001", "system": "mock-notification" },
    { "timestamp": "...", "kind": "system-api-call", "intakeId": "CF-2026-0001", "system": "mock-scheduling" },
    { "timestamp": "...", "kind": "system-api-call", "intakeId": "CF-2026-0001", "system": "mock-ehr" },
    { "timestamp": "...", "kind": "routing-decision", "intakeId": "CF-2026-0001" },
    { "timestamp": "...", "kind": "routing", "intakeId": "CF-2026-0001" },
    { "timestamp": "...", "kind": "transformation-complete", "intakeId": "CF-2026-0001" },
    { "timestamp": "...", "kind": "validation-passed" }
  ]
}
```
