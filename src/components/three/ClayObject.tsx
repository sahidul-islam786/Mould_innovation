"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { clayFragment, clayVertex } from "./clayShader";
import type { ClayParams } from "./presets";

type Props = {
  // Mutable target the page drives (scroll, hover); uniforms ease toward it every frame.
  target: React.RefObject<ClayParams>;
  detail?: number;
  scale?: number;
  still?: boolean; // reduced motion: no time animation, no pointer response
};

const damp = THREE.MathUtils.damp;

export function ClayObject({ target, detail = 96, scale = 1, still = false }: Props) {
  const mesh = useRef<THREE.Mesh>(null);
  const { size } = useThree();

  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1, detail), [detail]);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: clayVertex,
        fragmentShader: clayFragment,
        uniforms: {
          uTime: { value: 0 },
          uAmp: { value: target.current.amp },
          uFreq: { value: target.current.freq },
          uSpeed: { value: target.current.speed },
          uMorph: { value: target.current.morph },
          uTwist: { value: target.current.twist },
          uStretch: { value: target.current.stretch },
          uGlow: { value: target.current.glow },
          uPress: { value: 0 },
          uPointer: { value: new THREE.Vector3(0, 0, 2) },
          uRed: { value: new THREE.Color("#ed1c24") },
          uMaroon: { value: new THREE.Color("#5e1e2d") },
          uRim: { value: new THREE.Color("#ff4a50") },
        },
      }),
    // Created once; later changes go through uniforms.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  const pointerLocal = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    const u = material.uniforms;
    const t = target.current;
    const dt = Math.min(delta, 0.05);
    if (!still) u.uTime.value += dt;
    u.uAmp.value = damp(u.uAmp.value, t.amp, 3, dt);
    u.uFreq.value = damp(u.uFreq.value, t.freq, 3, dt);
    u.uSpeed.value = damp(u.uSpeed.value, t.speed, 3, dt);
    u.uMorph.value = damp(u.uMorph.value, t.morph, 3, dt);
    u.uTwist.value = damp(u.uTwist.value, t.twist, 3, dt);
    u.uStretch.value = damp(u.uStretch.value, t.stretch, 3, dt);
    u.uGlow.value = damp(u.uGlow.value, t.glow, 3, dt);

    const m = mesh.current;
    if (!m) return;
    if (still) {
      m.rotation.set(-0.15, 0.5, 0);
      return;
    }
    // Pointer (NDC) → a point in front of the object, in its local space.
    const aspect = size.width / Math.max(size.height, 1);
    pointerLocal.set(state.pointer.x * 1.4 * Math.min(aspect, 1.6), state.pointer.y * 1.2, 0.95);
    m.worldToLocal(pointerLocal);
    u.uPointer.value.lerp(pointerLocal, 1 - Math.exp(-6 * dt));
    const active = Math.abs(state.pointer.x) < 0.98 && Math.abs(state.pointer.y) < 0.98 ? 1 : 0;
    u.uPress.value = damp(u.uPress.value, active, 2.5, dt);

    // Slow idle turn plus a lean toward the pointer.
    m.rotation.y = damp(m.rotation.y, state.clock.elapsedTime * 0.12 + state.pointer.x * 0.35, 2, dt);
    m.rotation.x = damp(m.rotation.x, -state.pointer.y * 0.25, 2, dt);
  });

  return <mesh ref={mesh} geometry={geometry} material={material} scale={scale} />;
}
