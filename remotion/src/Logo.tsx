// The charter's logo (logo/logo.js), inlined so its frame follows
// --oe-brand-glow. The glow rotation is set per frame instead of the CSS
// animation, which would not be deterministic when rendering.

import { useMemo, type CSSProperties } from "react";
import { logoSvg } from "../../logo/logo.js";
import { useGlowAngle } from "./Reveal";
import { sampleVector, type PosterProps } from "./schema";

export function Logo({ variant = "mark", options, style }: {
  variant?: "full" | "mark";
  options: PosterProps["logo"];
  style?: CSSProperties;
}) {
  const svg = useMemo(
    () => logoSvg({
      variant,
      vector: options.vector ? sampleVector : undefined,
      vignette: options.vignette,
      tint: options.tint,
    }),
    [variant, options.vector, options.vignette, options.tint],
  );
  const angle = useGlowAngle();
  return (
    <div
      className="poster-logo"
      style={{ ...style, ["--glow-angle" as string]: `${angle}deg` }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
