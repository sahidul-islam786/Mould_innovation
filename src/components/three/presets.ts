// Shape states of the clay. Each service gets its own form (spec section 10).
export type ClayParams = {
  morph: number; // 0 raw clay → 1 hexagonal prism
  amp: number; // noise displacement
  freq: number; // noise frequency
  speed: number; // noise animation speed
  twist: number;
  stretch: number;
  glow: number; // rim intensity
};

export const raw: ClayParams = { morph: 0, amp: 0.22, freq: 1.35, speed: 0.22, twist: 0, stretch: 1, glow: 0.2 };
export const hexagon: ClayParams = { morph: 1, amp: 0.02, freq: 1.2, speed: 0.12, twist: 0, stretch: 1, glow: 0.45 };

// Keys match service slugs.
export const servicePresets: Record<string, ClayParams> = {
  // Agents: a twisting, working form.
  "ai-automation-agents": { morph: 0.12, amp: 0.13, freq: 2.4, speed: 0.45, twist: 1.3, stretch: 1.05, glow: 0.3 },
  // Chat & voice: soft, wave-like.
  "ai-chatbots-voicebots": { morph: 0, amp: 0.32, freq: 0.85, speed: 0.55, twist: 0, stretch: 0.82, glow: 0.25 },
  // Custom apps: half-formed, structured.
  "custom-ai-apps": { morph: 0.55, amp: 0.07, freq: 3.0, speed: 0.3, twist: 0.25, stretch: 1, glow: 0.3 },
  // Data: tall, finely textured.
  "data-predictive-analytics": { morph: 0.18, amp: 0.16, freq: 4.2, speed: 0.32, twist: 0, stretch: 1.28, glow: 0.3 },
  // Vision: a calm lens-like sphere.
  "computer-vision-visual-search": { morph: 0, amp: 0.045, freq: 1.0, speed: 0.18, twist: 0, stretch: 1, glow: 0.55 },
  // Strategy: nearly formed, steady.
  "ai-consulting-llmops-governance": { morph: 0.86, amp: 0.03, freq: 1.5, speed: 0.18, twist: 0, stretch: 1, glow: 0.35 },
};

export const lerpParams = (a: ClayParams, b: ClayParams, t: number): ClayParams => ({
  morph: a.morph + (b.morph - a.morph) * t,
  amp: a.amp + (b.amp - a.amp) * t,
  freq: a.freq + (b.freq - a.freq) * t,
  speed: a.speed + (b.speed - a.speed) * t,
  twist: a.twist + (b.twist - a.twist) * t,
  stretch: a.stretch + (b.stretch - a.stretch) * t,
  glow: a.glow + (b.glow - a.glow) * t,
});
