// LLMs.txt Explorer: browse a hierarchy of llms.txt / *.llms.md files.
//
// A page is a markdown file; the links it contains are its sub-pages.
// Markdown links (.md, .txt, relative) open inside the explorer, other web
// links open in the integrated viewer. Remote markdown is sanitised before
// being displayed.

import { marked } from "https://cdn.jsdelivr.net/npm/marked@12.0.2/lib/marked.esm.js";
import DOMPurify from "https://cdn.jsdelivr.net/npm/dompurify@3.1.6/dist/purify.es.mjs";
import { DEMO_FILES, DEMO_ORIGIN, DEMO_ROOT } from "./demo-data.js";

const IMPORT_ORIGIN = "https://import.local";
const DOC_EXTENSION = /\.(md|markdown|txt)$/i;
const PREFETCH_LIMIT = 40;

const $ = (id) => document.getElementById(id);
const el = {
  explorer: $("explorer"),
  breadcrumb: $("breadcrumb"),
  symbol: $("page-symbol"),
  title: $("page-title"),
  path: $("page-path"),
  back: $("back"),
  linkCount: $("link-count"),
  content: $("page-content"),
  filter: $("filter"),
  subpages: $("subpage-list"),
  subpageCount: $("subpage-count"),
  subpagesEmpty: $("subpages-empty"),
  treePanel: $("tree-panel"),
  tree: $("tree"),
  toggleView: $("toggle-view"),
  sourceDialog: $("source-dialog"),
  sourceForm: $("source-form"),
  sourceUrl: $("source-url"),
  sourceCancel: $("source-cancel"),
  importDialog: $("import-dialog"),
  importForm: $("import-form"),
  importTarget: $("import-target"),
  importUrl: $("import-url"),
  importMarkdown: $("import-markdown"),
  viewerDialog: $("viewer-dialog"),
  viewerFrame: $("viewer-frame"),
  viewerTitle: $("viewer-title"),
  viewerOpen: $("viewer-open"),
  toasts: $("toasts"),
};

const state = {
  root: null,
  nodes: new Map(),        // url -> { url, title, summary, html, links, imported, parent }
  pending: new Map(),      // url -> Promise<node>
  importedTexts: new Map(),// pseudo url -> pasted markdown
  path: [],                // breadcrumb, from the root to the current page
  history: [],             // previous paths, for the back button
  prefetched: 0,
};

const current = () => state.path.at(-1);

// ---- Helpers ---------------------------------------------------------------

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

/** Two-letter symbol, element style: "Projects" -> "Pr", "open Eugenia" -> "OE" (shown "Œ"). */
export function symbolFor(title) {
  const words = String(title)
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .split(/[\s_\-/]+/)
    .map((w) => w.replace(/^[^\p{L}]+/u, ""))
    .filter(Boolean);
  if (!words.length) return "?";
  const symbol = words.length >= 2
    ? words[0][0].toUpperCase() + words[1][0].toUpperCase()
    : words[0][0].toUpperCase() + (words[0][1] ?? "").toLowerCase();
  return symbol === "OE" ? "Œ" : symbol;
}

function isLocal(url) {
  const { origin } = new URL(url);
  return origin === DEMO_ORIGIN || origin === IMPORT_ORIGIN;
}

function fileName(url) {
  const { pathname, hostname } = new URL(url);
  return decodeURIComponent(pathname.split("/").filter(Boolean).pop() || hostname);
}

