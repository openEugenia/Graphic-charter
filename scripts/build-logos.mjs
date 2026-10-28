// Writes static SVG logos to dist/logo/<brand>/ for every brand preset,
// for uses where the web component is not available (slides, documents, favicons).

import { mkdirSync, writeFileSync } from "node:fs";
import { BRANDS, glow, logoSvg } from "../logo/logo.js";

for (const [brand, color] of Object.entries(BRANDS)) {
  const dir = `dist/logo/${brand}`;
  mkdirSync(dir, { recursive: true });
  for (const variant of ["full", "mark"]) {
    writeFileSync(`${dir}/openeugenia-${variant}.svg`, logoSvg({ variant, glow: glow(color) }) + "\n");
  }
}
writeFileSync("dist/logo/openeugenia-glyph.svg", logoSvg({ variant: "glyph" }) + "\n");
console.log(`Logos written for: ${Object.keys(BRANDS).join(", ")}`);
