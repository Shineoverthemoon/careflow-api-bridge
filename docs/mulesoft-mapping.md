# MuleSoft Mapping

This doc explains how concepts in this demo map to MuleSoft's Anypoint Platform and API-led connectivity model. It's the cheat sheet you can walk through with a buyer or hiring manager who knows MuleSoft.

> **Important framing:** This is a Node.js + React demo. It is *not* a MuleSoft implementation. It mirrors MuleSoft's *thinking* so the same concepts apply.

## Tier-by-tier mapping

| MuleSoft Concept                | CareFlow Equivalent                                | Where it lives                                  |
|---------------------------------|----------------------------------------------------|-------------------------------------------------|
| **Experience API**              | `POST /api/intake`                                 | `backend/routes/intake.js`                      |
|                                 | Receives flat payload from the frontend            |                                                 |
| **Process API**                 | Chained services inside the backend                | `backend/services/{validation,transformation,routing}.js` |
|                                 | Validates, transforms, routes, dispatches          |                                                 |
| **System API — EHR**            | `GET /api/mock/ehr/:id`                            | `backend/routes/mockEhr.js`                     |
| **System API — Scheduling**     | `POST /api/mock/scheduling`                        | `backend/routes/mockScheduling.js`              |
| **System API — Notification**   | `POST /api/mock/notification`                      | `backend/routes/mockNotification.js`            |

## Capability mapping

| MuleSoft Capability             | CareFlow Equivalent                                | Notes                                            |
|---------------------------------|----------------------------------------------------|--------------------------------------------------|
| **DataWeave**                   | `transformIntake()` function                       | Flat → canonical, imperative JS instead of DataWeave |
| **API Contract (RAML / OAS)**   | Implicit — request/response shapes in code         | Real implementation would have a versioned contract |
| **API Manager**                 | None — no policy enforcement                       | Real implementation: rate limiting, OAuth2, IP whitelist |
| **Runtime Manager**             | `npm run dev`                                      | Real implementation: CloudHub or hybrid runtime |
| **Anypoint Monitoring**         | `GET /api/logs` + request logger middleware        | Real implementation: full APM + alerting        |
| **API Visualizer**              | Inline SVG architecture diagram in the dashboard   | Real implementation: dependency map auto-generated |
| **Anypoint Exchange**           | This README + sample payloads doc                  | Real implementation: discoverable API catalog   |
| **Connectors (Salesforce/HL7)** | Mock System APIs return canned responses          | Real implementation: certified connectors       |
| **Anypoint MQ / Queue**         | Synchronous in-process call chain                  | Real implementation: async via MQ/SQS           |
| **Idempotency keys**            | Not implemented                                    | Real implementation: required for retries       |
| **Circuit breakers**            | Not implemented                                    | Real implementation: required for resilience    |
| **Tracing / correlation IDs**   | `intakeId` threads through every log entry         | Real implementation: OpenTelemetry / X-Correlation-ID |

## The language to use carefully

Words that match MuleSoft's positioning and that you can use accurately when describing this demo:

- "API-led connectivity"
- "API contract first"
- "Experience / Process / System APIs"
- "Transformation"
- "Reusable APIs"
- "Governance" *(aspirational — not in this demo)*
- "Monitoring" / "observability"
- "Downstream systems"

Words to avoid unless you've actually used the tooling:

- "Anypoint Studio"
- "DataWeave" (you can reference it as a *concept* but not as a *thing you used here*)
- "CloudHub"
- "Mule runtime"
- "OAuth2 policy in API Manager"
- "RAML"

## The honest version of the pitch

> "I built a MuleSoft-style API-led integration demo in Node.js and React because I wanted to internalize the pattern before our conversation. The Experience API is the front door. The Process API owns validation, transformation, and routing. The System APIs are mocks. The whole flow is observable. If we built this in real Anypoint Platform, the Process logic would be a Mule application with a RAML contract, DataWeave transformations, and policies managed in API Manager."

That's a sentence Josh can quote back to anyone internally.

## How to extend this into MuleSoft for real

If the role progresses and you want to build the next version inside Anypoint:

1. Define each API as a RAML 1.0 contract in Anypoint Design Center.
2. Publish them to Anypoint Exchange.
3. Generate Mule scaffolds in Anypoint Studio.
4. Write the transformations in DataWeave 2.0.
5. Deploy to CloudHub via Runtime Manager.
6. Wrap each with API Manager policies (basic auth or OAuth2).
7. Replace the JS mock System APIs with HL7 / Salesforce / SMS Connector implementations.
8. Add Anypoint MQ between Process and System tiers for async resilience.

Each step is a normal engineering task and is the natural progression from this demo.
