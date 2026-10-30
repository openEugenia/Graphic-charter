// The charter's logo (logo/logo.js), inlined so its frame follows
// --oe-brand-glow. The glow rotation is set per frame instead of the CSS
// animation, which would not be deterministic when rendering.

import { loadFont } from "@remotion/google-fonts/Inter";
import { useMemo } from "react";
import { logoSvg } from "../../../logo/logo.js";
import { useGlowAngle } from "../Reveal";
import { sampleVector, type LogoOptions } from "../schema";
import "./logo.css";

// Initials and wordmark, at any `labelWeight`.
loadFont("normal", {
  weights: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  ignoreTooManyRequestsWarning: true,
});

// Without `size`, the logo fills its parent.
export function Logo({ options }: { options: Omit<LogoOptions, "size"> & { size?: number } }) {
  const svg = useMemo(
    () => logoSvg({
      variant: options.variant,
      label: options.label,
      initials: options.initials,
      exponent: options.exponent,
      vector: options.vector ? sampleVector : undefined,
      vignette: options.vignette,
      tint: options.tint,
      background: options.background,
      frame: options.frame,
      ink: options.ink,
      labelWeight: options.labelWeight,
    }),
    [options.variant, options.label, options.initials, options.exponent, options.vector, options.vignette, options.tint, options.background, options.frame, options.ink, options.labelWeight],
  );
  const angle = useGlowAngle();
  return (
    <div
      className="logo"
      style={{ width: options.size, ["--glow-angle" as string]: `${angle}deg` }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
