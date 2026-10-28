// Behaviour of the documentation pages only (not part of the charter).
// URL parameters: ?theme=light|dark&brand=violet&animated&vector&vignette&tint

const root = document.documentElement;
const params = new URLSearchParams(location.search);
const setData = (key, value) => value ? root.dataset[key] = value : delete root.dataset[key];

// Theme and brand switchers (shared header).
document.querySelectorAll("[data-set-theme]").forEach((button) =>
  button.addEventListener("click", () => setData("theme", button.dataset.setTheme)));
const brand = document.getElementById("brand");
brand.addEventListener("change", () => setData("brand", brand.value));

setData("theme", params.get("theme"));
if (params.get("brand")) {
  brand.value = params.get("brand");
  setData("brand", brand.value);
}

// Keep the current theme, brand and logo options when switching pages.
document.querySelectorAll(".site-nav a").forEach((link) =>
  link.addEventListener("click", () => { link.search = currentParams(); }));

function currentParams() {
  const next = new URLSearchParams();
  if (root.dataset.theme) next.set("theme", root.dataset.theme);
  if (root.dataset.brand) next.set("brand", root.dataset.brand);
  for (const option of Object.keys(toggles)) {
    if (document.getElementById(`toggle-${option}`)?.checked) next.set(option, "");
  }
  return next.toString().replaceAll("=&", "&").replace(/=$/, "");
}

// Logo options on every .demo-logo: adding / removing the attribute is all it takes.
const logos = document.querySelectorAll(".demo-logo");
const toggles = {
  animated: (on) => logos.forEach((l) => l.toggleAttribute("animated", on)),
  vector: (on) => logos.forEach((l) => on ? l.setAttribute("vector", "sample-vector.json") : l.removeAttribute("vector")),
  vignette: (on) => logos.forEach((l) => l.toggleAttribute("vignette", on)),
  tint: (on) => logos.forEach((l) => l.toggleAttribute("tint", on)),
};
for (const [option, apply] of Object.entries(toggles)) {
  const input = document.getElementById(`toggle-${option}`);
  input?.addEventListener("change", () => apply(input.checked));
  if (params.has(option)) {
    if (input) input.checked = true;
    apply(true);
  }
}

// Semantic colour swatches (modules page).
const swatches = document.getElementById("swatches");
if (swatches) {
  const tokens = ["bg", "surface", "border", "text", "text-muted", "primary", "primary-hover", "primary-subtle", "success", "warning", "danger", "info"];
  swatches.innerHTML = tokens.map((t) =>
    `<div class="swatch"><div style="background: var(--oe-color-${t})"></div><code>--oe-color-${t}</code></div>`
  ).join("");
}
