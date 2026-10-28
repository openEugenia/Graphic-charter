// <oe-logo> web component.
//
//   <script type="module" src="…/logo/oe-logo.js"></script>
//   <oe-logo></oe-logo>                                  full logo, page brand colour
//   <oe-logo variant="mark" style="width: 48px"></oe-logo>
//   <oe-logo variant="horizontal" label="OE-CONF 2026"></oe-logo>
//   <oe-logo color="#7c3aed"></oe-logo>                 explicit brand colour
//
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

class OeLogo extends HTMLElement {
  static observedAttributes = ["variant", "label", "color"];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    if (this.isConnected) this.render();
  }

  render() {
    const variant = this.getAttribute("variant") || "full";
    const label = this.getAttribute("label") || DEFAULT_LABEL;
    const color = this.getAttribute("color");
    const brand = color ? `:host { --_brand: ${color}; }` : "";

    const content = variant === "horizontal"
      ? `<div class="horizontal">${logoSvg({ variant: "mark", title: "" })}<span>${label.replace(/</g, "&lt;")}</span></div>`
      : logoSvg({ variant, label });

    this.shadowRoot.innerHTML = `<style>${STYLE}${brand}</style>${content}`;
    if (variant === "horizontal") {
      this.shadowRoot.querySelector("svg").setAttribute("aria-hidden", "true");
    }
  }
}

if (!customElements.get("oe-logo")) {
  customElements.define("oe-logo", OeLogo);
}
