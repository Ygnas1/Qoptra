"use client";

import { useId } from "react";

const RING =
  "M7 54 A47 47 0 1 0 101 54 A47 47 0 1 0 7 54 Z M36 52 A24 24 0 1 0 84 52 A24 24 0 1 0 36 52 Z";
const TAIL = "50,60 77,60 111,98 84,98";

/** The Qoptra Q: an off-centre ring (folded ribbon) with a tail laid over it. */
export function Mark({ size = 32, flat = false }: { size?: number; flat?: boolean }) {
  const id = useId().replace(/:/g, "");
  if (flat) {
    return (
      <svg width={size} height={size} viewBox="0 0 120 120" aria-hidden="true">
        <path d={RING} fill="currentColor" fillRule="evenodd" />
        <polygon points={TAIL} fill="var(--bg)" stroke="var(--bg)" strokeWidth="7" strokeLinejoin="round" />
        <polygon points={TAIL} fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}r`} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.5" stopColor="#C4C6CC" />
          <stop offset="1" stopColor="#6E717A" />
        </linearGradient>
        <linearGradient id={`${id}t`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F4F5F7" />
          <stop offset="0.5" stopColor="#9C9FA6" />
          <stop offset="1" stopColor="#F7F7F9" />
        </linearGradient>
      </defs>
      <path d={RING} fill={`url(#${id}r)`} fillRule="evenodd" />
      <polygon points={TAIL} fill={`url(#${id}t)`} />
    </svg>
  );
}

export function Logo({ size = 30 }: { size?: number }) {
  return (
    <span className="logo">
      <Mark size={size} />
      <span className="logo-word" style={{ fontSize: size * 0.82 }}>
        Qoptra
      </span>
    </span>
  );
}
