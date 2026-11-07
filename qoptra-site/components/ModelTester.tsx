"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* Runs the exported LineSight model (ONNX) in the visitor's browser with onnxruntime-web.
   Nothing is uploaded: the image stays on the device. */

type Sample = { file: string; group: "good" | "defect" | "other"; title: string };
type Meta = {
  threshold: number;
  unknown: { minAreaFrac: number; maxScore: number };
  heatMax: number;
  modelMB?: number;
  samples: Sample[];
};
type Verdict = "normal" | "defect" | "unknown";
type Result = {
  verdict: Verdict;
  score: number;
  areaFrac: number;
  ms: number;
  map: Float32Array;
  name: string;
};

const W = 320, H = 256, GH = 32, GW = 40;
const MODEL_URL = "/model/linesight_web.onnx";

declare global {
  interface Window { ort?: any }
}

function loadOrt(): Promise<any> {
  if (window.ort) return Promise.resolve(window.ort);
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "/ort/ort.wasm.min.js";
    s.onload = () => {
      window.ort.env.wasm.wasmPaths = "/ort/";
      window.ort.env.wasm.numThreads = 1;
      resolve(window.ort);
    };
    s.onerror = () => reject(new Error("Could not load the inference runtime."));
    document.head.appendChild(s);
  });
}

async function fetchWithProgress(url: string, onProgress: (p: number) => void): Promise<Uint8Array> {
  const r = await fetch(url);
  if (!r.ok || !r.body) throw new Error("Could not download the model.");
  const total = Number(r.headers.get("content-length")) || 0;
  const reader = r.body.getReader();
  const chunks: Uint8Array[] = [];
  let got = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    got += value.length;
    if (total) onProgress(got / total);
  }
  const out = new Uint8Array(got);
  let o = 0;
  for (const c of chunks) { out.set(c, o); o += c.length; }
  return out;
}

/** bilinear upsample, same convention as torch (align_corners=False) */
function upsample(d: Float32Array): Float32Array {
  const out = new Float32Array(W * H);
  const sy = GH / H, sx = GW / W;
  for (let y = 0; y < H; y++) {
    let fy = (y + 0.5) * sy - 0.5; if (fy < 0) fy = 0;
    const y0 = Math.floor(fy), y1 = Math.min(y0 + 1, GH - 1), ty = fy - y0;
    for (let x = 0; x < W; x++) {
      let fx = (x + 0.5) * sx - 0.5; if (fx < 0) fx = 0;
      const x0 = Math.floor(fx), x1 = Math.min(x0 + 1, GW - 1), tx = fx - x0;
      const a = d[y0 * GW + x0] * (1 - tx) + d[y0 * GW + x1] * tx;
      const b = d[y1 * GW + x0] * (1 - tx) + d[y1 * GW + x1] * tx;
      out[y * W + x] = a * (1 - ty) + b * ty;
    }
  }
  return out;
}

const SIGMA = 4, R = 16;
const KERNEL = (() => {
  const k = new Float32Array(2 * R + 1);
  let s = 0;
  for (let i = -R; i <= R; i++) { k[i + R] = Math.exp(-(i * i) / (2 * SIGMA * SIGMA)); s += k[i + R]; }
  for (let i = 0; i < k.length; i++) k[i] /= s;
  return k;
})();
const refl = (i: number, n: number) => (i < 0 ? -i - 1 : i >= n ? 2 * n - i - 1 : i);

/** gaussian blur, sigma 4, mirrored borders (matches scipy.ndimage.gaussian_filter) */
function blur(src: Float32Array): Float32Array {
  const tmp = new Float32Array(W * H), out = new Float32Array(W * H);
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      let a = 0;
      for (let k = -R; k <= R; k++) a += KERNEL[k + R] * src[y * W + refl(x + k, W)];
      tmp[y * W + x] = a;
    }
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      let a = 0;
      for (let k = -R; k <= R; k++) a += KERNEL[k + R] * tmp[refl(y + k, H) * W + x];
      out[y * W + x] = a;
    }
  return out;
}

/** draw any image cropped to 5:4 and scaled to the model input size */
function toCanvas(img: CanvasImageSource, iw: number, ih: number, cv: HTMLCanvasElement) {
  cv.width = W; cv.height = H;
  const c = cv.getContext("2d", { willReadFrequently: true })!;
  let cw = iw, ch = ih;
  if (iw / ih > W / H) cw = ih * (W / H); else ch = iw * (H / W);
  const sx = (iw - cw) / 2, sy = (ih - ch) / 2;
  c.imageSmoothingEnabled = true;
  c.imageSmoothingQuality = "high";
  c.drawImage(img, sx, sy, cw, ch, 0, 0, W, H);
}

function heat(v: number, thr: number, max: number): [number, number, number, number] {
  if (v < thr * 0.75) return [0, 0, 0, 0];
  const t = Math.min(1, Math.max(0, (v - thr * 0.75) / (max - thr * 0.75)));
  const r = 255, g = Math.round(210 * (1 - t)), b = 40;
  return [r, g, b, Math.round(70 + 150 * t)];
}

