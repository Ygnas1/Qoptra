import type { Metadata } from "next";
import Link from "next/link";
import { ModelTester } from "@/components/ModelTester";

export const metadata: Metadata = {
  title: "Showcase",
  description:
    "Watch the Qoptra LineSight model inspect circuit boards on a moving line, read how it was trained, and test it with your own images.",
};

const STATS = [
  { b: "0 defect photos", s: "used in training. It learned from 200 photos of good boards only." },
  { b: "96 of 100", s: "defective boards caught in testing on boards it had never seen." },
  { b: "2 of 100", s: "good boards raised a false alarm in the same test." },
  { b: "0.994", s: "AUROC: how well scores separate good from defective boards (1.0 is perfect)." },
];

export default function Showcase() {
  return (
    <div className="showcase">
      <section className="container showcase-head">
        <span className="tag"><span className="dot" />Prototype showcase</span>
        <h1>Watch LineSight inspect a moving line</h1>
        <p>
          A trained model checks every circuit board as it passes the camera. When it sees something wrong it flashes the signal tower,
          sounds an alarm and notifies the shift lead. Below: the footage, how the model works, and a way to test it yourself.
        </p>
      </section>

      <section className="container video-section" aria-labelledby="sc-video">
        <div className="video-head">
          <span className="eyebrow">Detection run</span>
          <h2 id="sc-video">Boards on the belt, scored one by one</h2>
        </div>
        <video
          className="video showcase-video"
          src="/video/linesight-detection.mp4"
          poster="/video/linesight-detection-poster.jpg"
          controls
          playsInline
          preload="metadata"
        />
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">What you see in the video</span>
            <h2>Three things happen for every board</h2>
          </div>
          <div className="steps three">
            <div className="step"><h3>Look</h3><p>A camera above the belt takes a picture the moment a board reaches the marked inspection zone.</p></div>
            <div className="step"><h3>Score</h3><p>The model compares the picture with what good boards look like and gives a score. Low score: OK. High score: something is off.</p></div>
            <div className="step"><h3>Alert</h3><p>Above the threshold, the signal tower turns red, an alarm sounds and the shift lead is notified.</p></div>
          </div>
        </div>
      </section>

      <section className="section" id="model">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">The model</span>
            <h2>It only needs to learn what good looks like</h2>
            <p>
              Factories rarely have photos of every possible defect, and new defects appear all the time. LineSight does not try to recognise
              defects. It learns what a good part looks like and flags whatever differs.
            </p>
          </div>
          <div className="facts">
            {STATS.map((s) => (
              <div className="fact" key={s.b}><b>{s.b}</b><span>{s.s}</span></div>
            ))}
          </div>
          <p className="note">Measured on 200 boards held back from training (100 good, 100 with real defects). Results on your own parts will differ.</p>
        </div>
      </section>

      <section className="section" id="try">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Try it</span>
            <h2>Test the model with your own image</h2>
            <p>
              Upload any picture and the model will say honestly what it makes of it. If the picture is something it was never trained on, it says so
              instead of guessing. That is deliberate: a model that bluffs is dangerous on a production line.
            </p>
          </div>
          <ModelTester />
          <p className="note">
            The tester runs a compressed copy of the model from the video so it fits in a browser download. On the same 200 held-out boards it catches 97
            of 100 defects with 2 false alarms (AUROC 0.992). The &quot;unknown&quot; rule was checked on 64 unrelated images (other objects, photos, the
            same boards under a different camera setup) and flagged all of them, and flagged none of the 200 held-out boards. That check used a small
            set, so treat it as a sanity test, not a guarantee. One known gap: a completely empty belt is not flagged, because the real station only
            takes a picture when a part is present.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Why it says &quot;unknown&quot;</span>
            <h2>This demo knows one board. The investment gives it your camera.</h2>
          </div>
          <div className="model-cols">
            <div className="card">
              <h3>Today, in this demo</h3>
              <ul className="plain">
                <li>The model has seen one type of board, on one belt, from one viewpoint.</li>
                <li>Photos from your phone have different light, angle, background and sharpness, so they look unfamiliar to it.</li>
                <li>It is trained on public photos, not on a real production line, and it is not tuned for any customer.</li>
              </ul>
            </div>
            <div className="card">
              <h3>With the investment</h3>
              <ul className="plain">
                <li>Industrial cameras, lenses and lighting are bought and fixed above a real conveyor, so every image is taken the same way.</li>
                <li>Each station records about two weeks of that customer&apos;s own good parts, and the model is trained on them.</li>
                <li>Images come from that fixed camera at line speed, which is exactly the setting where the model is accurate.</li>
                <li>The result is measured on the customer&apos;s own parts before go-live, not promised in advance.</li>
              </ul>
            </div>
          </div>
          <div className="hero-actions" style={{ marginTop: 32 }}>
            <Link className="btn primary" href="/demos/linesight">Open the LineSight simulator</Link>
            <Link className="btn" href="/#contact">Talk to us</Link>
          </div>
        </div>
      </section>
      <p className="container credits">
        Credits: circuit-board photos from the VisA dataset (CC BY 4.0), conveyor photo from an Edge Impulse open dataset (Apache 2.0). Method: PatchCore (Roth et al., CVPR 2022).
      </p>
    </div>
  );
}
