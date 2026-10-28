// Assembles the GitHub Pages site in _site/: the documentation pages at the root, with
// the built CSS (dist/) and the logo component (logo/) next to it.
// Run `npm run build` first (npm run build:site does both).

import { cpSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";

const OUT = "_site";

rmSync(OUT, { recursive: true, force: true });
cpSync("docs", OUT, { recursive: true });
cpSync("dist", `${OUT}/dist`, { recursive: true });
cpSync("logo", `${OUT}/logo`, { recursive: true });

// In the repository the pages live in docs/ and reach ../dist and ../logo;
// on the site they are siblings of the pages.
for (const page of readdirSync("docs").filter((name) => name.endsWith(".html"))) {
  const html = readFileSync(`docs/${page}`, "utf8")
    .replaceAll('"../dist/', '"dist/')
    .replaceAll('"../logo/', '"logo/');
  writeFileSync(`${OUT}/${page}`, html);
}

console.log(`Site written to ${OUT}/`);
