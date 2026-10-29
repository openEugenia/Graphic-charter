// openEugenia logo: single source of the geometry, used by the <oe-logo>
// web component and by scripts/build-logos.mjs (static SVG files).
// No DOM dependency: works in browsers and in Node.

export const DEFAULT_LABEL = "OPEN-EUGENIA";
export const LOGO_BG = "#11161d";

// Keep in sync with $brands in scss/tokens/_brands.scss.
export const BRANDS = {
  openeugenia: "#2563eb",
  mint: "#187a58",
  violet: "#7c3aed",
  rose: "#be185d",
};

// Same formula as --oe-brand-glow: color-mix(in srgb, brand 65%, #fff).
export function glow(hex) {
  const n = parseInt(hex.replace("#", ""), 16);
  return "#" + [16, 8, 0]
    .map((shift) => Math.round(((n >> shift) & 255) * 0.65 + 255 * 0.35))
    .map((c) => c.toString(16).padStart(2, "0"))
    .join("");
}

const SIZE = 1208;
// Inner edge of the frame (stroke of 18 centred on 9).
const FRAME_INNER = 18;
// Radius of the frame's inner edge: about one matrix square, so the corner
// squares can follow the curve instead of being cut.
const INNER_RADIUS = 24;
const FRAME_RADIUS = INNER_RADIUS + 9;

// The Œ ligature: an O ring cut by the E stem (clipped 8 units under the stem
// to avoid an anti-aliasing seam).
const LIGATURE = `
  <path clip-path="url(#__ID__-o)" fill-rule="evenodd"
        d="M266 499a198 235 0 1 0 396 0a198 235 0 1 0 -396 0Z
           M376 499a114 145 0 1 0 228 0a114 145 0 1 0 -228 0Z"/>
  <path d="M616 271H908V359H710V456H896V537H710V638H908V726H616Z"/>`;
const LIGATURE_DEFS = `<clipPath id="__ID__-o"><rect x="0" y="0" width="624" height="${SIZE}"/></clipPath>`;

// Other initials are set in Inter, centred on the ligature (587,499): capitals
// as tall as it (470), smaller when wider than GLYPH_BOX.width, which leaves
// a margin inside the frame.
// An exponent (e.g. the year, as in a periodic table) follows them, its top
// aligned with theirs.
const GLYPH_BOX = { x: 587, y: 499, width: 900, height: 470 };
const CAP_HEIGHT = 0.727; // Inter, in em
const EXPONENT_SCALE = 0.36;
const TRACKING = -0.03; // em, tighter as in a display setting
// Advance widths of Inter Bold, roughly, in em.
const advance = (c) => (/[0-9]/.test(c) ? 0.62 : c === c.toUpperCase() ? 0.72 : 0.56);
const ems = (text) => [...text].reduce((sum, c) => sum + advance(c) + TRACKING, 0);
function initialsSvg(initials, exponent) {
  const width = ems(initials) + ems(exponent) * EXPONENT_SCALE;
  const fontSize = Math.round(Math.min(GLYPH_BOX.height / CAP_HEIGHT, GLYPH_BOX.width / width));
  const sup = exponent
    ? `<tspan dy="${Math.round(-fontSize * CAP_HEIGHT * (1 - EXPONENT_SCALE) / 2)}" font-size="${Math.round(fontSize * EXPONENT_SCALE)}">${escape(exponent)}</tspan>`
    : "";
  return `
  <text x="${GLYPH_BOX.x}" y="${GLYPH_BOX.y}" text-anchor="middle" dominant-baseline="central"
        font-family="Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="${fontSize}" font-weight="700" letter-spacing="${(TRACKING * fontSize).toFixed(1)}">${escape(initials)}${sup}</text>`;
}

// Slow back-and-forth rotation of the frame gradient. CSS (not SMIL) so that
// prefers-reduced-motion is honoured, even in a static file shown with <img>.
// Duration: --oe-logo-glow-duration if set, else the one <oe-logo> computes
// from its size, else 7s.
const ANIMATION_STYLE = `<style>
    .oe-logo-glow {
      transform-box: view-box; transform-origin: 50% 50%;
      animation: oe-logo-glow var(--oe-logo-glow-duration, var(--_oe-logo-auto-duration, 7s)) ease-in-out infinite alternate;
    }
    @keyframes oe-logo-glow { from { transform: rotate(-15deg); } to { transform: rotate(15deg); } }
    @media (prefers-reduced-motion: reduce) { .oe-logo-glow { animation: none; } }
  </style>`;

// Matrix opacities: behind the letters, carved into the letters, brand tint.
const MATRIX_OPACITY = 0.24;
const KNOCKOUT_OPACITY = 0.45;
const TINT_OPACITY = 0.5;

