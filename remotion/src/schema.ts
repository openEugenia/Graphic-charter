// Content of an event poster. Every field is editable in the Studio's props
// panel, or given on the command line with `--props=event.json`.

import { zColor, zTextarea } from "@remotion/zod-types";
import { z } from "zod";
import sample from "../../docs/sample-vector.json";

export const ICONS = ["calendar", "drink", "location", "ticket", "people", "link"] as const;

// The charter's logo (logo/logo.js), shared by every composition.
export const logoSchema = z.object({
  // "mark": frame and initials; "full": with the wordmark under it.
  variant: z.enum(["mark", "full"]),
  // Letters in the frame; empty for the drawn Œ ligature.
  initials: z.string().max(3),
  // Small text after the initials, at the top (e.g. "26").
  exponent: z.string().max(4),
  // Wordmark of the "full" variant.
  label: z.string(),
  // Width in px of the layout (scaled with the format).
  size: z.number().min(48).max(320).step(4),
  // Semantic matrix drawn behind the initials (sample vector of the docs).
  vector: z.boolean(),
  vignette: z.boolean(),
  tint: z.boolean(),
});

export type LogoOptions = z.infer<typeof logoSchema>;

export const posterSchema = z.object({
  // Brand colour of the project (white text on it must reach 4.5:1).
  brand: zColor(),
  edition: z.string(),
  intro: z.string(),
  tagline: zTextarea(),
  eyebrow: z.string(),
  title: zTextarea(),
  infos: z.array(z.object({
    icon: z.enum(ICONS),
    label: z.string(),
    value: z.string(),
  })).max(4),
  topicsLabel: z.string(),
  topics: z.array(z.object({
    title: z.string(),
    speaker: z.string(),
  })).max(5),
  // Background photo: a URL, or a file of docs/ (the public dir) such as "hero-sample.svg".
  image: z.string(),
  logo: logoSchema,
});

export type PosterProps = z.infer<typeof posterSchema>;

// Book cover: logo and subtitle at the top, title between two rules, partner
// logos in a row at the bottom.
export const coverSchema = z.object({
  brand: zColor(),
  edition: z.string(),
  intro: zTextarea(),
  eyebrow: z.string(),
  title: zTextarea(),
  // Background photo (URL or file of docs/), and the part of it that stays in
  // view horizontally: 0 = left edge, 100 = right edge.
  image: z.string(),
  imageFocus: z.number().min(0).max(100).step(1),
  // Darkness of the overlay that keeps the text readable.
  overlay: z.number().min(0).max(1).step(0.05),
  logo: logoSchema,
  // Partner logos (white on transparent), shown at the same height in a row.
  partners: z.array(z.string()).max(6),
});

export type CoverProps = z.infer<typeof coverSchema>;

// Back cover: title over a rule, key facts next to a photo, the abstract, and
// the same partner logos as the front.
export const backCoverSchema = z.object({
  brand: zColor(),
  title: zTextarea(),
  infos: z.array(z.object({
    icon: z.enum([...ICONS, "topics"]),
    label: z.string(),
    value: zTextarea(),
  })).max(4),
  // Photo next to the key facts (URL or file of docs/).
  photo: z.string(),
  // Part of the photo that stays in view vertically: 0 = top, 100 = bottom.
  photoFocus: z.number().min(0).max(100).step(1),
  abstractLabel: z.string(),
  // Paragraphs separated by an empty line.
  abstract: zTextarea(),
  image: z.string(),
  imageFocus: z.number().min(0).max(100).step(1),
  overlay: z.number().min(0).max(1).step(0.05),
  // Blur of the background photo, in px, so it stays behind the text.
  blur: z.number().min(0).max(20).step(1),
  partners: z.array(z.string()).max(6),
  // ISBN-13 (or ISBN-10), hyphens allowed: drawn as an EAN-13 barcode at the
  // bottom right. Empty to leave it out.
  isbn: z.string(),
  // Bars and text, and the box behind them. Scanners need dark bars on a
  // light, plain background.
  barcodeColor: zColor(),
  barcodeBackground: zColor(),
});

export type BackCoverProps = z.infer<typeof backCoverSchema>;

export const sampleVector: number[] = sample.vector;