function plainText(markdown) {
  return markdown.replace(/[*_`#>]/g, "").replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").trim();
}

/** "doc": opens in the explorer; "web": opens in the viewer. */
function classify(rawHref, target) {
  if (target.origin === DEMO_ORIGIN || target.origin === IMPORT_ORIGIN) return "doc";
  if (DOC_EXTENSION.test(target.pathname)) return "doc";
  const relative = !/^[a-z][a-z0-9+.-]*:/i.test(rawHref) && !rawHref.startsWith("//");
  return relative ? "doc" : "web";
}

function toast(message, kind = "info", title) {
  const item = document.createElement("div");
  item.className = `oe-alert oe-alert--${kind}`;
  item.setAttribute("role", kind === "danger" ? "alert" : "status");
  item.innerHTML = `${title ? `<strong class="oe-alert__title">${escapeHtml(title)}</strong>` : ""}${escapeHtml(message)}`;
  el.toasts.append(item);
  setTimeout(() => item.remove(), kind === "danger" ? 7000 : 4500);
}

// ---- Loading and parsing -----------------------------------------------------

class NotMarkdownError extends Error {}

async function fetchText(url) {
  const { origin, pathname } = new URL(url);
  if (origin === DEMO_ORIGIN) {
    if (!(pathname in DEMO_FILES)) throw new Error("Not found in the demo");
    return DEMO_FILES[pathname];
  }
  if (origin === IMPORT_ORIGIN) return state.importedTexts.get(url);

  let response;
  try {
    response = await fetch(url);
  } catch {
    throw new Error("Network error, or the server does not allow cross-origin requests (CORS).");
  }
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const type = response.headers.get("content-type") ?? "";
  if (type.includes("text/html") && !DOC_EXTENSION.test(new URL(url).pathname)) {
    throw new NotMarkdownError("This link is a web page, not a markdown file.");
  }
  return response.text();
}

function parse(url, markdown) {
  const tokens = marked.lexer(markdown);
  const heading = tokens.find((t) => t.type === "heading" && t.depth === 1);
  const quote = tokens.find((t) => t.type === "blockquote");

  const template = document.createElement("template");
  template.innerHTML = DOMPurify.sanitize(marked.parser(tokens));

  const links = [];
  for (const a of template.content.querySelectorAll("a[href]")) {
    const raw = a.getAttribute("href");
    if (raw.startsWith("#")) continue;
    let target;
    try {
      target = new URL(raw, url);
    } catch {
      continue;
    }
    if (!/^https?:$/.test(target.protocol)) continue;
    target.hash = "";

    const kind = classify(raw, target);
    a.href = target.href;
    a.dataset.kind = kind;
    if (kind === "web") a.classList.add("is-web");

    if (links.some((l) => l.url === target.href)) continue;
    const item = a.closest("li");
    const desc = item
      ? item.textContent.replace(a.textContent, "").split("\n")[0].replace(/^[\s:–—-]+/, "").trim()
      : "";
    links.push({ url: target.href, title: a.textContent.trim() || fileName(target.href), desc, kind });
  }

  return {
    url,
    title: heading ? plainText(heading.text) : fileName(url),
    summary: quote ? plainText(quote.text) : "",
    html: template.innerHTML,
    links,
    imported: [],
    parent: null,
  };
}

/** Loads a page once; concurrent calls share the same request. */
function load(url) {
  if (state.nodes.has(url)) return Promise.resolve(state.nodes.get(url));
  if (!state.pending.has(url)) {
    const request = fetchText(url)
      .then((markdown) => {
        const node = parse(url, markdown);
        state.nodes.set(url, node);
        for (const child of node.links) {
          if (child.kind === "doc" && state.nodes.has(child.url)) state.nodes.get(child.url).parent ??= url;
        }
        return node;
      })
      .finally(() => state.pending.delete(url));
    state.pending.set(url, request);
  }
  return state.pending.get(url);
}

/** Sub-pages of a page: its links, then the pages imported into it. */
function subpagesOf(node) {
  const imported = node.imported
    .map((url) => state.nodes.get(url))
    .filter(Boolean)
    .map((n) => ({ url: n.url, title: n.title, desc: n.summary, kind: "doc", imported: true }));
  return [...node.links, ...imported];
}

function childCount(url) {
  const node = state.nodes.get(url);
  return node ? subpagesOf(node).length : null;
}

/** Loads the markdown sub-pages in the background to show their counts. */
async function prefetch(node) {
  const queue = subpagesOf(node).filter((s) => s.kind === "doc" && !state.nodes.has(s.url));
  const worker = async () => {
    while (queue.length && state.prefetched < PREFETCH_LIMIT) {
      const { url } = queue.shift();
      state.prefetched++;
      try {
        const child = await load(url);
        child.parent ??= node.url;
      } catch {
        // Counted as unknown; the error is reported if the user opens it.
      }
      if (current() === node.url) renderSubpages(node);
    }
  };
  await Promise.all([worker(), worker(), worker()]);
}

// ---- Navigation --------------------------------------------------------------

/**
 * Opens a page. `path` is the breadcrumb to show; by default the page is
 * appended to the current one (or the breadcrumb is cut back to it).
 */
async function navigate(url, { path, remember = true } = {}) {
  let node;
  try {
    node = await load(url);
  } catch (error) {
    if (error instanceof NotMarkdownError) {
      openWeb(url);
    } else {
      toast(`${fileName(url)}: ${error.message}`, "danger", "Could not load the page");
    }
    return false;
  }

  if (!path) {
    const index = state.path.indexOf(url);
    path = index >= 0 ? state.path.slice(0, index + 1) : [...state.path, url];
  }
  if (remember && state.path.length) state.history.push(state.path);
  state.path = path;
  state.prefetched = 0;

  el.filter.value = "";
  setTreeView(false);
  render();
  window.scrollTo({ top: 0 });
  prefetch(node);
  return true;
}

function goBack() {
  const path = state.history.pop();
  if (path) navigate(path.at(-1), { path, remember: false });
}

async function openRoot(url) {
  state.nodes.clear();
  state.importedTexts.clear();
  state.history = [];
  state.path = [];
  state.root = url;
  const ok = await navigate(url, { path: [url], remember: false });
  if (ok) {
    const params = new URLSearchParams(location.search);
    params.set("src", url === DEMO_ROOT ? "demo" : url);
    history.replaceState(null, "", `?${params}`);
  } else {
    showSource();
  }
}

function follow(link) {
  if (link.kind === "web") openWeb(link.url, link.title);
  else navigate(link.url);
}

// ---- Rendering ---------------------------------------------------------------

function render() {
  const node = state.nodes.get(current());
  if (!node) return;
  document.title = `${node.title} · LLMs.txt Explorer`;

  el.symbol.textContent = symbolFor(node.title);
  el.title.textContent = node.title;
  el.path.textContent = isLocal(node.url) ? new URL(node.url).pathname : node.url;
  if (isLocal(node.url)) el.path.removeAttribute("href");
  else el.path.href = node.url;
  el.back.disabled = !state.history.length;
  el.linkCount.textContent = `${node.links.length} link${node.links.length === 1 ? "" : "s"}`;
  el.content.innerHTML = node.html;
  el.importTarget.textContent = node.title;

  renderBreadcrumb();
  renderSubpages(node);
}

function renderBreadcrumb() {
  el.breadcrumb.replaceChildren();
  state.path.forEach((url, index) => {
    const node = state.nodes.get(url);
    if (index) {
      const sep = document.createElement("span");
      sep.className = "sep";
      sep.textContent = "/";
      el.breadcrumb.append(sep);
    }
    const button = document.createElement("button");
    button.type = "button";
    button.innerHTML = `<span class="oe-symbol" style="--_size: 1.5rem">${escapeHtml(symbolFor(node?.title ?? "?"))}</span><span>${escapeHtml(node?.title ?? fileName(url))}</span>`;
    if (index === state.path.length - 1) button.setAttribute("aria-current", "page");
    else button.addEventListener("click", () => navigate(url, { path: state.path.slice(0, index + 1) }));
    el.breadcrumb.append(button);
  });
}

function renderSubpages(node) {
  const all = subpagesOf(node);
  const query = el.filter.value.trim().toLowerCase();
  const shown = query
    ? all.filter((s) => `${s.title} ${s.desc} ${s.url}`.toLowerCase().includes(query))
    : all;

  el.subpageCount.textContent = all.length;
  el.subpagesEmpty.hidden = shown.length > 0;
  el.subpagesEmpty.textContent = all.length ? "No sub-page matches the filter." : "No sub-page.";

  el.subpages.replaceChildren(...shown.map((subpage) => {
    const count = subpage.kind === "doc" ? childCount(subpage.url) : null;
    const loading = subpage.kind === "doc" && count === null && state.pending.has(subpage.url);
    const meta = subpage.kind === "web"
      ? `<span class="oe-badge oe-badge--info">🌐 Web</span>`
      : `<span class="subpage__count" title="Sub-pages">${count ?? (loading ? "…" : "–")}${count ? " ›" : ""}</span>`;
    const desc = subpage.desc || state.nodes.get(subpage.url)?.summary || "";

    const item = document.createElement("li");
    item.innerHTML = `
      <div class="subpage">
        <span class="oe-symbol oe-symbol--sm">${escapeHtml(symbolFor(subpage.title))}</span>
        <button class="subpage__main" type="button">
          <span class="subpage__title">${escapeHtml(subpage.title)}</span>
          ${desc ? `<span class="subpage__desc">${escapeHtml(desc)}</span>` : ""}
        </button>
        <div class="subpage__meta">
          <div class="subpage-menu">
            <button type="button" aria-label="More actions for ${escapeHtml(subpage.title)}" aria-expanded="false">⋮</button>
            <ul class="subpage-menu__list" hidden>
              <li><button type="button" data-action="open">${subpage.kind === "web" ? "Open in the viewer" : "Open"}</button></li>
              ${isLocal(subpage.url) ? "" : `<li><a href="${escapeHtml(subpage.url)}" target="_blank" rel="noopener">Open in a new tab</a></li>`}
              <li><button type="button" data-action="copy">Copy the URL</button></li>
            </ul>
          </div>
          ${meta}
        </div>
      </div>`;

    item.querySelector(".subpage__main").addEventListener("click", () => follow(subpage));
    const toggle = item.querySelector(".subpage-menu > button");
    const menu = item.querySelector(".subpage-menu__list");
    toggle.addEventListener("click", (event) => {
      event.stopPropagation();
      const open = menu.hidden;
      closeMenus();
      menu.hidden = !open;
      toggle.setAttribute("aria-expanded", String(open));
    });
    menu.querySelector('[data-action="open"]').addEventListener("click", () => follow(subpage));
    menu.querySelector('[data-action="copy"]').addEventListener("click", async () => {
      closeMenus();
      try {
        await navigator.clipboard.writeText(subpage.url);
        toast("URL copied to the clipboard.", "success");
      } catch {
        toast("The clipboard is not available.", "warning");
      }
    });
    return item;
  }));
}

function closeMenus() {
  document.querySelectorAll(".subpage-menu__list").forEach((menu) => { menu.hidden = true; });
  document.querySelectorAll(".subpage-menu > button").forEach((b) => b.setAttribute("aria-expanded", "false"));
}

// ---- Tree view ---------------------------------------------------------------

function setTreeView(on) {
  el.explorer.classList.toggle("is-tree", on);
  el.treePanel.hidden = !on;
  el.toggleView.setAttribute("aria-pressed", String(on));
  el.toggleView.querySelector("span").textContent = on ? "Panels" : "Tree";
  if (on) renderTree();
}

function renderTree() {
  const visited = new Set();
  const branch = (url, path, linkTitle) => {
    const node = state.nodes.get(url);
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.className = `tree-node${node ? "" : " is-unloaded"}`;
    if (url === current()) button.setAttribute("aria-current", "page");
    const title = node?.title ?? linkTitle ?? fileName(url);
    const count = node ? subpagesOf(node).filter((s) => s.kind === "doc").length : null;
    button.innerHTML = `<span class="oe-symbol oe-symbol--sm">${escapeHtml(symbolFor(title))}</span>
      <span>${escapeHtml(title)}${count ? ` <small>· ${count}</small>` : ""}${node ? "" : " <small>· not loaded</small>"}</span>`;
    button.addEventListener("click", () => navigate(url, { path }));
    item.append(button);

    if (node && !visited.has(url)) {
      visited.add(url);
      const children = subpagesOf(node).filter((s) => s.kind === "doc");
      if (children.length) {
        const list = document.createElement("ul");
        list.append(...children.map((c) => branch(c.url, [...path, c.url], c.title)));
        item.append(list);
      }
    }
    return item;
  };
  el.tree.replaceChildren(branch(state.root, [state.root]));
}

// ---- Web viewer ----------------------------------------------------------------

function openWeb(url, title) {
  el.viewerTitle.textContent = title ? `${title} — ${url}` : url;
  el.viewerOpen.href = url;
  el.viewerFrame.src = url;
  el.viewerDialog.showModal();
}

$("viewer-reload").addEventListener("click", () => { el.viewerFrame.src = el.viewerFrame.src; });
$("viewer-close").addEventListener("click", () => el.viewerDialog.close());
el.viewerDialog.addEventListener("close", () => { el.viewerFrame.src = "about:blank"; });

// ---- Source dialog ---------------------------------------------------------------

function showSource() {
  el.sourceCancel.hidden = !state.root;
  el.sourceUrl.value = state.root && state.root !== DEMO_ROOT ? state.root : "";
  el.sourceDialog.showModal();
}

el.sourceForm.addEventListener("submit", (event) => {
  if (event.submitter?.value !== "load") return;
  openRoot(el.sourceUrl.value.trim());
});
el.sourceDialog.addEventListener("cancel", (event) => {
  if (!state.root) event.preventDefault();
});
document.querySelectorAll("[data-example]").forEach((button) =>
  button.addEventListener("click", () => {
    el.sourceDialog.close();
    openRoot(button.dataset.example === "demo" ? DEMO_ROOT : button.dataset.example);
  }));
$("open-source").addEventListener("click", showSource);

// ---- Import dialog ---------------------------------------------------------------

let importTab = "url";
document.querySelectorAll("[data-tab]").forEach((tab) =>
  tab.addEventListener("click", () => {
    importTab = tab.dataset.tab;
    document.querySelectorAll("[data-tab]").forEach((t) => t.setAttribute("aria-selected", String(t === tab)));
    document.querySelectorAll("[data-panel]").forEach((p) => { p.hidden = p.dataset.panel !== importTab; });
  }));

$("open-import").addEventListener("click", () => {
  if (!current()) return toast("Open a hierarchy first.", "warning");
  el.importDialog.showModal();
});

el.importForm.addEventListener("submit", async (event) => {
  if (event.submitter?.value !== "import") return;
  const parent = state.nodes.get(current());
  let url;
  if (importTab === "url") {
    url = el.importUrl.value.trim();
    if (!url) return toast("Enter the URL of a markdown page.", "warning");
  } else {
    const markdown = el.importMarkdown.value.trim();
    if (!markdown) return toast("Paste some markdown first.", "warning");
    const heading = markdown.match(/^#\s+(.+)$/m)?.[1] ?? "Imported page";
    const slug = heading.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "") || "page";
    url = `${IMPORT_ORIGIN}/${slug}-${state.importedTexts.size + 1}.md`;
    state.importedTexts.set(url, markdown);
  }

  try {
    const node = await load(url);
    node.parent ??= parent.url;
    if (!parent.imported.includes(url) && !parent.links.some((l) => l.url === url)) parent.imported.push(url);
    el.importUrl.value = "";
    el.importMarkdown.value = "";
    if (current() === parent.url) renderSubpages(parent);
    toast(`"${node.title}" added to ${parent.title}.`, "success", "Imported");
  } catch (error) {
    toast(`${error.message}`, "danger", "Import failed");
  }
});

// ---- Header actions and events -------------------------------------------------

el.back.addEventListener("click", goBack);
el.filter.addEventListener("input", () => renderSubpages(state.nodes.get(current())));
el.toggleView.addEventListener("click", () => setTreeView(el.treePanel.hidden));
document.addEventListener("click", closeMenus);

$("toggle-theme").addEventListener("click", () => {
  const root = document.documentElement;
  const dark = root.dataset.theme
    ? root.dataset.theme === "dark"
    : matchMedia("(prefers-color-scheme: dark)").matches;
  root.dataset.theme = dark ? "light" : "dark";
});

// Links inside the rendered markdown.
el.content.addEventListener("click", (event) => {
  const a = event.target.closest("a[data-kind]");
  if (!a || event.metaKey || event.ctrlKey || event.shiftKey) return;
  event.preventDefault();
  follow({ url: a.href, title: a.textContent.trim(), kind: a.dataset.kind });
});

// ---- Start -----------------------------------------------------------------------

const params = new URLSearchParams(location.search);
if (params.get("theme")) document.documentElement.dataset.theme = params.get("theme");
const source = params.get("src");
if (source) openRoot(source === "demo" ? DEMO_ROOT : source);
else showSource();
