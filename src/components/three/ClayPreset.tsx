"use client";

import { useRef } from "react";
import { Clay } from "./Clay";
import { hexagon, raw, servicePresets, type ClayParams } from "./presets";

// Clay in a fixed state, for use from server components (service heroes, page heroes).
export function ClayPreset({ preset, className = "h-full w-full", cameraZ, dust = false }: { preset: string; className?: string; cameraZ?: number; dust?: boolean }) {
  const start = preset === "hexagon" ? hexagon : preset === "raw" ? raw : servicePresets[preset] ?? raw;
  const target = useRef<ClayParams>({ ...start });
  return <Clay target={target} className={className} cameraZ={cameraZ} dust={dust} />;
}
