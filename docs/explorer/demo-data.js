// Local demo hierarchy, following the original sketch. Sample content only.
// Served under DEMO_ORIGIN by explorer.js instead of the network.

export const DEMO_ORIGIN = "https://demo.openeugenia.local";
export const DEMO_ROOT = `${DEMO_ORIGIN}/index.llms.md`;

export const DEMO_FILES = {
  "/index.llms.md": `# openEugenia

> Sample root of the openEugenia ecosystem, written for this demo. Each page is a markdown file; the links below are its sub-pages.

The ecosystem gathers projects, conferences and tools that share one graphic charter.

## Sections

- [Projects](projects/index.llms.md): Open-source projects of the community
- [Conferences](conferences/index.llms.md): Conference cycles and events
- [Tools](tools/index.llms.md): Shared tools, starting with this explorer
- [About](about.llms.md): Who we are and how to take part

## Elsewhere

- [llms.txt specification](https://llmstxt.org/): The format this explorer reads
`,

  "/projects/index.llms.md": `# Projects

> Projects of the openEugenia ecosystem (sample content).

- [Eugenia](eugenia.llms.md): Flagship project of the ecosystem
- [Cytopia](cytopia.llms.md): Conference cycle organised by residents of a university campus
`,

  "/projects/eugenia.llms.md": `# Eugenia

> Sample page for the Eugenia project.

This page has no sub-page: it is a leaf of the hierarchy. Go back with the button above, or use the breadcrumb.

## Resources

- [Graphic charter](https://hwattez.github.io/Graphic-charter/): Design tokens, components and logo
`,

  "/projects/cytopia.llms.md": `# Cytopia

> Sample page for the Cytopia conference cycle.

- [2026 edition](cytopia-2026.llms.md): Programme of the 2026 cycle
`,

  "/projects/cytopia-2026.llms.md": `# Cytopia 2026

> Sample programme, April to July 2026.

1. Conference I
2. Conference II
3. Conference III: *Creating and thinking in the technological age*
`,

  "/conferences/index.llms.md": `# Conferences

> Events of the ecosystem (sample content).

- [Cytopia](../projects/cytopia.llms.md): Conference cycle, also listed under Projects
- [Call for speakers](call.llms.md): How to propose a talk
`,

  "/conferences/call.llms.md": `# Call for speakers

> Sample page.

Send a title, a short abstract and a few words about yourself.
`,

  "/tools/index.llms.md": `# Tools

> Tools shared by the ecosystem (sample content).

- [LLMs.txt Explorer](explorer.llms.md): Browse llms.txt hierarchies
- [Graphic charter](https://github.com/hwattez/Graphic-charter): Source code of the charter (GitHub refuses to be framed: see the warning)
`,

  "/tools/explorer.llms.md": `# LLMs.txt Explorer

> Explore, visualise and navigate llms.txt hierarchies.

- Markdown pages open inside the explorer.
- Other web links open in the integrated viewer.
- Import a page by URL, or paste your own markdown, with **+ Import**.
`,

  "/about.llms.md": `# About

> Sample page.

openEugenia is an ecosystem of conferences, projects and tools.

- [Specification of llms.txt](https://llmstxt.org/llms.txt): Root file of the official specification
`,
};
