import React from "react";

const ROWS = [
  { concept: "Experience API", here: "Intake form / frontend entry point", marker: "EXP" },
  { concept: "Process API", here: "Validation, transformation, routing, dispatch", marker: "PRC" },
  { concept: "System APIs", here: "Mock EHR, Scheduling, Notification", marker: "SYS" },
  { concept: "DataWeave", here: "Payload transformation logic (services/transformation.js)", marker: "TRX" },
  { concept: "API Manager", here: "Where governance, auth, rate limiting would live", marker: "GOV" },
  { concept: "Runtime Manager", here: "Where deployment + monitoring would live", marker: "RUN" },
  { concept: "Anypoint MQ", here: "Could decouple Process → System with a queue", marker: "MQ" }
];

export default function MuleSoftMapping() {
  return (
    <div className="ms-mapping">
      <table>
        <thead>
          <tr>
            <th>MuleSoft Concept</th>
            <th>This Demo</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr key={r.concept}>
              <td>
                <span className="ms-marker">{r.marker}</span>
                <span className="ms-concept">{r.concept}</span>
              </td>
              <td className="ms-here">{r.here}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="ms-note">
        Not a MuleSoft implementation. A MuleSoft-<em>style</em> demo to show
        I understand the pattern.
      </p>
    </div>
  );
}
