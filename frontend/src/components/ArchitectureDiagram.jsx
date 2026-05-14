import React from "react";

// Inline SVG architecture diagram showing the 3-tier API-led pattern.
export default function ArchitectureDiagram({ activeStage }) {
  const cyan = "#7dd3fc";
  const mint = "#86efac";
  const violet = "#c4b5fd";
  const amber = "#fbbf24";
  const border = "#2a3445";
  const text0 = "#e6edf3";
  const text2 = "#6e7681";

  return (
    <svg viewBox="0 0 720 280" className="arch-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={border} />
        </marker>
      </defs>

      {/* Experience API */}
      <g>
        <rect x="20" y="100" width="120" height="80" rx="6" fill="#0b0f15" stroke={cyan} strokeWidth="1.5" />
        <text x="80" y="128" fill={cyan} fontFamily="JetBrains Mono, monospace" fontSize="11" fontWeight="700" textAnchor="middle">EXPERIENCE</text>
        <text x="80" y="146" fill={text0} fontFamily="Inter, sans-serif" fontSize="11" textAnchor="middle">Intake Form</text>
        <text x="80" y="162" fill={text2} fontFamily="JetBrains Mono, monospace" fontSize="9" textAnchor="middle">POST /api/intake</text>
      </g>

      {/* Process API */}
      <g>
        <rect x="220" y="60" width="180" height="160" rx="6" fill="#0b0f15" stroke={amber} strokeWidth="1.5" />
        <text x="310" y="84" fill={amber} fontFamily="JetBrains Mono, monospace" fontSize="11" fontWeight="700" textAnchor="middle">PROCESS</text>

        {/* Stages */}
        <rect x="240" y="98" width="140" height="22" rx="3" fill="#11161f" stroke={border} />
        <text x="310" y="113" fill={text0} fontFamily="JetBrains Mono, monospace" fontSize="10" textAnchor="middle">1 · Validate</text>

        <rect x="240" y="126" width="140" height="22" rx="3" fill="#11161f" stroke={border} />
        <text x="310" y="141" fill={text0} fontFamily="JetBrains Mono, monospace" fontSize="10" textAnchor="middle">2 · Transform</text>

        <rect x="240" y="154" width="140" height="22" rx="3" fill="#11161f" stroke={border} />
        <text x="310" y="169" fill={text0} fontFamily="JetBrains Mono, monospace" fontSize="10" textAnchor="middle">3 · Route</text>

        <rect x="240" y="182" width="140" height="22" rx="3" fill="#11161f" stroke={border} />
        <text x="310" y="197" fill={text0} fontFamily="JetBrains Mono, monospace" fontSize="10" textAnchor="middle">4 · Dispatch</text>
      </g>

      {/* System APIs */}
      <g>
        <rect x="480" y="30" width="220" height="60" rx="6" fill="#0b0f15" stroke={cyan} strokeWidth="1.5" />
        <text x="590" y="55" fill={cyan} fontFamily="JetBrains Mono, monospace" fontSize="11" fontWeight="700" textAnchor="middle">SYSTEM · MOCK EHR</text>
        <text x="590" y="73" fill={text2} fontFamily="JetBrains Mono, monospace" fontSize="9" textAnchor="middle">GET /api/mock/ehr/:id</text>

        <rect x="480" y="110" width="220" height="60" rx="6" fill="#0b0f15" stroke={mint} strokeWidth="1.5" />
        <text x="590" y="135" fill={mint} fontFamily="JetBrains Mono, monospace" fontSize="11" fontWeight="700" textAnchor="middle">SYSTEM · MOCK SCHEDULING</text>
        <text x="590" y="153" fill={text2} fontFamily="JetBrains Mono, monospace" fontSize="9" textAnchor="middle">POST /api/mock/scheduling</text>

        <rect x="480" y="190" width="220" height="60" rx="6" fill="#0b0f15" stroke={violet} strokeWidth="1.5" />
        <text x="590" y="215" fill={violet} fontFamily="JetBrains Mono, monospace" fontSize="11" fontWeight="700" textAnchor="middle">SYSTEM · MOCK NOTIFICATION</text>
        <text x="590" y="233" fill={text2} fontFamily="JetBrains Mono, monospace" fontSize="9" textAnchor="middle">POST /api/mock/notification</text>
      </g>

      {/* Connecting arrows */}
      <line x1="140" y1="140" x2="218" y2="140" stroke={border} strokeWidth="1.5" markerEnd="url(#arrow)" />
      <line x1="400" y1="100" x2="478" y2="60" stroke={border} strokeWidth="1.5" markerEnd="url(#arrow)" />
      <line x1="400" y1="140" x2="478" y2="140" stroke={border} strokeWidth="1.5" markerEnd="url(#arrow)" />
      <line x1="400" y1="180" x2="478" y2="220" stroke={border} strokeWidth="1.5" markerEnd="url(#arrow)" />

      {/* Labels */}
      <text x="20" y="262" fill={text2} fontFamily="JetBrains Mono, monospace" fontSize="9">Tier 1 — Front Door</text>
      <text x="240" y="262" fill={text2} fontFamily="JetBrains Mono, monospace" fontSize="9">Tier 2 — Orchestration & Business Rules</text>
      <text x="480" y="262" fill={text2} fontFamily="JetBrains Mono, monospace" fontSize="9">Tier 3 — Downstream Systems</text>
    </svg>
  );
}
