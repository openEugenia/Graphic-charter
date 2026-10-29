// The charter's logo (logo/logo.js), inlined so its frame follows
// --oe-brand-glow. The glow rotation is set per frame instead of the CSS
// animation, which would not be deterministic when rendering.

import { useMemo } from "react";
import { logoSvg } from "../../logo/logo.js";
import { useGlowAngle } from "./Reveal";
import { sampleVector, type LogoOptions } from "./schema";

export function Logo({ options }: { options: LogoOptions }) {
  const svg = useMemo(
    () => logoSvg({
      variant: options.variant,
      label: options.label,
      initials: options.initials,
      exponent: options.exponent,
      vector: options.vector ? sampleVector : undefined,
      vignette: options.vignette,
      tint: options.tint,
    }),
    [options.variant, options.label, options.initials, options.exponent, options.vector, options.vignette, options.tint],
  );
  const angle = useGlowAngle();
  return (
    <div
      className="poster-logo"
      style={{ width: options.size, ["--glow-angle" as string]: `${angle}deg` }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
