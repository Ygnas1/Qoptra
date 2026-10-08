"use client";

import { useEffect, useRef, useState } from "react";

/** Embeds a standalone demo page and grows to its full height so the page scrolls as one. */
export function DemoFrame({ src, title }: { src: string; title: string }) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(1400);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.source !== ref.current?.contentWindow) return;
      const d = e.data as { type?: string; height?: number };
      if (d?.type === "qoptra-demo-height" && typeof d.height === "number") setHeight(Math.ceil(d.height) + 2);
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return <iframe ref={ref} className="demo-frame" src={src} title={title} style={{ height }} />;
}
