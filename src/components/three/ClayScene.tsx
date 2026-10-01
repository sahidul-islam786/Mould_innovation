"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ClayObject } from "./ClayObject";
import { Dust } from "./Dust";
import type { ClayParams } from "./presets";
import { useReducedMotion } from "@/lib/useReducedMotion";

export type ClaySceneProps = {
  target: React.RefObject<ClayParams>;
  dust?: boolean;
  scale?: number;
  cameraZ?: number;
  onReady?: () => void;
};

// One WebGL canvas. Renders only while on screen and the tab is visible;
// lower detail and DPR on small screens; a still frame under reduced motion.
export default function ClayScene({ target, dust = false, scale = 1, cameraZ = 4.2, onReady }: ClaySceneProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const reduced = useReducedMotion();
  const [small] = useState(() => typeof window !== "undefined" && window.innerWidth < 768);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting && !document.hidden), { rootMargin: "100px" });
    io.observe(el);
    const onVis = () => setVisible((v) => v && !document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        frameloop={reduced ? "demand" : visible ? "always" : "never"}
        dpr={small ? 1 : [1, 1.5]}
        camera={{ position: [0, 0, cameraZ], fov: 35 }}
        gl={{ antialias: !small, alpha: true, powerPreference: "high-performance" }}
        // The canvas never blocks clicks; pointer position is read from the whole page.
        eventSource={typeof document !== "undefined" ? document.body : undefined}
        eventPrefix="client"
        onCreated={() => onReady?.()}
        aria-hidden
      >
        <ClayObject target={target} detail={small ? 48 : 96} scale={scale} still={reduced} />
        {dust && <Dust count={small ? 160 : 500} still={reduced} />}
      </Canvas>
    </div>
  );
}
