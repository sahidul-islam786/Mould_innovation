"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { ClayObject } from "./ClayObject";
import { Dust } from "./Dust";
import type { ClayParams } from "./presets";
import { useReducedMotion } from "@/lib/useReducedMotion";

// Multi-layer "engineered intelligence" scene: a black-glass core (the clay shader), hexagonal
// frames that separate in depth with scroll, node points, a wireframe shell, a horizon grid and dust.
// `progress` (0..1) is driven by the page's ScrollTrigger; the pointer adds a small parallax.
export type SystemSceneProps = {
  target: React.RefObject<ClayParams>;
  progress?: React.RefObject<number>;
  variant?: "hero" | "services" | "cta";
  onReady?: () => void;
};

const hex = (r: number) => Array.from({ length: 7 }, (_, i) => new THREE.Vector3(Math.cos((i * Math.PI) / 3 + Math.PI / 6) * r, Math.sin((i * Math.PI) / 3 + Math.PI / 6) * r, 0));

function Frames({ progress, still, variant }: { progress?: React.RefObject<number>; still: boolean; variant: string }) {
  const g = useRef<THREE.Group>(null);
  const frames = useRef<(THREE.Group | null)[]>([]);
  const rings = useMemo(() => [1.35, 1.75, 2.25].map(hex), []);
  const nodes = useMemo(() => rings[2].slice(0, 6), [rings]);
  useFrame((state, dt) => {
    const p = progress?.current ?? 0;
    frames.current.forEach((f, i) => {
      if (!f) return;
      // Layers separate in depth and counter-rotate as the scroll story advances.
      f.position.z = THREE.MathUtils.damp(f.position.z, (i - 1) * p * 1.6, 4, dt);
      if (!still) f.rotation.z += dt * (i % 2 ? -0.05 : 0.035) * (1 + p * 2);
    });
    if (g.current && !still) {
      g.current.rotation.x = THREE.MathUtils.damp(g.current.rotation.x, -state.pointer.y * 0.18 + p * 0.5, 2.5, dt);
      g.current.rotation.y = THREE.MathUtils.damp(g.current.rotation.y, state.pointer.x * 0.28 - p * 0.6, 2.5, dt);
    }
  });
  return (
    <group ref={g}>
      {rings.map((pts, i) => (
        <group key={i} ref={(el) => void (frames.current[i] = el)}>
          <Line points={pts} color={i === 1 ? "#ed1c24" : "#8a8580"} lineWidth={i === 1 ? 1.4 : 0.8} transparent opacity={i === 1 ? 0.85 : 0.35} />
          {i === 2 &&
            nodes.map((n, k) => (
              <mesh key={k} position={n}>
                <boxGeometry args={[0.06, 0.06, 0.06]} />
                <meshBasicMaterial color={k % 2 ? "#ed1c24" : "#f4f2ee"} toneMapped={false} />
              </mesh>
            ))}
        </group>
      ))}
      {/* Thin red data lines from the core to alternate nodes. */}
      {variant !== "cta" &&
        nodes
          .filter((_, k) => k % 2 === 0)
          .map((n, k) => <Line key={k} points={[new THREE.Vector3(0, 0, 0), n]} color="#ed1c24" lineWidth={0.6} transparent opacity={0.3} />)}
    </group>
  );
}

function Rig({ progress, variant, still }: { progress?: React.RefObject<number>; variant: string; still: boolean }) {
  const base = variant === "hero" ? 6.2 : 6.6;
  useFrame((state, dt) => {
    const p = progress?.current ?? 0;
    const cam = state.camera;
    const px = still ? 0 : state.pointer.x * 0.25;
    const py = still ? 0 : state.pointer.y * 0.18;
    // Scroll: the camera pushes in and orbits slightly, so the hero flows into the next section.
    cam.position.x = THREE.MathUtils.damp(cam.position.x, px + p * 1.6, 3, dt);
    cam.position.y = THREE.MathUtils.damp(cam.position.y, py - p * 0.6, 3, dt);
    cam.position.z = THREE.MathUtils.damp(cam.position.z, base - p * 2.4, 3, dt);
    cam.lookAt(0, 0, 0);
  });
  return null;
}

export default function SystemScene({ target, progress, variant = "hero", onReady }: SystemSceneProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const reduced = useReducedMotion();
  const [small] = useState(() => typeof window !== "undefined" && window.innerWidth < 768);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting && !document.hidden), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        frameloop={reduced ? "demand" : visible ? "always" : "never"}
        dpr={small ? 1 : [1, 1.5]}
        camera={{ position: [0, 0, 6.2], fov: 32 }}
        gl={{ antialias: !small, alpha: true, powerPreference: "high-performance" }}
        eventSource={typeof document !== "undefined" ? document.body : undefined}
        eventPrefix="client"
        onCreated={() => onReady?.()}
        aria-hidden
      >
        <Rig progress={progress} variant={variant} still={reduced} />
        <ClayObject target={target} detail={small ? 40 : 80} scale={variant === "hero" ? 0.82 : 0.9} still={reduced} />
        <Frames progress={progress} still={reduced} variant={variant} />
        {variant !== "cta" && (
          <mesh rotation={[0.4, 0.2, 0]}>
            <icosahedronGeometry args={[3.1, 1]} />
            <meshBasicMaterial color="#5c5a55" wireframe transparent opacity={0.08} />
          </mesh>
        )}
        {variant === "hero" && <gridHelper args={[24, 48, "#5e1e2d", "#1c1c1f"]} position={[0, -2.3, 0]} />}
        {variant === "hero" && <Dust count={small ? 120 : 380} still={reduced} />}
      </Canvas>
    </div>
  );
}
