# CareFlow API Bridge

**A MuleSoft-style healthcare integration demo using synthetic data.**

> **Synthetic demo only.** No PHI. No real patient data. No employer data. No client data. No paid APIs.
> This project is not a MuleSoft implementation. It is a MuleSoft-*style* API-led integration demo built in Node.js + React to demonstrate integration thinking.

---

## What this is

CareFlow API Bridge is a small portfolio-grade demo that shows how an API layer can bridge disconnected systems. It implements a 3-tier API-led architecture inspired by MuleSoft's pattern:

- **Experience API** — receives the patient intake request from a frontend form (or a Postman call).
- **Process API** — validates required fields, normalizes the payload into a canonical structure, applies routing rules, and dispatches to System APIs.
- **System APIs** — three mock downstream systems: EHR, Scheduling, Notification.

The flow is fully visible in the UI: raw payload → normalized payload → routing decisions with reasoning → downstream system responses → live integration log.

## Why I built it

To demonstrate API-led integration thinking in a portfolio-ready form. The point is not that this is a production healthcare app. The point is to show how I think about:

- Designing API contracts before implementation
- Bridging disconnected systems through a reusable API layer
- Validating, transforming, routing, and observing payloads
- Translating technical flow into business value

## Business problem (the framing)

Healthcare organizations often have intake forms, EHRs, scheduling systems, and notification systems that don't natively talk to each other. Without an API bridge, teams build brittle point-to-point integrations that fail silently, are hard to debug, and duplicate work for every new downstream system.

## Solution (the pattern)

A 3-tier API-led design that decouples the front door from the downstream systems:

1. The **Experience API** is the only thing the intake form needs to know about.
2. The **Process API** owns validation, transformation, and routing rules.
3. The **System APIs** are reusable and can be called independently of the intake flow.

When a new downstream system needs to be added, only the Process API's routing logic changes. The intake form and the existing System APIs stay untouched.

## Architecture

```
┌─────────────────┐   ┌──────────────────────────────┐   ┌───────────────────┐
│  Experience API │──▶│         Process API          │──▶│ Mock EHR API      │
│  POST /intake   │   │  validate · transform · route│   │ Mock Scheduling   │
│                 │   │  dispatch · log              │   │ Mock Notification │
└─────────────────┘   └──────────────────────────────┘   └───────────────────┘
                              │
                              ▼
                       Integration Log
                       GET /api/logs
```

## How to run locally

You need Node.js 20+ and npm.

```powershell
# 1. Backend (terminal 1)
cd backend
npm install
npm run dev

# Backend now runs on http://localhost:4000

# 2. Frontend (terminal 2, new PowerShell window)
cd frontend
npm install
npm run dev

# Frontend now runs on http://localhost:5173
# It proxies /api requests to the backend.
```

Open `http://localhost:5173` in a browser.

## Demo flow

1. Open the dashboard. The intake form is pre-filled with a synthetic sample.
2. Click **Submit Intake**.
3. Watch the pipeline indicator advance from validate → transform → route → dispatch.
4. The "Payload Transformation" panel shows the raw flat payload on the left and the normalized canonical structure on the right.
5. The "Routing Decisions" panel shows which queue and priority were assigned, plus the reasoning trail (`urgency=high → priority=urgent`).
6. The three downstream "System API" cards show the responses from the mock EHR, Scheduling, and Notification systems.
7. The Integration Log scrolls in real time, showing every step of the flow with timestamps.

Try variations:
- Set urgency to `routine` and submit — watch priority become `standard`.
- Set appointment type to `lab-only` — watch the queue change to `lab`.
- Clear `email` and submit — watch the notification channel fall back to `sms`.
- Submit with `firstName` blank — watch validation fail at the Experience API.

## API endpoints

| Method | Path                          | Tier        | Purpose                            |
|--------|-------------------------------|-------------|------------------------------------|
| POST   | `/api/intake`                 | Experience  | Receive intake, run full pipeline  |
| GET    | `/api/intake/:id/status`      | Experience  | Look up an intake by id            |
| GET    | `/api/mock/ehr/:id`           | System      | Mock EHR lookup                    |
| POST   | `/api/mock/scheduling`        | System      | Mock scheduling directly           |
| POST   | `/api/mock/notification`      | System      | Mock notification directly         |
| GET    | `/api/health`                 | Ops         | Service health + endpoint list     |
| GET    | `/api/logs`                   | Ops         | Integration log (filterable)       |

## How this maps to MuleSoft-style thinking

See `docs/mulesoft-mapping.md` for the full mapping. Short version:

- **Experience API / Process API / System APIs** — the three tiers of API-led connectivity.
- **DataWeave** — represented here by the transformation service in `backend/services/transformation.js`.
- **API Manager** — would handle governance, rate limiting, and auth. Not implemented in this demo.
- **Runtime Manager** — would handle deployment and monitoring. Replaced here by Node.js + a custom log endpoint.
- **API Visualizer** — would show inter-API dependencies. Replaced here by the inline architecture diagram on the dashboard.

## Future improvements if built in MuleSoft Anypoint Platform

- Author each API in Anypoint Studio with a RAML/OAS contract.
- Use DataWeave for transformations instead of imperative JS.
- Register APIs in API Manager for policy enforcement.
- Deploy to CloudHub via Runtime Manager.
- Wire up Anypoint Monitoring for end-to-end visibility.
- Replace mock System APIs with real connectors (HL7, FHIR, scheduling provider, SMS gateway).

## Synthetic data notice

All data shown in this demo is synthetic. Patient names use the form `Avery Synthetic-Demo`. Phone numbers use the `555-0100`–`555-0199` reserved range. Email addresses use `@example.com`. No PHI, no real patient data, no employer data, and no client data has ever been used in this project.

## Stack

- **Backend:** Node.js 20+, Express, ESM modules. In-memory store. No database.
- **Frontend:** React 18, Vite 5, no UI framework. Custom dark systems-lab CSS.
- **No auth, no DB, no external APIs.** All data is in-process.

## Not claimed

- This is **not** a MuleSoft app.
- This is **not** HIPAA-compliant.
- This is **not** production-ready.
- This is **not** a real EHR integration.

It is a synthetic demo designed to show integration thinking.

## Author

Joe Quinn — [jquinn-dev.netlify.app](https://jquinn-dev.netlify.app/#projects)
