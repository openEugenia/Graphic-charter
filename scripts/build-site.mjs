// Assembles the GitHub Pages site in _site/: the demo page at the root, with
// the built CSS (dist/) and the logo component (logo/) next to it.
// Run `npm run build` first (npm run build:site does both).

import { cpSync, readFileSync, rmSync, writeFileSync } from "node:fs";

const OUT = "_site";

rmSync(OUT, { recursive: true, force: true });
cpSync("docs", OUT, { recursive: true });
cpSync("dist", `${OUT}/dist`, { recursive: true });
cpSync("logo", `${OUT}/logo`, { recursive: true });

// In the repository the page lives in docs/ and reaches ../dist and ../logo;
// on the site they are siblings of the page.
const html = readFileSync("docs/index.html", "utf8")
  .replaceAll('"../dist/', '"dist/')
  .replaceAll('"../logo/', '"logo/');
writeFileSync(`${OUT}/index.html`, html);

console.log(`Site written to ${OUT}/`);
