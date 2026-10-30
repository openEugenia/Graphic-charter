// <oe-logo> web component.
//
//   <script type="module" src="…/logo/oe-logo.js"></script>
//   <oe-logo></oe-logo>                                  full logo, page brand colour
//   <oe-logo variant="mark" style="width: 48px"></oe-logo>
//   <oe-logo variant="horizontal" label="OE-CONF 2026"></oe-logo>
//   <oe-logo variant="lockup"></oe-logo>                Œ on the left, label stacked on the right
//   <oe-logo color="#7c3aed"></oe-logo>                 explicit brand colour
//   <oe-logo initials="OC"></oe-logo>                   letters instead of the Œ
//   <oe-logo initials="Cy" exponent="26"></oe-logo>     with a small exponent
//
// Options, each enabled by its attribute and disabled by removing it:
//   <oe-logo animated></oe-logo>                        frame glow gently moves
//   <oe-logo vector="signature.json"></oe-logo>         vector drawn as a background matrix
//   <oe-logo vector="[0.12, -0.4, …]"></oe-logo>        inline JSON array
//   logo.vector = float32Array;                         or set from JavaScript
//   <oe-logo vector="…" vignette></oe-logo>             matrix darkened towards the edges
//   <oe-logo vector="…" tint></oe-logo>                 brightest squares in the brand colour
//   <oe-logo no-background no-frame ink="#11161d"></oe-logo>  letters and wordmark alone
//   <oe-logo label-weight="300"></oe-logo>              thinner wordmark (100 to 900)
//
// The JSON file holds an array of numbers, or an object with a `vector` array.
// The matrix is hidden when the logo is smaller than `matrix-min-size` pixels
// (64 by default, 0 to always show it): below that it only reads as a texture.
//
// With `animated`, small logos move more slowly (7s from 240px up, up to 20s):
// the same rotation looks hasty on a few pixels. Override with the CSS
// property --oe-logo-glow-duration.
// Without `color`, the frame follows --oe-brand of the page (charter CSS).

import { BRANDS, DEFAULT_LABEL, logoSvg } from "./logo.js";

const STYLE = `
  :host {
    --_brand: var(--oe-brand, ${BRANDS.openeugenia});
    --oe-brand-glow: color-mix(in srgb, var(--_brand) 65%, #fff);
    display: inline-block;
    width: 160px;
    line-height: 0;
    vertical-align: middle;
  }
  :host([hidden]) { display: none; }
  svg { width: 100%; height: auto; }
  :host([variant="glyph"]) { width: 2em; }
  :host([variant="horizontal"]) { width: auto; height: 2.5rem; }
  .horizontal { display: inline-flex; align-items: center; gap: 0.75em; height: 100%; line-height: 1; }
  .horizontal svg { width: auto; height: 100%; }
  .horizontal span {
    font-family: var(--oe-font-sans, Inter, system-ui, sans-serif);
    font-weight: 600;
    font-size: 0.875em;
    letter-spacing: var(--oe-letter-spacing-wide, 0.3em);
    color: currentColor;
    white-space: nowrap;
  }
`;

const DEFAULT_MATRIX_MIN_SIZE = 64;

function glowDuration(size) {
  return Math.min(20, Math.max(7, (7 * 240) / Math.max(size, 1)));
}

class OeLogo extends HTMLElement {
  static observedAttributes = ["variant", "label", "initials", "exponent", "color", "animated", "vector", "vignette", "tint", "no-background", "no-frame", "ink", "label-weight", "matrix-min-size"];

  #vector = null;
  #vectorRequest = 0;
  #tooSmall = false;
  #duration = 7;
  #resizeObserver = new ResizeObserver(([entry]) => {
    // The horizontal variant's mark is as tall as the element.
    const { width, height } = entry.contentRect;
    const size = this.getAttribute("variant") === "horizontal" ? height : width;

    // Updated in place: re-rendering would restart the animation.
    const duration = glowDuration(size);
    if (Math.abs(duration - this.#duration) >= 0.5) {
      this.#duration = duration;
      const style = this.shadowRoot.querySelector("#duration");
      if (style) style.textContent = this.#durationStyle();
    }

    const minSize = Number(this.getAttribute("matrix-min-size") ?? DEFAULT_MATRIX_MIN_SIZE);
    const tooSmall = size < minSize;
    if (tooSmall !== this.#tooSmall) {
      this.#tooSmall = tooSmall;
      if (this.#vector) this.render();
    }
  });

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  get vector() {
    return this.#vector;
  }

  set vector(values) {
    this.#vectorRequest++;
    this.#vector = values ? Array.from(values) : null;
    this.render();
  }

  connectedCallback() {
    this.#resizeObserver.observe(this);
    this.render();
  }

  disconnectedCallback() {
    this.#resizeObserver.disconnect();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "vector") {
      this.#loadVector(newValue);
    } else if (name === "matrix-min-size") {
      // Re-measure against the new threshold.
      this.#resizeObserver.disconnect();
      if (this.isConnected) this.#resizeObserver.observe(this);
    } else if (this.isConnected) {
      this.render();
    }
  }

  async #loadVector(source) {
    const request = ++this.#vectorRequest;
    let vector = null;
    try {
      if (source?.trim().startsWith("[")) {
        vector = JSON.parse(source);
      } else if (source) {
        const response = await fetch(source);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        vector = Array.isArray(data) ? data : data.vector;
      }
    } catch (error) {
      console.warn(`<oe-logo>: cannot load vector "${source}"`, error);
    }
    // Ignore responses superseded by a newer attribute or property value.
    if (request !== this.#vectorRequest) return;
    this.#vector = vector;
    if (this.isConnected) this.render();
  }

  #durationStyle() {
    return `:host { --_oe-logo-auto-duration: ${this.#duration.toFixed(1)}s; }`;
  }

  render() {
    const variant = this.getAttribute("variant") || "full";
    const label = this.getAttribute("label") || DEFAULT_LABEL;
    const color = this.getAttribute("color");
    const brand = color ? `:host { --_brand: ${color}; }` : "";
    const options = {
      initials: this.getAttribute("initials") || "",
      exponent: this.getAttribute("exponent") || "",
      animated: this.hasAttribute("animated"),
      vector: this.#tooSmall ? null : this.#vector,
      vignette: this.hasAttribute("vignette"),
      tint: this.hasAttribute("tint"),
      background: !this.hasAttribute("no-background"),
      frame: !this.hasAttribute("no-frame"),
      ink: this.getAttribute("ink") || undefined,
      labelWeight: this.getAttribute("label-weight") || undefined,
    };

    const content = variant === "horizontal"
      ? `<div class="horizontal">${logoSvg({ variant: "mark", title: "", ...options })}<span>${label.replace(/</g, "&lt;")}</span></div>`
      : logoSvg({ variant, label, ...options });

    this.shadowRoot.innerHTML = `<style>${STYLE}${brand}</style><style id="duration">${this.#durationStyle()}</style>${content}`;
    if (variant === "horizontal") {
      this.shadowRoot.querySelector("svg").setAttribute("aria-hidden", "true");
    }
  }
}

if (!customElements.get("oe-logo")) {
  customElements.define("oe-logo", OeLogo);
}
