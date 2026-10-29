# Graphic-charter

**Documentation and live demo: https://openeugenia.github.io/Graphic-charter/**

Common graphic charter of the whole openEugenia ecosystem: conferences, projects and tools.

It is written in SCSS and distributed in three forms:

- **Ready-to-use CSS** (`dist/`): `--oe-*` custom properties, base styles and `oe-*` components. No tooling required.
- **Sass API** (`scss/`): tokens, functions and mixins for projects writing their own SCSS.
- **Logo** (`logo/`): `<oe-logo>` web component that follows the page's brand colour, plus static SVG files.

The style comes from the logo: navy background `#11161d`, gradient frame, widely tracked capitals,
heavy headings. **Each project of the ecosystem chooses a single colour: its brand colour**
(blue `#2563eb` for openEugenia). Every derived shade follows automatically.

## Usage

### 1. A plain `<link>` (any project)

```html
<!-- Everything: custom properties + base + components -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@openeugenia/graphic-charter@0.3/dist/openeugenia.min.css">

<!-- Or the custom properties only, without any applied style -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@openeugenia/graphic-charter@0.3/dist/openeugenia-tokens.css">
```

These URLs serve the published npm package. Use an exact version (`@0.3.0`) to pin it.

### 2. With npm

```sh
npm install @openeugenia/graphic-charter
# or straight from GitHub:
npm install github:hwattez/Graphic-charter
```

```js
import "@openeugenia/graphic-charter/css";          // full bundle
import "@openeugenia/graphic-charter/css/tokens";   // custom properties only
import "@openeugenia/graphic-charter/logo";         // <oe-logo> component
```

### 3. From SCSS

```scss
@use "sass:map";
@use "pkg:@openeugenia/graphic-charter" as oe;   // Dart Sass ≥ 1.71 with --pkg-importer=node

.my-banner {
  color: var(--oe-color-primary);
  border-color: oe.palette(neutral, 300);
  padding: map.get(oe.$spacing, 5);

  @include oe.up(md) { padding: map.get(oe.$spacing, 7); }
  &:focus-visible { @include oe.focus-ring; }
}

// To also include the charter's styles in your bundle:
@use "pkg:@openeugenia/graphic-charter/scss/openeugenia";
```

In application code, prefer the custom properties (`var(--oe-color-primary)`) over Sass values:
they follow the brand colour and the light/dark theme automatically.

## Brand colour

```css
/* In the project's CSS, after the charter: */
:root { --oe-brand: #0f766e; }
```

or a preset: `<html data-brand="mint">` (`openeugenia`, `mint`, `violet`, `rose`).
A section can also carry its own brand: `<section data-brand="violet">`, or
`<section data-brand style="--oe-brand: #0f766e">` (the `data-brand` attribute is required
for the derived shades to be recomputed on that section).

The colour must reach a contrast of at least 4.5:1 with white text (WCAG AA). In Sass,
`@include oe.brand(#0f766e)` emits the property and warns at compile time if it does not.

## Logo

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@openeugenia/graphic-charter@0.3/logo/oe-logo.js"></script>

<oe-logo></oe-logo>                                    <!-- full logo, 160px wide by default -->
<oe-logo variant="mark" style="width: 48px"></oe-logo> <!-- frame + Œ, no text -->
<oe-logo variant="glyph"></oe-logo>                    <!-- Œ alone, in the text colour (currentColor) -->
<oe-logo variant="horizontal"></oe-logo>              <!-- mark + name, for headers -->
<oe-logo label="OE-CONF 2026"></oe-logo>              <!-- custom text -->
<oe-logo color="#7c3aed"></oe-logo>                   <!-- explicit colour -->
```

Without a `color` attribute, the frame follows the page's `--oe-brand`.

### Options

Each option is enabled by adding its attribute and disabled by removing it. They can be combined.

| Option | Attribute | Effect |
|---|---|---|
| Animation | `animated` | The frame's glow gently moves (±15° back and forth). 7 s per sweep from 240px up, slower for smaller logos (up to 20 s); set `--oe-logo-glow-duration` to override. Stops automatically when the user prefers reduced motion. |
| Semantic matrix | `vector="signature.json"` | Draws a vector (the semantic signature of the project) as a grid of grey squares in the logo's background, like a QR code: 1600 values give a 40×40 grid. The grid also shows through the letters, carved in navy. |
| Vignette | `vignette` | With `vector`: darkens the matrix towards the edges, so the Œ stands out. |
| Brand tint | `tint` | With `vector`: the frame's glow lights the matrix in the brand colour, strongest near the two bright corners and on the brightest squares. Follows the animation. |
| Minimum size | `matrix-min-size="64"` | The matrix is hidden when the logo is smaller than this many pixels (64 by default; `0` always shows it). |

```html
<oe-logo animated vector="openeugenia.json" vignette tint></oe-logo>
<oe-logo vector="[0.12, -0.4, 0.33, …]"></oe-logo>   <!-- inline JSON array -->
<script type="module">
  document.querySelector("oe-logo").vector = embedding;   // array or Float32Array; null removes it
