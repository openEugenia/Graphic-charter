# Posters and videos (Remotion)

Event posters and short videos in the openEugenia charter, rendered with
[Remotion](https://www.remotion.dev). The layout uses the charter's own CSS
(`dist/openeugenia.css`: `oe-hero`, `oe-glass`, `oe-info`, `oe-tagline`,
`oe-display`…) and the logo of `logo/logo.js`, so it follows the brand colour
like the web pages.

This folder is a separate, private package: it is not part of the published
`@openeugenia/graphic-charter`.

## Setup

```sh
npm install            # at the repository root (Sass, to build the charter's CSS)
cd remotion
npm install
```

## Studio

```sh
npm run studio
```

Every field of the poster (texts, key facts, topics, brand colour, photo, logo
variant, wordmark, size and matrix) can be edited in the props panel on the
right, with a live preview.

Edited props are saved back to `src/Root.tsx` with the panel's Save button.
Each format has its own `defaultProps`: the Studio can only save to an object
written inline on the `<Composition>`/`<Still>`.

### Online

The documentation site publishes a read-only build of the Studio at
`studio/` (built by `npm run build:studio` after `npm run build:site`, in the
Pages workflow). Props can be edited and the result rendered with
**Render in browser**, but nothing is saved. Links to a format use a query
string, e.g. `studio/?/PosterSquare`.

## Formats

| Id | Size | Type |
|---|---|---|
| `PosterA4` | 2480×3508 (A4, 300 dpi) | still |
| `PosterStory` | 1080×1920 | still |
| `PosterSquare` | 1080×1080 (no topics) | still |
| `PosterBanner` | 1920×1080 (two columns) | still |
| `VideoStory` | 1080×1920, 12 s | video |
| `VideoSquare` | 1080×1080, 12 s | video |
| `VideoLandscape` | 1920×1080, 12 s | video |
| `BookCover` | 1015×1440 (front cover of the book) | still |
| `BookBackCover` | 1015×1440 (back cover) | still |

The page is laid out at a CSS size whose shortest side is 540px and then scaled
up, so the charter's rem-based sizes keep the same proportions in every format.

The book cover (`src/Cover.tsx`) has its own fields: subtitle, title, photo
with its horizontal focus and darkening, the logo, and `partners`, a list of
white-on-transparent logo files shown in a row at the bottom. Each one is
cropped to its visible pixels, then they share one height, smaller when there
are many.

The back cover (`src/BackCover.tsx`) shares that page: title, key facts next
to a photo (`photoFocus` sets which part of it stays in view vertically), the
abstract (paragraphs separated by an empty line), the same partner logos,
and `isbn`: drawn as an EAN-13 barcode at the bottom right (ISBN-13 or
ISBN-10, hyphens allowed; an invalid check digit shows an error instead).

## Rendering

```sh
npm run still -- PosterA4 out/poster-a4.png
npm run render -- VideoStory out/story.mp4
```

With your own content, as a JSON file following `src/schema.ts` (every field is required):

```sh
npm run render -- VideoStory out/story.mp4 --props=my-event.json
```

`image` is a URL or a file of `docs/` (the public folder), e.g. `hero-sample.svg`.
`brand` must reach a 4.5:1 contrast with white text, as everywhere in the charter.

## Animation

In the videos the elements enter one after the other (logo, head, tagline,
title word by word, divider, key facts, topics), the photo slowly zooms in, the
logo's frame glow moves like `<oe-logo animated>`, and the last 0.6 s fades to
the logo background so the video loops. Timings are in `T` in `src/Poster.tsx`.
