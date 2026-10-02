"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { ClayObject } from "./ClayObject";
import { hexagon, raw, servicePresets, type ClayParams } from "./presets";
import { useReducedMotion } from "@/lib/useReducedMotion";

// Abstract "circle" of three clay nodes (Capture → Connect → Collaborate). No product UI.
const R = 1.35;
const angles = [Math.PI / 2, Math.PI / 2 + (2 * Math.PI) / 3, Math.PI / 2 + (4 * Math.PI) / 3];
const forms: ClayParams[] = [raw, servicePresets["custom-ai-apps"], hexagon];

function Node({ i, active }: { i: number; active: React.RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const target = useRef<ClayParams>({ ...forms[i] });
  const reduced = useReducedMotion();
  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    const s = active.current === i ? 0.62 : 0.36;
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, s, 4, dt));
  });
  return (
    <group ref={group} position={[Math.cos(angles[i]) * R, Math.sin(angles[i]) * R, 0]} scale={0.36}>
      <ClayObject target={target} detail={40} still={reduced} />
    </group>
  );
}

function Ring({ active }: { active: React.RefObject<number> }) {
  const g = useRef<THREE.Group>(null);
  const points = useMemo(() => Array.from({ length: 97 }, (_, k) => new THREE.Vector3(Math.cos((k / 96) * Math.PI * 2) * R, Math.sin((k / 96) * Math.PI * 2) * R, 0)), []);
  const reduced = useReducedMotion();
  useFrame((state, dt) => {
    if (!g.current || reduced) return;
    g.current.rotation.x = THREE.MathUtils.damp(g.current.rotation.x, -state.pointer.y * 0.3, 2, dt);
    g.current.rotation.y = THREE.MathUtils.damp(g.current.rotation.y, state.pointer.x * 0.4, 2, dt);
  });
  return (
    <group ref={g}>
      <Line points={points} color="#ff4a50" lineWidth={1} transparent opacity={0.45} />
      {[0, 1, 2].map((i) => (
        <Node key={i} i={i} active={active} />
      ))}
    </group>
  );
}

export default function SaasNodes({ active }: { active: React.RefObject<number> }) {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 6], fov: 35 }} gl={{ alpha: true }} eventSource={typeof document !== "undefined" ? document.body : undefined} eventPrefix="client" aria-hidden>
      <Ring active={active} />
    </Canvas>
  );
}