</script>
```

The vector file is a JSON array of numbers, or an object with a `vector` array. Values are
min-max normalised and rendered in 8 grey levels (the lowest level is left empty). A
non-square length gets the smallest grid that fits it.

### Static files

For non-web uses (slides, documents, favicons), `npm run build` writes SVG files for each preset:

```
dist/logo/<brand>/openeugenia-{full,mark}.svg
dist/logo/<brand>/openeugenia-{full,mark}-animated.svg
dist/logo/<brand>/openeugenia-{full,mark}-matrix[-animated].svg   (if logo/vectors/openeugenia.json exists)
dist/logo/openeugenia-glyph.svg
```

The `-matrix` files get the vignette and the tint with `node scripts/build-logos.mjs --vignette --tint`.

The animation also plays in an `<img>` tag, but not in tools that do not run CSS animations
(most slide and document editors show the still frame). The logo's geometry is defined once,
in [`logo/logo.js`](logo/logo.js).

> The logo text uses Inter when available (Helvetica/Arial otherwise).

## Tokens

| Family       | CSS custom properties                           | Sass                                   |
|--------------|-------------------------------------------------|----------------------------------------|
| Brand        | `--oe-brand`, `--oe-brand-glow`                 | `$brands`, `brand-color()`, `@include brand()` |
| Colours      | `--oe-color-{bg,surface,text,primary,…}`        | `palette(neutral, $shade)`, `$status`  |
| Typography   | `--oe-font-{sans,heading,mono}`, `--oe-font-size-{xs…4xl}`, `--oe-font-weight-*`, `--oe-line-height-*`, `--oe-letter-spacing-wide` | `$font-sizes`, `$font-weights`… |
| Spacing      | `--oe-space-{0…9}` (4px grid)                   | `$spacing`                             |
| Shapes       | `--oe-radius-{none,sm,md,lg,full}`, `--oe-shadow-{sm,md,lg}`, `--oe-border-width` | `$radius`, `$shadows` |
| Motion       | `--oe-duration-{fast,normal,slow}`, `--oe-easing` | `$durations`                         |
| Breakpoints  | — (not possible in plain CSS)                   | `$breakpoints`, `@include up(md)`      |

All semantic colours are listed in [`scss/themes/_colors.scss`](scss/themes/_colors.scss).

## Light / dark theme

The theme follows the system preference. To force it:

```html
<html data-theme="dark">   <!-- or "light" -->
```

The attribute also works on any element, to invert a section locally.
Colours use `light-dark()` (Chrome 123+, Firefox 120+, Safari 17.5+).

## Components

All components are prefixed with `oe-` to avoid collisions:
`oe-container`, `oe-button` (`--secondary`, `--ghost`, `--sm`, `--lg`), `oe-card` (`--featured`),
`oe-badge`, `oe-alert`, `oe-field` / `oe-label` / `oe-input` / `oe-select` / `oe-textarea`,
and the utilities `oe-stack`, `oe-cluster`, `oe-grid`, `oe-text-muted`, `oe-visually-hidden`.

Elements taken from the logo: `oe-eyebrow` (capitals tracked like "OPEN-EUGENIA"),
`oe-frame` (gradient frame in the brand colour), `oe-hero` (dark section in the logo's colours).

Symbol tile, a miniature of the logo for projects and pages: `<span class="oe-symbol">Pr</span>`
(`--sm`, `--lg`, `--xl`).

Elements taken from the event posters:

| Class | Use |
|---|---|
| `oe-glass`, `oe-card--glass` | Translucent, blurred panel with a brand-tinted hairline border. Best over an image or inside `oe-hero`; opaque fallback without `backdrop-filter`. Blur: `--oe-glass-blur`. |
| `oe-info` (`__label`, `__value`) | Key fact: icon + tracked uppercase label in the brand colour, then the value. Any inline `<svg>` in the label is sized to it. |
| `oe-tagline` | Brand-coloured lead sentence with a vertical bar. |
| `oe-display` | Poster title: large, bold, tracked capitals. |
| `oe-divider` | Brand-tinted hairline (`<hr class="oe-divider">`). |
| `oe-hero__image` | Background photo of an `oe-hero`, desaturated and tinted navy, darker at the bottom. |

```html
<section class="oe-hero">
  <img class="oe-hero__image" src="building.jpg" alt="">
  <div class="oe-container oe-stack">
    <p class="oe-tagline">Let us imagine more human uses of technology</p>
    <h2 class="oe-display">Creating and thinking in the technological age</h2>
    <hr class="oe-divider">
    <div class="oe-info oe-glass">
      <span class="oe-info__label"><svg …></svg>Date</span>
      <span class="oe-info__value">June 30, 2026 at 7:45 PM</span>
    </div>
  </div>
