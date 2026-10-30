// Writes static SVG logos to dist/logo/<brand>/ for every brand preset,
// for uses where the web component is not available (slides, documents, favicons).
//
//   openeugenia-<variant>[-matrix][-animated].svg
//
// "-matrix" files are only written when logo/vectors/openeugenia.json exists
// (an array of numbers, or an object with a `vector` array). Matrix options:
//
//   node scripts/build-logos.mjs --vignette --tint

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { BRANDS, glow, logoSvg } from "../logo/logo.js";

const VECTOR_FILE = "logo/vectors/openeugenia.json";
const matrixOptions = {
  vignette: process.argv.includes("--vignette"),
  tint: process.argv.includes("--tint"),
};

let vector = null;
if (existsSync(VECTOR_FILE)) {
  const data = JSON.parse(readFileSync(VECTOR_FILE, "utf8"));
  vector = Array.isArray(data) ? data : data.vector;
} else {
  console.log(`No ${VECTOR_FILE}: skipping -matrix logos.`);
}

for (const [brand, color] of Object.entries(BRANDS)) {
  const dir = `dist/logo/${brand}`;
  mkdirSync(dir, { recursive: true });
  for (const variant of ["full", "mark", "lockup"]) {
    for (const withMatrix of vector && variant !== "lockup" ? [false, true] : [false]) {
      for (const animated of [false, true]) {
        const name = `openeugenia-${variant}${withMatrix ? "-matrix" : ""}${animated ? "-animated" : ""}.svg`;
        const svg = logoSvg({ variant, glow: glow(color), animated, vector: withMatrix ? vector : null, ...matrixOptions });
        writeFileSync(`${dir}/${name}`, svg + "\n");
      }
    }
  }
}
writeFileSync("dist/logo/openeugenia-glyph.svg", logoSvg({ variant: "glyph" }) + "\n");
console.log(`Logos written for: ${Object.keys(BRANDS).join(", ")}`);
