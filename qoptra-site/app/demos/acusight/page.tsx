import type { Metadata } from "next";
import { DemoFrame } from "@/components/DemoFrame";

export const metadata: Metadata = {
  title: "AcuSight demo",
  description: "Interactive simulation of Qoptra AcuSight: ultrasound, thermal and vibration sensing for predictive maintenance.",
};

export default function AcuSightDemo() {
  return (
    <div className="container demo-shell">
      <div className="demo-head">
        <div>
          <span className="eyebrow">Live demo · simulated plant</span>
          <h1>AcuSight predictive maintenance</h1>
          <p>
            An ultrasonic microphone array, a thermal camera and vibration sensors watch the machines of a rolling line. Bearing wear,
            leaks and overheating show up weeks before a breakdown, while there is still time to plan the repair.
          </p>
        </div>
        <a className="btn" href="/demos/acusight.html" target="_blank" rel="noopener">Open full screen</a>
      </div>

      <div className="howto">
        <div className="card"><b>Pick a machine</b><p>See where the sound comes from, the thermal image and the live ultrasonic spectrum.</p></div>
        <div className="card"><b>Inject a fault</b><p>Speed up time and watch which sensor notices first, and how many days of warning you get.</p></div>
        <div className="card"><b>Plan the repair</b><p>Fix it before it breaks and see the downtime cost avoided, then try your own plant numbers.</p></div>
      </div>

      <DemoFrame src="/demos/acusight.html" title="AcuSight predictive maintenance demo" />
    </div>
  );
}
