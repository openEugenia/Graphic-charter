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

// The Œ ligature: an O ring cut by the E stem.
const LIGATURE = `
  <path clip-path="url(#ID-o)" fill-rule="evenodd"
        d="M266 499a198 235 0 1 0 396 0a198 235 0 1 0 -396 0Z
           M376 499a114 145 0 1 0 228 0a114 145 0 1 0 -228 0Z"/>
  <path d="M616 271H908V359H710V456H896V537H710V638H908V726H616Z"/>`;
const LIGATURE_DEFS = `<clipPath id="ID-o"><rect x="0" y="0" width="616" height="1208"/></clipPath>`;

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
 * @param {string} [options.glow] frame colour; defaults to the page's
 *   --oe-brand-glow when the SVG is inlined.
 * @param {string} [options.title] accessible name.
 */
export function logoSvg({
  variant = "full",
  label = DEFAULT_LABEL,
  glow: glowColor = `var(--oe-brand-glow, ${glow(BRANDS.openeugenia)})`,
  title = label,
} = {}) {
  const id = `oe-logo-${++counter}`;
  const a11y = `role="img" aria-label="${escape(title)}"`;

  if (variant === "glyph") {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="266 264 642 470" fill="currentColor" ${a11y}>
  <defs>${LIGATURE_DEFS}</defs>${LIGATURE}
</svg>`.replaceAll("ID", id);
  }

  // Wordmark sized like the original; short labels keep their natural tracking.
  const text = variant === "full"
    ? `<text x="604" y="1021" text-anchor="middle" fill="#fff"
        font-family="Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="84" font-weight="500"
        textLength="${Math.min(1005, label.length * 84)}" lengthAdjust="spacing">${escape(label)}</text>`
    : "";
  const ligatureOffset = variant === "full" ? "" : ` transform="translate(17 105)"`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1208 1208" ${a11y}>
  <defs>
    <linearGradient id="ID-frame" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" style="stop-color: ${glowColor}"/>
      <stop offset="0.5" stop-color="#05080b"/>
      <stop offset="1" style="stop-color: ${glowColor}"/>
    </linearGradient>
    ${LIGATURE_DEFS}
  </defs>
  <rect x="9" y="9" width="1190" height="1190" rx="80" fill="${LOGO_BG}" stroke="url(#ID-frame)" stroke-width="18"/>
  <g fill="#fff"${ligatureOffset}>${LIGATURE}</g>
  ${text}
</svg>`.replaceAll("ID", id);
}
