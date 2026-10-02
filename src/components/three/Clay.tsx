"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import type { ClaySceneProps } from "./ClayScene";

// three.js loads in its own chunk after first paint; a static poster shows until the canvas is ready.
const ClayScene = dynamic(() => import("./ClayScene"), { ssr: false });

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

// Static stand-in: a black-glass hexagon with red light, also the no-WebGL / reduced-data fallback.
export function ClayPoster({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <defs>
        <linearGradient id="clay-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2a2a2e" />
          <stop offset="0.45" stopColor="#0b0b0c" />
          <stop offset="1" stopColor="#151517" />
        </linearGradient>
        <linearGradient id="clay-edge" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#ed1c24" />
          <stop offset="0.5" stopColor="#5e1e2d" stopOpacity="0.3" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.35" />
        </linearGradient>
        <radialGradient id="clay-glow">
          <stop offset="0" stopColor="#ed1c24" stopOpacity="0.22" />
          <stop offset="1" stopColor="#ed1c24" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="96" fill="url(#clay-glow)" />
      <polygon points="100,38 154,69 154,131 100,162 46,131 46,69" fill="url(#clay-body)" stroke="url(#clay-edge)" strokeWidth="1.5" />
    </svg>
  );
}

export function Clay({ className = "", ...props }: ClaySceneProps & { className?: string }) {
  const [ready, setReady] = useState(false);
  const [webgl] = useState(() => typeof window === "undefined" || hasWebGL());
  return (
    <div className={`pointer-events-none relative ${className}`}>
      <ClayPoster className={`absolute inset-0 m-auto h-[46%] w-[46%] transition-opacity duration-700 ${ready && webgl ? "opacity-0" : "opacity-100"}`} />
      {webgl && (
        <div className={`absolute inset-0 transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}>
          <ClayScene {...props} onReady={() => setReady(true)} />
        </div>
      )}
    </div>
  );
}
