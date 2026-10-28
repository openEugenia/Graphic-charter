# Graphic-charter

Charte graphique commune à tout l'écosystème openEugenia : conférences, projets et outils.

Elle est décrite en SCSS et distribuée sous deux formes :

- **CSS prêt à l'emploi** (`dist/`) : variables CSS `--oe-*`, styles de base et composants `oe-*`. Aucun outil requis.
- **API Sass** (`scss/`) : tokens, fonctions et mixins pour les projets qui écrivent leur propre SCSS.

- **Logo** (`logo/`) : composant `<oe-logo>` qui prend la couleur de marque de la page, et fichiers SVG statiques.

Le style reprend l'univers du logo : fond marine `#11161d`, cadre en dégradé, capitales très espacées,
titres gras. **Chaque projet de l'écosystème ne choisit qu'une couleur : sa couleur de marque**
(bleu `#2563eb` pour openEugenia). Toutes les teintes dérivées en découlent automatiquement.

## Couleur de marque

```css
/* Dans le CSS du projet, après la charte : */
:root { --oe-brand: #0f766e; }
```

ou un préréglage : `<html data-brand="mint">` (`openeugenia`, `mint`, `violet`, `rose`).
Une section peut aussi porter sa propre marque : `<section data-brand="violet">`, ou
`<section data-brand style="--oe-brand: #0f766e">` (l'attribut `data-brand` est nécessaire
pour que les teintes dérivées soient recalculées sur la section).

La couleur doit offrir un contraste d'au moins 4.5:1 avec du texte blanc (WCAG AA). En Sass,
`@include oe.brand(#0f766e)` émet la variable et avertit à la compilation si ce n'est pas le cas.

## Logo

```html
<script type="module" src="https://cdn.jsdelivr.net/gh/hwattez/Graphic-charter@main/logo/oe-logo.js"></script>

<oe-logo></oe-logo>                                    <!-- logo complet, largeur 160px par défaut -->
<oe-logo variant="mark" style="width: 48px"></oe-logo> <!-- cadre + Œ, sans texte -->
<oe-logo variant="glyph"></oe-logo>                    <!-- Œ seul, couleur du texte (currentColor) -->
<oe-logo variant="horizontal"></oe-logo>              <!-- pictogramme + nom, pour les en-têtes -->
<oe-logo label="OE-CONF 2026"></oe-logo>              <!-- texte personnalisé -->
<oe-logo color="#7c3aed"></oe-logo>                   <!-- couleur explicite -->
```

Sans attribut `color`, le cadre suit `--oe-brand` de la page. Pour les usages hors web (slides,
documents, favicon), des SVG statiques sont générés pour chaque préréglage :
`dist/logo/<marque>/openeugenia-{full,mark}.svg` et `dist/logo/openeugenia-glyph.svg`.
La géométrie du logo est définie une seule fois dans [`logo/logo.js`](logo/logo.js).

> Le texte du logo utilise la police Inter si elle est disponible (Helvetica/Arial sinon).

## Utilisation

### 1. Simple balise `<link>` (n'importe quel projet)

```html
<!-- Tout : variables + base + composants -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/hwattez/Graphic-charter@main/dist/openeugenia.min.css">

<!-- Ou seulement les variables CSS, sans aucun style appliqué -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/hwattez/Graphic-charter@main/dist/openeugenia-tokens.css">
```

Remplacer `@main` par un tag (`@v0.1.0`) pour figer la version.

### 2. Via npm

```sh
npm install @openeugenia/graphic-charter
# ou directement depuis GitHub :
npm install github:hwattez/Graphic-charter
```

```js
import "@openeugenia/graphic-charter/css";          // bundle complet
import "@openeugenia/graphic-charter/css/tokens";   // variables uniquement
import "@openeugenia/graphic-charter/logo";         // composant <oe-logo>
```

### 3. Depuis du SCSS

