import React from "react";

const CONTRACT = [
  { tier: "Experience", color: "var(--accent-cyan)", endpoints: [
    { method: "POST", path: "/api/intake", desc: "Submit a synthetic intake" },
    { method: "GET", path: "/api/intake/:id/status", desc: "Look up an intake by id" }
  ]},
  { tier: "System", color: "var(--accent-mint)", endpoints: [
    { method: "GET", path: "/api/mock/ehr/:id", desc: "Mock EHR lookup" },
    { method: "POST", path: "/api/mock/scheduling", desc: "Mock scheduling" },
    { method: "POST", path: "/api/mock/notification", desc: "Mock notification" }
  ]},
  { tier: "Ops", color: "var(--accent-violet)", endpoints: [
    { method: "GET", path: "/api/health", desc: "Health + endpoint discovery" },
    { method: "GET", path: "/api/logs", desc: "Integration log (filterable)" }
  ]}
];

const METHOD_COLORS = {
  GET: "var(--accent-cyan)",
  POST: "var(--accent-mint)",
  PUT: "var(--accent-amber)",
  DELETE: "var(--accent-rose)"
};

export default function ApiContract() {
  return (
    <div className="api-contract">
      {CONTRACT.map((group) => (
        <div className="contract-group" key={group.tier}>
          <div className="contract-tier" style={{ color: group.color, borderColor: group.color }}>
            {group.tier} Tier
          </div>
          <ul className="contract-list">
            {group.endpoints.map((e) => (
              <li key={e.method + e.path}>
                <span
                  className="contract-method"
                  style={{ color: METHOD_COLORS[e.method] || "var(--text-1)" }}
                >
                  {e.method}
                </span>
                <span className="contract-path">{e.path}</span>
                <span className="contract-desc">{e.desc}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
