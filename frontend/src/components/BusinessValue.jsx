import React from "react";

export default function BusinessValue() {
  return (
    <div className="business-value">
      <div className="bv-row">
        <div className="bv-item">
          <div className="bv-icon" style={{ color: "var(--accent-mint)" }}>↺</div>
          <div className="bv-text">
            <strong>Eliminate manual re-entry</strong>
            <span>One intake feeds three downstream systems.</span>
          </div>
        </div>
        <div className="bv-item">
          <div className="bv-icon" style={{ color: "var(--accent-cyan)" }}>≡</div>
          <div className="bv-text">
            <strong>Standardize intake data</strong>
            <span>Every consumer sees the same canonical shape.</span>
          </div>
        </div>
        <div className="bv-item">
          <div className="bv-icon" style={{ color: "var(--accent-amber)" }}>⇆</div>
          <div className="bv-text">
            <strong>Apply routing rules consistently</strong>
            <span>Business logic lives once, not in every channel.</span>
          </div>
        </div>
        <div className="bv-item">
          <div className="bv-icon" style={{ color: "var(--accent-violet)" }}>◉</div>
          <div className="bv-text">
            <strong>Auditable for troubleshooting</strong>
            <span>Every step traced. No black-box failures at 3am.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