// One square, with its outer corner rounded when it sits in a frame corner.
function cellPath(x, y, s, r, corner) {
  const t = (s - r).toFixed(2);
  switch (corner) {
    case "tl": return `M${x} ${(y + r).toFixed(1)}a${r} ${r} 0 0 1 ${r} -${r}h${t}v${s}h-${s}z`;
    case "tr": return `M${x} ${y}h${t}a${r} ${r} 0 0 1 ${r} ${r}v${t}h-${s}z`;
    case "br": return `M${x} ${y}h${s}v${t}a${r} ${r} 0 0 1 -${r} ${r}h-${t}z`;
    case "bl": return `M${x} ${y}h${s}v${s}h-${t}a${r} ${r} 0 0 1 -${r} -${r}z`;
    default: return `M${x} ${y}h${s}v${s}h-${s}z`;
  }
}

/**
 * Renders a vector (e.g. the semantic signature of the project) as a grid of
 * squares, like a QR code: 1600 values give a 40×40 grid.
 * Values are min-max normalised then quantised into `levels` shades, one
 * <path> per shade with a relative fill-opacity (the highest shade is 1); the
 * lowest shade is left empty. The group has no fill, so each <use> of it
 * chooses its colour and overall opacity. The four corner squares are rounded
 * with `cornerRadius` to follow the frame.
 */
export function matrixSvg(vector, { id, levels = 8, inset = FRAME_INNER, cornerRadius = INNER_RADIUS } = {}) {
  const values = Array.from(vector, Number).filter(Number.isFinite);
  if (!values.length) return "";

  const min = Math.min(...values);
  const range = Math.max(...values) - min || 1;
  const cols = Math.ceil(Math.sqrt(values.length));
  const rows = Math.ceil(values.length / cols);
  const area = SIZE - 2 * inset;
  // Gaps only between squares: the outer squares touch the frame.
  const gapRatio = 0.14;
  const pitch = area / (Math.max(cols, rows) - gapRatio);
  const gap = pitch * gapRatio;
  const side = pitch - gap;
  const radius = Math.min(cornerRadius, side);
  const corners = { 0: "tl", [cols - 1]: "tr", [(rows - 1) * cols]: "bl", [rows * cols - 1]: "br" };
  const x0 = inset + (area - (cols * pitch - gap)) / 2;
  const y0 = inset + (area - (rows * pitch - gap)) / 2;

  const shades = Array.from({ length: levels }, () => []);
  values.forEach((value, i) => {
    const level = Math.min(levels - 1, Math.floor(((value - min) / range) * levels));
    if (level === 0) return;
    const x = +(x0 + (i % cols) * pitch).toFixed(1);
    const y = +(y0 + Math.floor(i / cols) * pitch).toFixed(1);
    shades[level].push(cellPath(x, y, +side.toFixed(2), +radius.toFixed(2), corners[i]));
  });

  const paths = shades
    .map((d, level) => d.length
      ? `<path fill-opacity="${(level / (levels - 1)).toFixed(3)}" d="${d.join("")}"/>`
      : "")
    .join("");
  return `<g id="${id}" class="oe-logo-matrix">${paths}</g>`;
}

let counter = 0;

function escape(text) {
  return String(text).replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
}

/**
 * Returns the logo as an SVG string.
 * @param {object} options
 * @param {"full"|"mark"|"glyph"} [options.variant] full: frame + Œ + label;
 *   mark: frame + Œ (favicons, avatars); glyph: Œ alone in currentColor.
 * @param {string} [options.label] wordmark text of the "full" variant.
 * @param {string} [options.initials] letters in the frame; empty for the
 *   drawn Œ ligature.
 * @param {string} [options.exponent] small text after the initials, at the
 *   top (e.g. "26").
 * @param {string} [options.glow] frame colour; defaults to the page's
 *   --oe-brand-glow when the SVG is inlined.
 * @param {string} [options.title] accessible name.
 * @param {boolean} [options.animated] gently moves the frame glow.
 * @param {ArrayLike<number>} [options.vector] draws it as a background matrix,
 *   also carved into the letters.
 * @param {boolean} [options.vignette] darkens the matrix towards the edges.
 * @param {boolean} [options.tint] lights the matrix with the brand glow,
 *   strongest near the frame's bright corners and on the brightest squares.
 */
