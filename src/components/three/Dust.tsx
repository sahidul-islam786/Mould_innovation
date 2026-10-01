"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Sparse red dust drifting around the clay (hero only). Additive points, no textures.
export function Dust({ count = 500, still = false }: { count?: number; still?: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 1.6 + Math.random() * 2.6;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      pos[i * 3 + 1] = r * Math.cos(ph) * 0.7;
      pos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th) * 0.6;
      seed[i] = Math.random();
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    return g;
  }, [count]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uTime: { value: 0 }, uColor: { value: new THREE.Color("#ff4a50") }, uPx: { value: Math.min(window.devicePixelRatio, 1.5) } },
        vertexShader: /* glsl */ `
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
          }`,
        fragmentShader: /* glsl */ `
          uniform vec3 uColor; varying float vA;
          void main(){
            float d = length(gl_PointCoord - 0.5);
            if (d > 0.5) discard;
            gl_FragColor = vec4(uColor, vA * smoothstep(0.5, 0.0, d));
            #include <colorspace_fragment>
          }`,
      }),
    [],
  );

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  useFrame((_, delta) => {
    if (still) return;
    material.uniforms.uTime.value += Math.min(delta, 0.05);
    if (ref.current) ref.current.rotation.y += delta * 0.02;
  });

  return <points ref={ref} geometry={geometry} material={material} />;
}
