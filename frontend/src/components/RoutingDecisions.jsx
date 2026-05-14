import React from "react";

export default function RoutingDecisions({ decisions }) {
  if (!decisions) return null;
  return (
    <div className="routing-decisions">
      <div className="decision-card">
        <div className="key">Priority</div>
        <div className="value">{decisions.schedulingPriority}</div>
      </div>
      <div className="decision-card">
        <div className="key">Queue</div>
        <div className="value">{decisions.schedulingQueue}</div>
      </div>
      <div className="decision-card">
        <div className="key">Notify Channel</div>
        <div className="value">{decisions.notifyChannel}</div>
      </div>
      {decisions.reasons && decisions.reasons.length > 0 && (
        <div className="decision-reasons">
          <div className="head">Reasoning Trail</div>
          <ul>
            {decisions.reasons.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
