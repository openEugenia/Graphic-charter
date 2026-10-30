// Writes the logo as SVG files, which Remotion cannot output:
//
//   npm run logo:svg -- my-logo.json        out/logo/my-logo{,-animated}.svg
//
// The JSON file has the props of the "Logo" compositions (`brand`, `logo`), as
// copied from the Studio. Without a file: the default openEugenia logo.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, extname } from "node:path";
import { BRANDS, DEFAULT_LABEL, glow, logoSvg } from "../../logo/logo.js";

const file = process.argv[2];
const props = file ? JSON.parse(readFileSync(file, "utf8")) : {};
const name = file ? basename(file, extname(file)) : "openeugenia";
const { vector, ...logo } = { variant: "full", label: DEFAULT_LABEL, ...props.logo };

// Same matrix as the Studio's `vector` option.
const options = {
  ...logo,
  glow: glow(props.brand ?? BRANDS.openeugenia),
  vector: vector ? JSON.parse(readFileSync("../docs/sample-vector.json", "utf8")).vector : null,
};

mkdirSync("out/logo", { recursive: true });
writeFileSync(`out/logo/${name}.svg`, logoSvg(options) + "\n");
writeFileSync(`out/logo/${name}-animated.svg`, logoSvg({ ...options, animated: true }) + "\n");
console.log(`Written: out/logo/${name}.svg, out/logo/${name}-animated.svg`);