export function logoSvg({
  variant = "full",
  label = DEFAULT_LABEL,
  initials = "",
  exponent = "",
  glow: glowColor = `var(--oe-brand-glow, ${glow(BRANDS.openeugenia)})`,
  title = label,
  animated = false,
  vector = null,
  vignette = false,
  tint = false,
} = {}) {
  const id = `oe-logo-${++counter}`;
  const a11y = `role="img" aria-label="${escape(title)}"`;
  const glyph = initials.trim() ? initialsSvg(initials.trim(), exponent.trim()) : LIGATURE;

  if (variant === "glyph") {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="266 264 642 470" fill="currentColor" ${a11y}>
  <defs>${LIGATURE_DEFS}</defs>${glyph}
</svg>`.replaceAll("__ID__", id);
  }

  // Wordmark sized like the original; short labels keep their natural tracking.
  const text = variant === "full"
    ? `<text x="604" y="1021" text-anchor="middle" fill="#fff"
        font-family="Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="84" font-weight="500"
        textLength="${Math.min(1005, label.length * 84)}" lengthAdjust="spacing">${escape(label)}</text>`
    : "";
  const ligatureOffset = variant === "full" ? "" : ` transform="translate(17 105)"`;

  // Matrix: white behind the letters, navy carved into the letters, and
  // optionally a brand-coloured light and a radial vignette centred on the Œ.
  // The light is the frame's gradient (rotating with it when animated) seen
  // through the matrix: each square takes it in proportion to its value.
  const matrix = vector ? matrixSvg(vector, { id: "__ID__-matrix" }) : "";
  const matrixDefs = matrix && `${matrix}
    <mask id="__ID__-letters" maskUnits="userSpaceOnUse" x="0" y="0" width="${SIZE}" height="${SIZE}">
      <g fill="#fff"${ligatureOffset}>${glyph}</g>
    </mask>
    <radialGradient id="__ID__-vignette" cx="0.5" cy="${variant === "full" ? 0.42 : 0.5}" r="0.55">
      <stop offset="0.55" stop-color="${LOGO_BG}" stop-opacity="0"/>
      <stop offset="1" stop-color="${LOGO_BG}" stop-opacity="0.55"/>
    </radialGradient>
    <linearGradient id="__ID__-tint" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${SIZE}" y2="${SIZE}">
      <stop offset="0" style="stop-color: ${glowColor}"/>
      <stop offset="0.5" style="stop-color: ${glowColor}" stop-opacity="0.2"/>
      <stop offset="1" style="stop-color: ${glowColor}"/>
    </linearGradient>
    <mask id="__ID__-tint-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="${SIZE}" height="${SIZE}">
      <use href="#__ID__-matrix" fill="#fff"/>
    </mask>`;
  const matrixBehind = matrix && `<use href="#__ID__-matrix" fill="#fff" opacity="${MATRIX_OPACITY}"/>
  ${tint ? `<g mask="url(#__ID__-tint-mask)" opacity="${TINT_OPACITY}">
    <rect class="oe-logo-glow" x="-400" y="-400" width="${SIZE + 800}" height="${SIZE + 800}" fill="url(#__ID__-tint)"/>
  </g>` : ""}
  ${vignette ? `<rect width="${SIZE}" height="${SIZE}" fill="url(#__ID__-vignette)"/>` : ""}`;
  const matrixInLetters = matrix && `<g mask="url(#__ID__-letters)">
    <use href="#__ID__-matrix" fill="${LOGO_BG}" opacity="${KNOCKOUT_OPACITY}"/>
  </g>`;

  // The frame is a mask over an oversized gradient rect, so the gradient can
  // be rotated without its ends showing.
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" ${a11y}>
  ${animated ? ANIMATION_STYLE : ""}
  <defs>
    <linearGradient id="__ID__-frame" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${SIZE}" y2="${SIZE}">
      <stop offset="0" style="stop-color: ${glowColor}"/>
      <stop offset="0.5" stop-color="#05080b"/>
      <stop offset="1" style="stop-color: ${glowColor}"/>
    </linearGradient>
    <mask id="__ID__-frame-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="${SIZE}" height="${SIZE}">
      <rect x="9" y="9" width="1190" height="1190" rx="${FRAME_RADIUS}" fill="none" stroke="#fff" stroke-width="18"/>
    </mask>
    ${LIGATURE_DEFS}
    ${matrixDefs}
  </defs>
  <rect x="9" y="9" width="1190" height="1190" rx="${FRAME_RADIUS}" fill="${LOGO_BG}"/>
  ${matrixBehind}
  <g fill="#fff"${ligatureOffset}>${glyph}</g>
  ${matrixInLetters}
  ${text}
  <g mask="url(#__ID__-frame-mask)">
    <rect class="oe-logo-glow" x="-400" y="-400" width="${SIZE + 800}" height="${SIZE + 800}" fill="url(#__ID__-frame)"/>
  </g>
</svg>`.replaceAll("__ID__", id);
}
