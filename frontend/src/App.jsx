import React, { useState, useEffect, useCallback, useRef } from "react";
import IntakeForm from "./components/IntakeForm.jsx";
import Pipeline from "./components/Pipeline.jsx";
import PayloadDiff from "./components/PayloadDiff.jsx";
import RoutingDecisions from "./components/RoutingDecisions.jsx";
import SystemCards from "./components/SystemCards.jsx";
import LogTimeline from "./components/LogTimeline.jsx";
import ArchitectureDiagram from "./components/ArchitectureDiagram.jsx";
import BusinessValue from "./components/BusinessValue.jsx";
import MuleSoftMapping from "./components/MuleSoftMapping.jsx";
import ApiContract from "./components/ApiContract.jsx";

export default function App() {
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState(null);
  const [logs, setLogs] = useState([]);
  const [healthy, setHealthy] = useState(null);
  const [highlightPayload, setHighlightPayload] = useState(false);

  const payloadRef = useRef(null);

  const stage = errors
    ? "validation"
    : result
    ? "complete"
    : null;

  const fetchLogs = useCallback(async () => {
    try {
      const r = await fetch("/api/logs?limit=80");
      const j = await r.json();
      if (j.ok) setLogs(j.logs);
    } catch (_) {
      // silent
    }
  }, []);

  const fetchHealth = useCallback(async () => {
    try {
      const r = await fetch("/api/health");
      const j = await r.json();
      setHealthy(j.ok && j.status === "healthy");
    } catch (_) {
      setHealthy(false);
    }
  }, []);

  useEffect(() => {
    fetchHealth();
    fetchLogs();
    const id = setInterval(fetchLogs, 4000);
    return () => clearInterval(id);
  }, [fetchHealth, fetchLogs]);

  const submitIntake = async (payload) => {
    setSubmitting(true);
    setErrors(null);
    try {
      const r = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const j = await r.json();
      if (!j.ok) {
        setErrors(j.errors || ["Unknown error"]);
        setResult(null);
      } else {
        setResult({ ...j, raw: payload });
        setErrors(null);
        setTimeout(() => {
          if (payloadRef.current) {
            payloadRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
          }
          setHighlightPayload(true);
          setTimeout(() => setHighlightPayload(false), 2200);
        }, 80);
      }
      fetchLogs();
    } catch (e) {
      setErrors([`Network error: ${e.message}`]);
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setResult(null);
    setErrors(null);
  };

  return (
    <div className="app" data-testid="app-root">
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark"><span className="dot" /></span>
          <div>
            <h1 data-testid="app-title">CareFlow API Bridge</h1>
            <div className="subtitle">
              API-led bridge between intake, scheduling, EHR, and notification workflows · MuleSoft-style demo
            </div>
          </div>
        </div>
        <div className="header-meta">
          <span className="tag synthetic" data-testid="synthetic-tag">Synthetic Data Only</span>
          <span
            className={`tag ${healthy ? "healthy" : healthy === false ? "error" : ""}`}
            data-testid="backend-status"
          >
            {healthy === null ? "checking…" : healthy ? "Backend Healthy" : "Backend Offline"}
          </span>
        </div>
      </header>

      <div className="main-grid">
        <section className="panel">
          <div className="panel-header">
            <h2>Experience API · Intake</h2>
            <span className="label">POST /api/intake</span>
          </div>
          <div className="panel-body">
            {errors && (
              <div className="error-banner" data-testid="validation-errors">
                <h3>Validation failed</h3>
                <ul>
                  {errors.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              </div>
            )}
            <IntakeForm
              onSubmit={submitIntake}
              onReset={reset}
              submitting={submitting}
            />
          </div>
        </section>

        <div className="right-col">
          <section className="panel" data-testid="business-value">
            <div className="panel-header">
              <h2>Business Value</h2>
              <span className="label">why this matters</span>
            </div>
            <BusinessValue />
          </section>

          <section className="panel" data-testid="process-pipeline">
            <div className="panel-header">
              <h2>Process Pipeline</h2>
              <span className="label">validate · transform · route · dispatch</span>
            </div>
            <Pipeline stage={stage} hasResult={!!result} hasErrors={!!errors} />
          </section>

          <section
            ref={payloadRef}
            className={`panel ${highlightPayload ? "panel-highlight" : ""}`}
            data-testid="payload-transformation"
          >
            <div className="panel-header">
              <h2>Payload Transformation</h2>
              <span className="label">DataWeave equivalent</span>
            </div>
            {result ? (
              <PayloadDiff before={result.raw} after={result.normalized} />
            ) : (
              <div className="empty">Submit an intake to see the transformation.</div>
            )}
          </section>

          {result && (
            <section className="panel" data-testid="routing-decisions">
              <div className="panel-header">
                <h2>Routing Decisions</h2>
                <span className="label">business rules applied</span>
              </div>
              <RoutingDecisions decisions={result.routingDecisions} />
            </section>
          )}

          {result && (
            <section className="panel" data-testid="downstream-systems">
              <div className="panel-header">
                <h2>Downstream System APIs</h2>
                <span className="label">mock EHR · scheduling · notification</span>
              </div>
              <SystemCards downstream={result.downstream} />
            </section>
          )}

          <section className="panel" data-testid="architecture-section">
            <div className="panel-header">
              <h2>Architecture</h2>
              <span className="label">API-led connectivity</span>
            </div>
            <div className="arch">
              <ArchitectureDiagram activeStage={stage} />
            </div>
          </section>

          <section className="panel" data-testid="mulesoft-mapping">
            <div className="panel-header">
              <h2>How This Maps to MuleSoft</h2>
              <span className="label">concept ↔ implementation</span>
            </div>
            <MuleSoftMapping />
          </section>

          <section className="panel" data-testid="api-contract">
            <div className="panel-header">
              <h2>API Contract</h2>
              <span className="label">all endpoints</span>
            </div>
            <ApiContract />
          </section>

          <section className="panel" data-testid="integration-log">
            <div className="panel-header">
              <h2>Integration Log</h2>
              <span className="label">GET /api/logs</span>
            </div>
            <LogTimeline logs={logs} />
          </section>
        </div>
      </div>

      <footer className="app-footer">
        CareFlow API Bridge · Synthetic Demo · No PHI · No Real Patient Data · Built by Joe Quinn
      </footer>
    </div>
  );
}
