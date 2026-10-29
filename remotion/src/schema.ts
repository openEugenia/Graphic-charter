// Content of an event poster. Every field is editable in the Studio's props
// panel, or given on the command line with `--props=event.json`.

import { zColor, zTextarea } from "@remotion/zod-types";
import { z } from "zod";
import sample from "../../docs/sample-vector.json";

export const ICONS = ["calendar", "drink", "location", "ticket", "people", "link"] as const;

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
  logo: z.object({
    // Semantic matrix drawn behind the Œ (sample vector of the docs).
    vector: z.boolean(),
    vignette: z.boolean(),
    tint: z.boolean(),
  }),
});

export type PosterProps = z.infer<typeof posterSchema>;

export const sampleVector: number[] = sample.vector;
