import React from "react";

export default function PayloadDiff({ before, after }) {
  return (
    <div className="payloads">
      <div className="payload-box" data-testid="payload-before">
        <div className="head">
          <span>Before · Flat Intake Payload</span>
          <span className="marker before">RAW</span>
        </div>
        <pre>{JSON.stringify(before, null, 2)}</pre>
      </div>
      <div className="payload-box" data-testid="payload-after">
        <div className="head">
          <span>After · Canonical Internal Structure</span>
          <span className="marker after">NORMALIZED</span>
        </div>
        <pre>{JSON.stringify(after, null, 2)}</pre>
      </div>
    </div>
  );
}