const VERDICT_TEXT: Record<Verdict, { title: string; cls: string }> = {
  normal: { title: "Looks normal", cls: "ok" },
  defect: { title: "Anomaly detected", cls: "bad" },
  unknown: { title: "Unknown image", cls: "unk" },
};

export function ModelTester() {
  const [meta, setMeta] = useState<Meta | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState<Result | null>(null);
  const [showHeat, setShowHeat] = useState(true);
  const [drag, setDrag] = useState(false);
  const sess = useRef<any>(null);
  const srcCanvas = useRef<HTMLCanvasElement>(null);
  const viewCanvas = useRef<HTMLCanvasElement>(null);
  const pending = useRef<(() => void) | null>(null);

  useEffect(() => {
    fetch("/model/meta.json").then((r) => r.json()).then(setMeta).catch(() => setErr("Could not load model settings."));
  }, []);

  const start = useCallback(async () => {
    if (state === "loading" || state === "ready") return;
    setState("loading"); setErr("");
    try {
      const ort = await loadOrt();
      const bytes = await fetchWithProgress(MODEL_URL, setProgress);
      sess.current = await ort.InferenceSession.create(bytes, { executionProviders: ["wasm"], graphOptimizationLevel: "all" });
      setState("ready");
      if (pending.current) { const f = pending.current; pending.current = null; f(); }
    } catch (e: any) {
      setErr(e?.message || "The model could not start in this browser.");
      setState("error");
    }
  }, [state]);

  const analyse = useCallback(async (name: string) => {
    if (!meta || !sess.current || !srcCanvas.current) return;
    setBusy(true);
    await new Promise((r) => setTimeout(r, 30));
    try {
      const ort = window.ort;
      const px = srcCanvas.current.getContext("2d", { willReadFrequently: true })!.getImageData(0, 0, W, H).data;
      const data = new Float32Array(3 * W * H);
      for (let i = 0; i < W * H; i++) {
        data[i] = px[4 * i] / 255;
        data[W * H + i] = px[4 * i + 1] / 255;
        data[2 * W * H + i] = px[4 * i + 2] / 255;
      }
      const t0 = performance.now();
      const out = await sess.current.run({ image: new ort.Tensor("float32", data, [1, 3, H, W]) });
      const map = blur(upsample(out.dist.data as Float32Array));
      const ms = performance.now() - t0;
      let score = 0, above = 0;
      for (let i = 0; i < map.length; i++) { if (map[i] > score) score = map[i]; if (map[i] > meta.threshold) above++; }
      const areaFrac = above / map.length;
      let verdict: Verdict = score > meta.threshold ? "defect" : "normal";
      if (areaFrac >= meta.unknown.minAreaFrac || score >= meta.unknown.maxScore) verdict = "unknown";
      setRes({ verdict, score, areaFrac, ms, map, name });
    } catch (e: any) {
      setErr(e?.message || "Analysis failed.");
    }
    setBusy(false);
  }, [meta]);

  // paint result (photo + optional heat overlay)
  useEffect(() => {
    const cv = viewCanvas.current, src = srcCanvas.current;
    if (!cv || !src || !res || !meta) return;
    cv.width = W; cv.height = H;
    const c = cv.getContext("2d")!;
    c.drawImage(src, 0, 0);
    if (showHeat && res.verdict !== "normal") {
      const im = c.getImageData(0, 0, W, H);
      for (let i = 0; i < W * H; i++) {
        const [r, g, b, a] = heat(res.map[i], meta.threshold, meta.heatMax);
        if (!a) continue;
        const k = a / 255;
        im.data[4 * i] = im.data[4 * i] * (1 - k) + r * k;
        im.data[4 * i + 1] = im.data[4 * i + 1] * (1 - k) + g * k;
        im.data[4 * i + 2] = im.data[4 * i + 2] * (1 - k) + b * k;
      }
      c.putImageData(im, 0, 0);
    }
  }, [res, showHeat, meta]);

  const runImage = useCallback((el: HTMLImageElement, name: string) => {
    if (!srcCanvas.current) return;
    toCanvas(el, el.naturalWidth, el.naturalHeight, srcCanvas.current);
    const go = () => analyse(name);
    if (state === "ready") go();
    else { pending.current = go; start(); }
  }, [analyse, start, state]);

  const loadUrl = useCallback((url: string, name: string) => {
    const el = new Image();
    el.onload = () => runImage(el, name);
    el.onerror = () => setErr("Could not open that image.");
    el.src = url;
  }, [runImage]);

  const onFile = useCallback((f?: File | null) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) { setErr("Please choose an image file (JPG, PNG, WebP)."); return; }
    setErr("");
    const url = URL.createObjectURL(f);
    const el = new Image();
    el.onload = () => { runImage(el, f.name); URL.revokeObjectURL(url); };
    el.onerror = () => { setErr("Could not open that image."); URL.revokeObjectURL(url); };
    el.src = url;
  }, [runImage]);

  const thr = meta?.threshold ?? 1;
  const barMax = thr * 2.2;
  const pct = (v: number) => `${Math.min(100, (v / barMax) * 100)}%`;

  return (
    <div className="tester">
      <div className="tester-top">
        <div
          className={`drop${drag ? " over" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); onFile(e.dataTransfer.files?.[0]); }}
        >
          <b>Test your own image</b>
          <p>Drop any photo here or choose a file. The analysis runs inside your browser and the image is never uploaded.</p>
          <label className="btn primary">
            Choose an image
            <input type="file" accept="image/*" hidden onChange={(e) => { onFile(e.target.files?.[0]); e.target.value = ""; }} />
          </label>
        </div>
        <div className="model-state">
          {state === "idle" && (
            <>
              <b>Model not loaded yet</b>
              <p>It downloads once (about {meta?.modelMB ?? 57} MB) the first time you test an image, then runs offline in your browser.</p>
              <button className="btn" onClick={start} disabled={!meta}>Load model now</button>
            </>
          )}
          {state === "loading" && (
            <>
              <b>Loading the model…</b>
              <div className="bar" role="progressbar" aria-valuenow={Math.round(progress * 100)} aria-valuemin={0} aria-valuemax={100}>
                <i style={{ width: `${Math.round(progress * 100)}%` }} />
              </div>
              <p>{progress < 1 ? `${Math.round(progress * 100)}% downloaded` : "Starting the model on your device…"}</p>
            </>
          )}
          {state === "ready" && (<><b>Model ready</b><p>Running on your device. No internet needed from here on.</p></>)}
          {state === "error" && (<><b>Could not start</b><p>{err}</p><button className="btn" onClick={() => { setState("idle"); start(); }}>Try again</button></>)}
        </div>
      </div>

      {meta && (
        <div className="samples">
          <span className="eyebrow">Or pick a sample</span>
          <div className="sample-groups">
            {(["good", "defect", "other"] as const).map((g) => (
              <div key={g} className="sample-group">
                <span className="sg-title">
                  {g === "good" ? "Good boards (never seen in training)" : g === "defect" ? "Defective boards (never seen in training)" : "Things the model was not trained on"}
                </span>
                <div className="sample-row">
                  {meta.samples.filter((s) => s.group === g).map((s) => (
                    <button key={s.file} className="sample" onClick={() => loadUrl(`/model/samples/${s.file}`, s.title)} title={s.title}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`/model/samples/${s.file}`} alt={s.title} loading="lazy" width={160} height={128} />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <canvas ref={srcCanvas} width={W} height={H} style={{ display: "none" }} />

      <div className="result" aria-live="polite">
        {!res && !busy && <p className="muted">The result appears here.</p>}
        {busy && <p className="muted">Analysing the image…</p>}
        {res && !busy && meta && (
          <div className="result-grid">
            <div className="result-img">
              <canvas ref={viewCanvas} width={W} height={H} />
              <label className="toggle">
                <input type="checkbox" checked={showHeat} onChange={(e) => setShowHeat(e.target.checked)} /> Show where the model looks
              </label>
              <span className="muted small">{res.name} · analysed in {Math.round(res.ms)} ms</span>
            </div>
            <div className="result-info">
              <span className={`verdict ${VERDICT_TEXT[res.verdict].cls}`}>{VERDICT_TEXT[res.verdict].title}</span>
              <div className="gauge" aria-label="Anomaly score against alarm threshold">
                <div className="gauge-track">
                  <i className="gauge-fill" style={{ width: pct(res.score) }} />
                  <i className="gauge-thr" style={{ left: pct(thr) }} />
                </div>
                <div className="gauge-lbl"><span>Score {res.score.toFixed(2)}</span><span>Alarm threshold {thr.toFixed(2)}</span></div>
              </div>
              {res.verdict === "normal" && (
                <p>Every part of this image matches the good boards the model learned from. No alarm would be raised.</p>
              )}
              {res.verdict === "defect" && (
                <p>
                  Something here does not match the good boards it learned. The highlighted area is where it differs. It was never shown a
                  defect photo, it only knows what a good board looks like. On the station this raises the alarm and notifies the shift lead.
                </p>
              )}
              {res.verdict === "unknown" && (
                <p>
                  <b>The model does not know this.</b> It has only ever seen one type of circuit board on one conveyor, so it cannot say whether
                  this image is good or defective. A high score here means &quot;unfamiliar&quot;, not &quot;broken&quot;. {Math.round(res.areaFrac * 100)}% of the
                  image is unfamiliar to it, a damaged board would normally affect only a small area.
                </p>
              )}
              <ul className="facts-list">
                <li>Knows: one type of charge board on a grey belt, seen from above at a fixed distance.</li>
                <li>Does not know: other products, other cameras, other lighting or backgrounds.</li>
              </ul>
            </div>
          </div>
        )}
        {err && state !== "error" && <p className="err">{err}</p>}
      </div>
    </div>
  );
}
