import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Demos",
  description: "Interactive demos of Qoptra hardware and software.",
};

export default function Demos() {
  return (
    <div className="container demo-shell">
      <div className="section-head" style={{ marginBottom: 16 }}>
        <span className="eyebrow">Demos</span>
        <h1 style={{ fontSize: "clamp(34px, 5vw, 52px)" }}>See our hardware at work</h1>
        <p>Each demo simulates a real Qoptra station, so you can try it without a factory floor.</p>
      </div>
      <div className="demo-grid">
        <Link href="/demos/linesight" className="card demo-card">
          <span className="tag"><span className="dot" />Live demo</span>
          <h3>LineSight</h3>
          <p>AI visual inspection on a running conveyor. Learns from good parts only and rejects anything unusual.</p>
          <span className="go">Open demo →</span>
        </Link>
        <Link href="/demos/acusight" className="card demo-card">
          <span className="tag"><span className="dot" />Live demo</span>
          <h3>AcuSight</h3>
          <p>Predictive maintenance for heavy industry. Ultrasound, thermal imaging and vibration catch bearing wear and leaks weeks before a breakdown.</p>
          <span className="go">Open demo →</span>
        </Link>
        <div className="card demo-card soon">
          <span className="tag"><span className="dot soon" />Coming soon</span>
          <h3>Your part</h3>
          <p>Send us photos of your part and we will build a demo with it.</p>
        </div>
      </div>
    </div>
  );
}
