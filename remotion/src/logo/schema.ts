// Content of the logo exports: the same options as a poster's logo, without
// the layout size since the logo fills the output.

import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { logoSchema } from "../schema";

export const logoExportSchema = z.object({
  // "#rrggbb" (white text on it must reach 4.5:1).
  brand: zColor(),
  // Behind the logo; fully transparent by default.
  background: zColor(),
  logo: logoSchema.omit({ size: true }),
});

export type LogoExportProps = z.infer<typeof logoExportSchema>;
