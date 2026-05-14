# CareFlow QA — Selenium Smoke Test

Automated browser smoke test for CareFlow API Bridge. Runs the same manual QA
checklist you would do by hand, but in 10 seconds, and in CI/headless mode.

> **Rule:** before sending the demo link to anyone, this test must pass against
> the URL you plan to send.

## What it checks

1. Page loads and title is "CareFlow API Bridge"
2. Backend Healthy tag is showing (not "checking..." or "Backend Offline")
3. Business Value, MuleSoft Mapping, API Contract, Architecture panels render
4. Submit Intake button clicks and triggers the pipeline
5. Payload Transformation panel populates with normalized JSON containing
   `intakeId`, `patient`, `appointment`, `routing`, `downstream`
6. Routing Decisions panel contains `urgent` and `new-patient-intake`
7. Downstream Mock EHR / Scheduling / Notification panels populate
8. Flow Events tab shows: `intake-received`, `validation-passed`,
   `transformation-complete`, `routing-decision`, `system-api-call`
9. Raw HTTP tab shows GET requests to `/api/...`
10. **For deployed URLs:** confirms the page is not silently calling `localhost`
    or `127.0.0.1` (the #1 cause of broken demo links)
11. No severe JavaScript errors in the browser console

Each failure saves a timestamped screenshot to `tests/screenshots/`.

## Setup (one-time)

From the project root:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements-test.txt
```

You also need Google Chrome installed. `webdriver-manager` downloads the
matching ChromeDriver automatically.

## Run against local dev server

Both `backend` and `frontend` must already be running (`npm run dev` in each).

```powershell
$env:CAREFLOW_URL = "http://localhost:5173"
python tests\smoke_careflow.py
```

## Run headless (no browser window pops up)

```powershell
$env:CAREFLOW_URL = "http://localhost:5173"
$env:HEADLESS = "1"
python tests\smoke_careflow.py
```

## Run against the deployed URL

```powershell
$env:CAREFLOW_URL = "https://your-careflow-url"
python tests\smoke_careflow.py
```

The localhost-network-call check **only runs when the URL is not local**, so
this is the test that catches the "frontend is deployed but still calling
localhost backend" bug.

## Exit codes

- `0` — all checks passed
- `1` — at least one check failed (see screenshot in `tests/screenshots/`)

## When to run

- Before adding the project to your portfolio
- Before sending the demo URL to anyone (Josh, hiring managers, anyone)
- After any change to the UI
- After any deployment
- As part of a pre-flight ritual for every demo session

## Why this matters

ChatGPT named the specific failure modes this prevents:

> Broken demos, dead buttons, localhost backend issues, missing payloads,
> and "it worked on my machine" problems.

This script proves the demo works *right now* on the *exact URL you're about
to share*. It is the single highest-leverage 30 seconds you can spend before
hitting send.
