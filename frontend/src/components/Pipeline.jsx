import React from "react";

const STAGES = [
  { key: "validate", name: "Validate", desc: "Required fields & types", icon: "1" },
  { key: "transform", name: "Transform", desc: "Canonical structure", icon: "2" },
  { key: "route", name: "Route", desc: "Business rules", icon: "3" },
  { key: "dispatch", name: "Dispatch", desc: "Call System APIs", icon: "4" }
];

export default function Pipeline({ stage, hasResult, hasErrors }) {
  // Determine state of each stage
  const stageState = (key) => {
    if (hasErrors && key === "validate") return "active";
    if (hasErrors) return ""; // not reached
    if (hasResult) return "done";
    return "";
  };

  return (
    <div className="pipeline">
      {STAGES.map((s) => (
        <div key={s.key} className={`pipeline-stage ${stageState(s.key)}`}>
          <div className="icon">{s.icon}</div>
          <div className="name">{s.name}</div>
          <div className="desc">{s.desc}</div>
        </div>
      ))}
    </div>
  );
}