</section>
```

See the documentation pages, to be served over HTTP (`python3 -m http.server`):

- [`docs/index.html`](docs/index.html): modules (logo, colours, typography, components);
- [`docs/poster.html`](docs/poster.html): event poster built with the editorial modules.
- [`docs/explorer.html`](docs/explorer.html): **LLMs.txt Explorer**, a first tool built on the charter (see below).

Both accept `?theme=light|dark&brand=violet&animated&vector&vignette&tint`, kept when switching pages.

## Tools

### LLMs.txt Explorer

[`docs/explorer.html`](docs/explorer.html) browses a hierarchy of `llms.txt` / `*.llms.md` files:
the page on the left, its sub-pages on the right, each identified by an `oe-symbol`.

- Open a root URL (the server must allow CORS), the built-in demo, or `?src=<url>` / `?src=demo`.
- Markdown links (`.md`, `.txt`, relative) open in the explorer; other web links open in an
  integrated viewer (sites that forbid framing must be opened in a new tab).
- Breadcrumb, back button, tree view, sub-page filter, ⋮ menu per sub-page, sub-page counts
  loaded in the background.
- **+ Import**: add a page by URL or paste markdown under the current page (kept in memory only).
- Remote markdown is rendered with [marked](https://marked.js.org/) and sanitised with
  [DOMPurify](https://github.com/cure53/DOMPurify).

Layout code lives in [`docs/explorer/`](docs/explorer/); everything else comes from the charter.

## Development

```sh
npm install
npm run build    # generates dist/ (CSS + SVG logos)
npm run watch    # recompiles on every change
npm run build:site   # builds the documentation site in _site/ (served by GitHub Pages)
```

```
scss/
├── tokens/          raw values (colours, type, spacing…) — source of truth
├── themes/          semantic colours (light / dark pairs)
├── _custom-properties.scss   emits the tokens as --oe-* custom properties
├── base/            reset and typography of HTML elements
├── components/      .oe-* components
├── utilities/       utility classes
├── _index.scss      public Sass API (emits no CSS)
├── openeugenia.scss         → dist/openeugenia.css
└── openeugenia-tokens.scss  → dist/openeugenia-tokens.css
logo/
├── logo.js          logo geometry and matrix rendering (single source)
├── oe-logo.js       <oe-logo> component
└── vectors/         semantic vectors for the static -matrix logos
scripts/build-logos.mjs      → dist/logo/**/*.svg
```

`dist/` is not committed: it is built when publishing to npm (`prepublishOnly`) and when
installing from GitHub (`prepare`).

The documentation site is the `docs/` pages with `dist/` and `logo/` next to them. It is
built and deployed by [`.github/workflows/pages.yml`](.github/workflows/pages.yml) on every push
to `main`. One-time setup: *Settings → Pages → Source: GitHub Actions*.
