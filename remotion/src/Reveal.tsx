// Entrance animations. The same layout is used for stills and videos: in a
// still (`animated` false) every element is shown in its final state.

import { createContext, useContext, type CSSProperties, type ReactNode } from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

const Animated = createContext(false);

export function AnimationProvider({ animated, children }: { animated: boolean; children: ReactNode }) {
  return <Animated.Provider value={animated}>{children}</Animated.Provider>;
}

/** Progress of an entrance starting at `delay` frames, from 0 to 1. */
export function useEntrance(delay: number): number {
  const animated = useContext(Animated);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (!animated) return 1;
  // Same feel as --oe-easing (cubic-bezier(0.2, 0, 0, 1)): fast start, long settle.
  return spring({ frame: frame - delay, fps, config: { damping: 200 }, durationInFrames: Math.round(fps * 0.9) });
}

/** Fades and slides its children up when its entrance starts. */
export function Reveal({ as: Tag = "div", delay, distance = 16, style, children, className }: {
  as?: "div" | "li";
  delay: number;
  distance?: number;
  style?: CSSProperties;
  className?: string;
  children: ReactNode;
}) {
  const p = useEntrance(delay);
  return (
    <Tag className={className} style={{ ...style, opacity: p, translate: `0 ${(1 - p) * distance}px` }}>
      {children}
    </Tag>
  );
}

/** Rotation of the logo's frame gradient: the `animated` back-and-forth of <oe-logo>, driven by the frame. */
export function useGlowAngle(period = 7): number {
  const animated = useContext(Animated);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (!animated) return 0;
  const t = (frame / fps / period) % 2;
  return interpolate(t <= 1 ? t : 2 - t, [0, 1], [-15, 15], { easing: Easing.inOut(Easing.ease) });
}
