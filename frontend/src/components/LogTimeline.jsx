import React, { useState, useMemo } from "react";

const FLOW_KINDS = new Set([
  "intake-received",
  "validation-passed",
  "validation-failed",
  "transformation-complete",
  "routing",
  "routing-decision",
  "system-api-call",
  "direct-system-call"
]);

function shortTime(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString("en-US", { hour12: false });
  } catch {
    return iso;
  }
}

function summarize(entry) {
  switch (entry.kind) {
    case "http":
      return `${entry.method} ${entry.path} → ${entry.status} (${entry.durationMs}ms)`;
    case "intake-received":
      return `keys: ${(entry.payloadKeys || []).join(", ")}`;
    case "validation-passed":
      return "all required fields present";
    case "validation-failed":
      return (entry.errors || []).join(" | ");
    case "transformation-complete":
      return `intakeId=${entry.intakeId}`;
    case "routing":
      return `applying routing rules for ${entry.intakeId}`;
    case "routing-decision":
      return `priority=${entry.decisions?.schedulingPriority}, queue=${entry.decisions?.schedulingQueue}, notify=${entry.decisions?.notifyChannel}`;
    case "system-api-call":
      return `${entry.system} ← ${entry.intakeId}`;
    case "direct-system-call":
      return `${entry.system} direct call`;
    default:
      return JSON.stringify(entry).slice(0, 120);
  }
}

export default function LogTimeline({ logs }) {
  const [tab, setTab] = useState("flow");

  const filtered = useMemo(() => {
    if (!logs) return [];
    if (tab === "flow") {
      return logs.filter((e) => FLOW_KINDS.has(e.kind));
    }
    if (tab === "http") {
      return logs.filter((e) => e.kind === "http");
    }
    return logs;
  }, [logs, tab]);

  const flowCount = useMemo(
    () => (logs || []).filter((e) => FLOW_KINDS.has(e.kind)).length,
    [logs]
  );
  const httpCount = useMemo(
    () => (logs || []).filter((e) => e.kind === "http").length,
    [logs]
  );

  return (
    <div className="log-container">
      <div className="log-tabs">
        <button
          className={`log-tab ${tab === "flow" ? "active" : ""}`}
          onClick={() => setTab("flow")}
          data-testid="flow-events-tab"
        >
          Flow Events <span className="tab-count">{flowCount}</span>
        </button>
        <button
          className={`log-tab ${tab === "http" ? "active" : ""}`}
          onClick={() => setTab("http")}
          data-testid="raw-http-tab"
        >
          Raw HTTP <span className="tab-count">{httpCount}</span>
        </button>
        <span className="log-hint">
          {tab === "flow"
            ? "business/integration events only"
            : "all HTTP requests including polling"}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="empty">
          {tab === "flow"
            ? "No flow events yet. Submit an intake to populate the timeline."
            : "No HTTP requests yet."}
        </div>
      ) : (
        <div
          className="log-list"
          data-testid={tab === "flow" ? "flow-events-list" : "raw-http-list"}
        >
          {filtered.map((entry, i) => (
            <div key={i} className="log-entry">
              <span className="ts">{shortTime(entry.timestamp)}</span>
              <span className="body-log">
                <span className={`kind ${entry.kind}`}>{entry.kind}</span>
                {summarize(entry)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
