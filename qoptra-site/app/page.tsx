import Link from "next/link";
import { Mark } from "@/components/Logo";
import { StationExplorer } from "@/components/StationExplorer";

const CONTACT_EMAIL = "hello@qoptra.com";

const icon = {
  camera: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="6" width="18" height="13" rx="2" /><circle cx="12" cy="12.5" r="3.5" /><path d="M8 6l1.5-2h5L16 6" />
    </svg>
  ),
  lens: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" />
    </svg>
  ),
  light: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9V16h7v-2.1A6 6 0 0 0 12 3z" />
    </svg>
  ),
  chip: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <rect x="6" y="6" width="12" height="12" rx="2" /><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" />
    </svg>
  ),
  plug: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M9 2v6M15 2v6M6 8h12v3a6 6 0 0 1-12 0V8zM12 17v5" />
    </svg>
  ),
  box: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 7l9-4 9 4v10l-9 4-9-4V7z" /><path d="M3 7l9 4 9-4M12 11v10" />
    </svg>
  ),
};

const KIT = [
  { i: icon.camera, t: "Industrial camera", d: "Global-shutter USB3 camera. Sharp images of moving parts, built for 24/7 use." },
  { i: icon.lens, t: "Lens", d: "C-mount lens chosen for your part size and working distance, so small defects stay visible." },
  { i: icon.light, t: "LED lighting", d: "Ring, bar or dome light depending on the surface. Shiny metal and matte plastic need different light." },
  { i: icon.chip, t: "Edge AI computer", d: "NVIDIA Jetson at the line. Runs the model locally, works without internet." },
  { i: icon.plug, t: "Line connection", d: "Digital outputs to your PLC, a signal tower or an air jet that removes rejected parts." },
  { i: icon.box, t: "Mount and enclosure", d: "Aluminium profile mount and dust-protected housing that bolts onto your existing conveyor." },
];

export default function Home() {
  return (
    <>
      <section className="container hero">
        <div className="hero-copy">
          <span className="tag"><span className="dot" />Prototype running</span>
          <h1>
            Cameras and AI that check every part. <span>Running on your line in a day.</span>
          </h1>
          <p>
            Qoptra builds compact vision stations for manufacturers. Mount a camera over your conveyor, show it good parts, and it flags
            the bad ones automatically.
          </p>
          <div className="hero-actions">
            <Link className="btn primary" href="/demos/linesight">Try the live demo</Link>
            <Link className="btn" href="#how">See how it works</Link>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <Mark size={260} />
          <span className="scan" />
        </div>
      </section>

      <div className="container" style={{ paddingBottom: 96 }}>
        <div className="facts">
          <div className="fact"><b>~25 good parts</b><span>to teach it a new product. No defect photos needed.</span></div>
          <div className="fact"><b>Every part</b><span>checked at line speed, not a random sample.</span></div>
          <div className="fact"><b>Stays local</b><span>Images are processed at the line and never leave the factory.</span></div>
          <div className="fact"><b>Fixed price</b><span>One published setup fee and a monthly subscription.</span></div>
        </div>
      </div>

      <section className="section" id="how">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">How it works</span>
            <h2>One inspection station, six parts</h2>
            <p>Click through the station to see what each piece of hardware does as a part passes underneath.</p>
          </div>
          <StationExplorer />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Setup</span>
            <h2>From delivery to running in one day</h2>
          </div>
          <div className="steps">
            <div className="step"><h3>Mount</h3><p>We bolt the camera, light and computer onto your existing conveyor. No line changes.</p></div>
            <div className="step"><h3>Teach</h3><p>Run about 25 good parts past the camera. The model learns what normal looks like.</p></div>
            <div className="step"><h3>Tune</h3><p>Together with your quality team we set how strict it should be, using real parts.</p></div>
            <div className="step"><h3>Run</h3><p>It checks every part, removes rejects and keeps a photo of each one for your records.</p></div>
          </div>
        </div>
      </section>

      <section className="section" id="hardware">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Hardware</span>
            <h2>What is in the box</h2>
            <p>Industrial off-the-shelf components, selected and tuned for each line, with our software on top.</p>
          </div>
          <div className="kit">
            {KIT.map((k) => (
              <div className="card" key={k.t}>
                <span className="icon">{k.i}</span>
                <h3>{k.t}</h3>
                <p>{k.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Demos</span>
            <h2>Try it in your browser</h2>
            <p>Our demos simulate the real station so you can see what operators and quality managers would see.</p>
          </div>
          <div className="demo-grid">
            <Link href="/demos/linesight" className="card demo-card">
              <span className="tag"><span className="dot" />Live demo</span>
              <h3>LineSight</h3>
              <p>Visual inspection of metal brackets on a running conveyor: live verdicts, reject photos, shift report and a payback calculator.</p>
              <span className="go">Open demo →</span>
            </Link>
            <Link href="/demos/acusight" className="card demo-card">
              <span className="tag"><span className="dot" />Live demo</span>
              <h3>AcuSight</h3>
              <p>Predictive maintenance: an acoustic camera, thermal imaging and vibration sensors hear and see machine wear weeks before a breakdown.</p>
              <span className="go">Open demo →</span>
            </Link>
            <div className="card demo-card soon">
              <span className="tag"><span className="dot soon" />Coming soon</span>
              <h3>Your part</h3>
              <p>Send us photos of your part and we will build a demo with it.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="contact">
        <div className="container contact">
          <div>
            <h2>Want to see it on your own parts?</h2>
            <p>We are looking for Austrian manufacturers to pilot the first stations. Tell us what you produce and how you check it today.</p>
          </div>
          <a className="btn primary" href={`mailto:${CONTACT_EMAIL}?subject=Qoptra%20pilot`}>{CONTACT_EMAIL}</a>
        </div>
      </section>
    </>
  );
}
