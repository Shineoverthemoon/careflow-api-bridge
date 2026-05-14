# API-Led Architecture

This document explains how CareFlow API Bridge implements MuleSoft's API-led connectivity pattern, in a small synthetic demo form.

## The pattern, briefly

API-led connectivity is a 3-tier approach to integration:

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ EXPERIENCE   │ →  │ PROCESS      │ →  │ SYSTEM       │
│ tier         │    │ tier         │    │ tier         │
└──────────────┘    └──────────────┘    └──────────────┘
   front door         orchestration       downstream
   per channel        + business rules    systems of record
```

Each tier has a different reason to change:

- **Experience APIs** change when the channel changes (web → mobile → kiosk).
- **Process APIs** change when business rules change.
- **System APIs** change when the underlying system of record changes.

Decoupling these lets the right team change the right thing without breaking the others.

## How CareFlow implements it

### Experience tier — `POST /api/intake`

The intake form is the only thing the front-end has to know about. It sends a flat payload that matches its own UI state. It doesn't know what an EHR is, what scheduling priorities exist, or which notification channel will fire.

If we built a second channel later (a mobile app, a kiosk, an inbound HL7 ADT-A28 feed), each would get its own Experience API, but all of them would forward to the same Process API.

### Process tier — internal services

The Process tier in this demo is implemented as four chained services inside the backend:

1. **Validation** (`services/validation.js`) — required fields, type/enum checks. Fails fast.
2. **Transformation** (`services/transformation.js`) — flat → canonical. Equivalent to a DataWeave transformation in MuleSoft.
3. **Routing** (`services/routing.js`) — applies business rules (urgency, appointment type, contact channel) and produces a decision with a reasoning trail.
4. **Dispatch** (also `routing.js`) — calls each System API in order, captures the result, and logs the call.

A real MuleSoft Process API would be its own Mule application sitting on its own runtime, exposed through a contract (RAML/OAS) and registered in API Manager.

### System tier — three mock System APIs

- `GET /api/mock/ehr/:id`
- `POST /api/mock/scheduling`
- `POST /api/mock/notification`

Each one is independently callable. In production, each one would be its own Mule application connecting to a real system (Epic / Cerner / etc., a scheduling product, Twilio, etc.).

The Process API never knows the internals of those systems. It only knows the contract.

## Why this matters for buyers

Three things sell this pattern to integration teams:

1. **Add a new downstream system without rewriting the front door.** When the org adopts a new scheduling vendor, only the Process API's dispatch logic and the new System API need to change. The intake form stays the same.
2. **Reuse System APIs across channels.** The same EHR System API can be called by the intake flow, by a check-in kiosk, by a back-office tool, and by an analytics job.
3. **Audit every step.** The integration log captures validation, transformation, routing decisions, and downstream calls. When something breaks at 3am, the on-call engineer sees a structured timeline instead of a pile of stdout.

## What's missing vs a real MuleSoft implementation

This demo is not a complete API-led implementation. Things that would exist in a real Anypoint Platform build:

- API contracts in RAML or OAS, registered in Anypoint Exchange.
- API Manager policies (rate limiting, OAuth2, IP whitelisting).
- Runtime Manager deployment + Anypoint Monitoring.
- DataWeave instead of imperative JS.
- Anypoint MQ or AWS SQS between tiers for resilience.
- Idempotency keys and retry policies.
- Circuit breakers on System API calls.

These are intentionally omitted to keep the demo small enough to run locally in one evening.

## What the demo proves

The demo proves three things:

1. The author understands the 3-tier API-led pattern.
2. The author can model a real-world workflow (healthcare intake) inside that pattern.
3. The author can translate the technical flow into business value without overclaiming.

That's the SE skill set.