```scss
@use "sass:map";
@use "pkg:@openeugenia/graphic-charter" as oe;   // Dart Sass ≥ 1.71 avec --pkg-importer=node

.ma-banniere {
  color: var(--oe-color-primary);
  border-color: oe.palette(neutral, 300);
  padding: map.get(oe.$spacing, 5);

  @include oe.up(md) { padding: map.get(oe.$spacing, 7); }
  &:focus-visible { @include oe.focus-ring; }
}

// Pour inclure aussi les styles de la charte dans votre bundle :
@use "pkg:@openeugenia/graphic-charter/scss/openeugenia";
```

Dans du code applicatif, préférez les variables CSS (`var(--oe-color-primary)`) aux valeurs Sass :
elles suivent automatiquement le thème clair/sombre.

## Tokens

| Famille      | Variables CSS                                   | Sass                                   |
|--------------|-------------------------------------------------|----------------------------------------|
| Marque       | `--oe-brand`, `--oe-brand-glow`                 | `$brands`, `brand-color()`, `@include brand()` |
| Couleurs     | `--oe-color-{bg,surface,text,primary,…}`        | `palette(neutral, $nuance)`, `$status` |
| Typographie  | `--oe-font-{sans,heading,mono}`, `--oe-font-size-{xs…4xl}`, `--oe-font-weight-*`, `--oe-line-height-*`, `--oe-letter-spacing-wide` | `$font-sizes`, `$font-weights`… |
| Espacements  | `--oe-space-{0…9}` (grille de 4px)             | `$spacing`                             |
| Formes       | `--oe-radius-{none,sm,md,lg,full}`, `--oe-shadow-{sm,md,lg}`, `--oe-border-width` | `$radius`, `$shadows` |
| Animations   | `--oe-duration-{fast,normal,slow}`, `--oe-easing` | `$durations`                         |
| Points de rupture | — (impossible en CSS natif)                | `$breakpoints`, `@include up(md)`      |

Toutes les couleurs sémantiques sont listées dans [`scss/themes/_colors.scss`](scss/themes/_colors.scss).

## Thème clair / sombre

Le thème suit la préférence du système. Pour le forcer :

```html
<html data-theme="dark">   <!-- ou "light" -->
```

L'attribut fonctionne aussi sur n'importe quel élément pour une section localement inversée.
Les couleurs utilisent `light-dark()` (Chrome 123+, Firefox 120+, Safari 17.5+).

## Composants

Tous les composants sont préfixés `oe-` pour éviter les collisions :
`oe-container`, `oe-button` (`--secondary`, `--ghost`, `--sm`, `--lg`), `oe-card` (`--featured`),
`oe-badge`, `oe-alert`, `oe-field` / `oe-label` / `oe-input` / `oe-select` / `oe-textarea`,
et les utilitaires `oe-stack`, `oe-cluster`, `oe-grid`, `oe-text-muted`, `oe-visually-hidden`.

Éléments repris du logo : `oe-eyebrow` (capitales espacées comme « OPEN-EUGENIA »),
`oe-frame` (cadre en dégradé de la couleur de marque), `oe-hero` (section sombre aux couleurs du logo).

Voir la page de démonstration : [`docs/index.html`](docs/index.html), à servir en HTTP
(`python3 -m http.server` puis `/docs/index.html?theme=light&brand=violet`).

## Développement

```sh
npm install
npm run build    # génère dist/ (CSS + logos SVG)
npm run watch    # recompile à chaque modification
```

```
scss/
├── tokens/          valeurs brutes (couleurs, typo, espacements…) — source de vérité
├── themes/          couleurs sémantiques (paires clair / sombre)
├── _custom-properties.scss   émet les tokens en variables CSS --oe-*
├── base/            reset et typographie des éléments HTML
├── components/      composants .oe-*
├── utilities/       classes utilitaires
├── _index.scss      API Sass publique (n'émet aucun CSS)
├── openeugenia.scss         → dist/openeugenia.css
└── openeugenia-tokens.scss  → dist/openeugenia-tokens.css
logo/
├── logo.js          géométrie du logo (source unique)
└── oe-logo.js       composant <oe-logo>
scripts/build-logos.mjs      → dist/logo/**/*.svg
```

Le dossier `dist/` est versionné pour permettre l'usage via CDN sans étape de build.
Pensez à lancer `npm run build` avant de committer une modification du SCSS ou du logo.
