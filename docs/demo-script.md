# Demo Script — CareFlow API Bridge

**Audience:** Salesforce MuleSoft Pre-Sales SE conversation with Josh.
**Length:** ~3 minutes spoken.
**Goal:** Show that you listened, learned what mattered, and built a relevant demo.

---

## Setup before the call

1. Run the backend in one PowerShell window: `cd backend; npm run dev`
2. Run the frontend in another PowerShell window: `cd frontend; npm run dev`
3. Open the dashboard at `http://localhost:5173`.
4. Click **Sample** to pre-load synthetic intake data.
5. Make sure the header shows "Backend Healthy" in mint green.

---

## What to say (verbatim option)

### 0:00 — Open and frame

> "After our conversation, I wanted to build something that connected directly to what you mentioned around MuleSoft, APIs, and bridging systems. So I built a small synthetic healthcare integration demo. The point is not that this is a production healthcare app. The point is to show how I think about API-led integration."

*(Have the dashboard already open in the browser. The form is pre-filled with sample data.)*

### 0:30 — Walk through the architecture

> "On the right you can see the architecture. There are three tiers. The Experience API is the front door — the intake form posts here. The Process API in the middle owns validation, transformation, routing, and dispatch. The System APIs on the right are mocks for EHR, scheduling, and notification. Each one is independently callable."

*(Point at the SVG architecture diagram.)*

### 1:00 — Submit and explain stages

> "Let me submit this synthetic intake."

*(Click **Submit Intake**.)*

> "First, validation runs. Required fields, types, valid enums. If anything fails, the request never makes it past the Experience API.
>
> Then transformation. You can see the raw flat payload on the left, and the canonical normalized structure on the right. This is the equivalent of DataWeave in a MuleSoft implementation.
>
> Then routing. The system applies business rules — urgency, appointment type, contact channel — and produces a routing decision with a reasoning trail you can audit.
>
> Then dispatch. Each System API gets called. Each one returns its result independently. The whole flow is logged."

### 2:00 — Why this matters

> "In my current world, I usually see these problems after something breaks. With this demo, I wanted to show how I'd think about it from a Solution Engineering angle: define the workflow, show the integration pattern, explain the business value, and make the technical flow clear.
>
> The key idea is that if a new downstream system needs to be added later, only the Process API's routing logic changes. The intake form stays the same. The existing System APIs stay the same. That's the reusability benefit MuleSoft is selling, just in a synthetic demo I could build in an evening."

### 2:30 — Close

> "It's not a real EHR integration. It's not HIPAA-compliant. It's not production-ready. Everything is synthetic. But it shows I understood what you said, and I can build to that pattern."

*(Stop. Let Josh react.)*

---

## What to show if Josh wants to dig deeper

- **"Show me a failure"** — clear the `firstName` field, submit, watch validation reject it cleanly with structured errors.
- **"Show me the routing logic"** — open `backend/services/routing.js` in your IDE. The rules are commented and readable.
- **"Show me the transformation"** — open `backend/services/transformation.js`. Point at how the flat payload becomes the canonical structure.
- **"Show me the API contract"** — `GET /api/health` returns the list of endpoints.
- **"How would you build this in real MuleSoft?"** — open `docs/mulesoft-mapping.md`. Walk through which concept maps where.

---

## What NOT to say

- ❌ "I built a MuleSoft app." (You did not. It's a MuleSoft-*style* demo.)
- ❌ "This is HIPAA-compliant." (It is not.)
- ❌ "I'm a MuleSoft expert." (You are not.)
- ❌ "This is production-ready." (It is not.)
- ❌ "I built it in 4 hours." (Even if true — let the demo speak.)

## What you DO want to say if asked about your background

- ✅ "I work in healthcare integration today, mostly on the troubleshooting side — HL7, SFTP, interface engines."
- ✅ "I see the pain of fragmented systems in my day job. This is how I'd think about preventing it on the SE side."
- ✅ "I'm motivated by the Solution Engineering angle because I want to be in the room when the workflow is defined, not just when it breaks."

## Time check

If you only have 90 seconds, drop the architecture walkthrough and go straight to "let me submit this intake." The transformation + routing + downstream cards do the work.

If you have 5+ minutes, show the integration log scrolling and explain that observability is the difference between an integration that "works" and an integration you can operate.

---

**Win condition for the demo:** Josh sees that you listened, learned what mattered, and built something relevant. That's it.
