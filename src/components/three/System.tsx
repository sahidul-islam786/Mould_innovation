"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { ClayPoster } from "./Clay";
import type { SystemSceneProps } from "./SystemScene";

// Lazy wrapper for the multi-layer scene: poster first, canvas fades in when ready.
const SystemScene = dynamic(() => import("./SystemScene"), { ssr: false });

export function System({ className = "", ...props }: SystemSceneProps & { className?: string }) {
  const [ready, setReady] = useState(false);
  return (
    <div className={`pointer-events-none relative ${className}`}>
      <ClayPoster className={`absolute inset-0 m-auto h-[40%] w-[40%] transition-opacity duration-700 ${ready ? "opacity-0" : "opacity-100"}`} />
      <div className={`absolute inset-0 transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}>
        <SystemScene {...props} onReady={() => setReady(true)} />
      </div>
    </div>
  );
}
