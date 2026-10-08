"use client";

import { useState } from "react";

type Comp = { id: string; name: string; desc: string };

const COMPS: Comp[] = [
  {
    id: "sensor",
    name: "Trigger sensor",
    desc: "A light-barrier sensor notices when a part arrives and tells the camera to take the photo at exactly the right moment.",
  },
  {
    id: "light",
    name: "LED lighting",
    desc: "A dedicated LED light gives every photo the same lighting, so the AI sees the part itself and not shadows or reflections from the hall.",
  },
  {
    id: "camera",
    name: "Industrial camera",
    desc: "A global-shutter camera takes a sharp image of every part, even while the conveyor keeps moving at full speed.",
  },
  {
    id: "edge",
    name: "Edge AI computer",
    desc: "A small NVIDIA computer next to the line compares each image with what a good part looks like and decides OK or NOT OK in a fraction of a second. Images never leave the factory.",
  },
  {
    id: "reject",
    name: "Reject output",
    desc: "The OK / NOT OK signal goes to the line controller (PLC) or straight to an air jet or pusher that removes the bad part.",
  },
  {
    id: "screen",
    name: "Dashboard",
    desc: "Operators and quality managers see live results, photos of every reject and ready-made shift reports on any screen.",
  },
];

export function StationExplorer() {
  const [sel, setSel] = useState("camera");
  const on = (id: string) => sel === id;
  const stroke = (id: string) => (on(id) ? "var(--accent)" : "var(--line-2)");
  const fill = (id: string) => (on(id) ? "var(--accent-soft)" : "var(--surface-2)");
  const ink = (id: string) => (on(id) ? "var(--accent)" : "var(--muted)");

  return (
    <div className="explorer">
      <svg
        className="station-svg"
        viewBox="0 0 800 460"
        role="img"
        aria-label="Diagram of an inspection station: parts move along a conveyor past a sensor, a light and a camera; an edge computer decides and a pusher removes bad parts."
      >
        {/* cables */}
        <g stroke="var(--line-2)" strokeWidth="2" strokeDasharray="5 6" fill="none">
          <path d="M440 70 H600" />
          <path d="M660 110 V250 H600" />
          <path d="M600 70 C 520 20, 260 20, 180 70" />
          <path d="M250 270 V200 H360" />
        </g>

        {/* field of view */}
        <path d="M385 135 L415 135 L470 300 L330 300 Z" fill={on("camera") ? "rgba(76,141,255,.14)" : "rgba(255,255,255,.04)"} />

        {/* conveyor */}
        <rect x="20" y="300" width="760" height="44" rx="22" fill="var(--surface-2)" stroke="var(--line-2)" strokeWidth="2" />
        {[60, 160, 260, 360, 460, 560, 660, 740].map((x) => (
          <circle key={x} cx={x} cy="322" r="11" fill="none" stroke="var(--line-2)" strokeWidth="2" />
        ))}
        <rect x="80" y="360" width="16" height="70" fill="var(--line)" />
        <rect x="700" y="360" width="16" height="70" fill="var(--line)" />

        {/* moving part */}
        <g className="part">
          <rect x="0" y="272" width="84" height="28" rx="5" fill="#c3cbd1" stroke="#8a96a0" />
          <circle cx="22" cy="286" r="5" fill="var(--surface-2)" />
          <circle cx="62" cy="286" r="5" fill="var(--surface-2)" />
        </g>

        {/* mount */}
        <rect x="392" y="20" width="16" height="26" fill="var(--line)" />
        <rect x="300" y="14" width="200" height="10" rx="5" fill="var(--line)" />

        {/* camera */}
        <g className="hl">
          <rect x="360" y="46" width="80" height="54" rx="8" fill={fill("camera")} stroke={stroke("camera")} strokeWidth="2.5" />
          <rect x="384" y="100" width="32" height="22" rx="4" fill={fill("camera")} stroke={stroke("camera")} strokeWidth="2.5" />
          <circle cx="400" cy="73" r="12" fill="none" stroke={stroke("camera")} strokeWidth="2.5" />
        </g>

        {/* light */}
        <g className="hl">
          <rect x="340" y="140" width="120" height="16" rx="8" fill={fill("light")} stroke={stroke("light")} strokeWidth="2.5" />
          {[360, 380, 400, 420, 440].map((x) => (
            <circle key={x} cx={x} cy="148" r="3" fill={ink("light")} />
          ))}
        </g>

        {/* sensor */}
        <g className="hl">
          <rect x="236" y="250" width="28" height="22" rx="4" fill={fill("sensor")} stroke={stroke("sensor")} strokeWidth="2.5" />
          <path d="M250 272 V300" stroke={ink("sensor")} strokeWidth="2" strokeDasharray="3 4" />
        </g>

        {/* edge computer */}
        <g className="hl">
          <rect x="600" y="40" width="120" height="70" rx="10" fill={fill("edge")} stroke={stroke("edge")} strokeWidth="2.5" />
          {[616, 630, 644, 658, 672, 686, 700].map((x) => (
            <path key={x} d={`M${x} 54 V96`} stroke={ink("edge")} strokeWidth="2" opacity=".5" />
          ))}
        </g>

        {/* reject pusher */}
        <g className="hl">
          <rect x="540" y="236" width="60" height="30" rx="5" fill={fill("reject")} stroke={stroke("reject")} strokeWidth="2.5" />
          <rect x="560" y="266" width="20" height="18" fill={fill("reject")} stroke={stroke("reject")} strokeWidth="2.5" />
          <path d="M570 360 V400 M560 390 L570 402 L580 390" stroke={ink("reject")} strokeWidth="2.5" fill="none" />
        </g>

        {/* dashboard */}
        <g className="hl">
          <rect x="70" y="50" width="140" height="92" rx="10" fill={fill("screen")} stroke={stroke("screen")} strokeWidth="2.5" />
          <rect x="86" y="66" width="56" height="34" rx="4" fill="none" stroke={ink("screen")} strokeWidth="2" />
          <path d="M152 70 H194 M152 84 H184 M86 116 H194 M86 128 H160" stroke={ink("screen")} strokeWidth="2" />
          <path d="M120 142 V162 M100 166 H160" stroke="var(--line-2)" strokeWidth="3" />
        </g>

        {/* labels */}
        <g fontFamily="var(--f-mono)" fontSize="13" fill="var(--muted)">
          <text x="250" y="240" textAnchor="middle">1</text>
          <text x="476" y="153">2</text>
          <text x="452" y="78">3</text>
          <text x="660" y="132" textAnchor="middle">4</text>
          <text x="612" y="256">5</text>
          <text x="140" y="38" textAnchor="middle">6</text>
          <text x="40" y="380">Parts in →</text>
        </g>
      </svg>

      <div className="comp-list">
        {COMPS.map((c, i) => (
          <button key={c.id} type="button" className="comp" aria-pressed={on(c.id)} onClick={() => setSel(c.id)}>
            <span className="num">{i + 1}</span>
            <span>
              <b>{c.name}</b>
              <span className="d">{c.desc}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
