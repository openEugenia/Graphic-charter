// The logo alone, filling the output, for the "Logo" compositions.

import { AbsoluteFill, type CalculateMetadataFunction } from "remotion";
import { logoSvg } from "../../../logo/logo.js";
import "../../../dist/openeugenia.css";
import { AnimationProvider } from "../Reveal";
import { Logo } from "./Logo";
import type { LogoExportProps } from "./schema";

export function LogoExport({ brand, background, logo, animated = false }: LogoExportProps & { animated?: boolean }) {
  return (
    <AnimationProvider animated={animated}>
      <AbsoluteFill
        className="logo-export"
        data-brand=""
        style={{ ["--oe-brand" as string]: brand, backgroundColor: background }}
      >
        <Logo options={logo} />
      </AbsoluteFill>
    </AnimationProvider>
  );
}

export const LogoLoop = (props: LogoExportProps) => <LogoExport {...props} animated />;

// Keeps the alpha channel when rendering, from the Studio as well as the CLI.
export const transparentVideo: CalculateMetadataFunction<LogoExportProps> = () => ({
  defaultCodec: "vp9",
  defaultVideoImageFormat: "png",
  defaultPixelFormat: "yuva420p",
});

// The lockup's proportions depend on its label: the output follows its drawing.
export const lockupSize: CalculateMetadataFunction<LogoExportProps> = ({ props }) => {
  const [, , width, height] = logoSvg({ ...props.logo, vector: undefined }).match(/viewBox="([^"]+)"/)![1].split(" ").map(Number);
  return { width, height };
};
