import type { Metadata } from "next";
import { DemoFrame } from "@/components/DemoFrame";

export const metadata: Metadata = {
  title: "LineSight demo",
  description: "Interactive simulation of the Qoptra LineSight AI visual inspection station.",
};

export default function LineSightDemo() {
  return (
    <div className="container demo-shell">
      <div className="demo-head">
        <div>
          <span className="eyebrow">Live demo · simulated parts</span>
          <h1>LineSight visual inspection</h1>
          <p>
            This is what the station shows at the line. Parts pass under the camera, the AI scores each one, and anything unusual is
            rejected and photographed.
          </p>
        </div>
        <a className="btn" href="/demos/linesight.html" target="_blank" rel="noopener">Open full screen</a>
      </div>

      <div className="howto">
        <div className="card"><b>Change the line</b><p>Use the sliders for line speed and how many parts are defective.</p></div>
        <div className="card"><b>Set how strict it is</b><p>Move the sensitivity threshold and watch caught defects and false alarms change.</p></div>
        <div className="card"><b>See the business case</b><p>Retrain the model, create a shift report, and enter your own numbers in the payback calculator.</p></div>
      </div>

      <DemoFrame src="/demos/linesight.html" title="LineSight inspection demo" />
    </div>
  );
}
