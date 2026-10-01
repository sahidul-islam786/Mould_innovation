"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Seeded PRNG (mulberry32): the same dust layout on every render, no impure Math.random in render.
function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const vertexShader = /* glsl */ `
  uniform float uTime; uniform float uPx;
  attribute float aSeed; varying float vA;
  void main(){
    vec3 p = position;
    p.y += sin(uTime * 0.3 + aSeed * 6.28) * 0.12;
    p.x += cos(uTime * 0.2 + aSeed * 12.0) * 0.08;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = (1.5 + aSeed * 2.5) * uPx * (4.0 / -mv.z);
    vA = 0.25 + 0.6 * aSeed;
    gl_Position = projectionMatrix * mv;
  }`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor; varying float vA;
  void main(){
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    gl_FragColor = vec4(uColor, vA * smoothstep(0.5, 0.0, d));
    #include <colorspace_fragment>
  }`;

// Sparse red dust drifting around the clay (hero only). Additive points, no textures.
export function Dust({ count = 500, still = false }: { count?: number; still?: boolean }) {
  const points = useRef<THREE.Points>(null);
  const mat = useRef<THREE.ShaderMaterial>(null);

  const { positions, seeds } = useMemo(() => {
    const rand = rng(7);
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 1.6 + rand() * 2.6;
      const th = rand() * Math.PI * 2;
      const ph = Math.acos(2 * rand() - 1);
      positions[i * 3] = r * Math.sin(ph) * Math.cos(th);
      positions[i * 3 + 1] = r * Math.cos(ph) * 0.7;
      positions[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th) * 0.6;
      seeds[i] = rand();
    }
    return { positions, seeds };
  }, [count]);

  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uColor: { value: new THREE.Color("#ff4a50") }, uPx: { value: 1.5 } }),
    [],
  );

  useFrame((state, delta) => {
    if (still || !mat.current) return;
    mat.current.uniforms.uTime.value += Math.min(delta, 0.05);
    mat.current.uniforms.uPx.value = Math.min(state.viewport.dpr, 1.5);
    if (points.current) points.current.rotation.y += delta * 0.02;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={mat}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </points>
  );
}
