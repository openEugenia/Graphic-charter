// Front cover of the book: the charter's logo with a subtitle at the top, the
// title between two rules in the middle, partner logos in a row at the bottom,
// over a darkened photo. CoverPage holds what the back cover shares.
//
// Laid out at a width of 1015px (the reference cover) and scaled to the output
// size, like the posters.

import { loadFont } from "@remotion/google-fonts/Inter";
import { useEffect, useState, type ReactNode } from "react";
import { AbsoluteFill, continueRender, delayRender, Img, staticFile, useVideoConfig } from "remotion";
import "../../dist/openeugenia.css";
import "./poster.css";
import "./cover.css";
import { Logo } from "./Logo";
import type { CoverProps } from "./schema";

loadFont("normal", { weights: ["300", "400", "700", "800"], subsets: ["latin"] });

const BASE = 1015;

export const resolve = (src: string) => (/^(https?:|data:)/.test(src) ? src : staticFile(src));

export function Cover(p: CoverProps) {
  return (
    <CoverPage {...p}>
      <p className="cover-edition">{p.edition}</p>
      <div className="cover-head">
        <Logo options={p.logo} />
        <p className="cover-intro">{p.intro}</p>
      </div>

      <div className="cover-title">
        <p className="cover-eyebrow">{p.eyebrow}</p>
        <h1>{p.title}</h1>
      </div>
    </CoverPage>
  );
}

/** Page shared by the front and back covers: darkened photo, partner logos at the bottom. */
export function CoverPage({ brand, image, imageFocus, overlay, blur = 0, partners, corner, children }: {
  brand: string;
  image: string;
  imageFocus: number;
  overlay: number;
  blur?: number;
  partners: string[];
  // Bottom-right content (e.g. a barcode); the partner row narrows to stay clear of it.
  corner?: ReactNode;
  children: ReactNode;
}) {
  const { width, height } = useVideoConfig();
  const scale = width / BASE;

  return (
    <AbsoluteFill style={{ backgroundColor: "#11161d" }}>
      <section
        className="cover"
        data-brand=""
        style={{
          ["--oe-brand" as string]: brand,
          ["--cover-overlay" as string]: overlay,
          width: BASE,
          height: height / scale,
          // As a string: React would add "px" to a number.
          scale: String(scale),
        }}
      >
        {image && (
          <Img
            className="cover-image"
            src={resolve(image)}
            // Blurred edges would let the background show through: zoom in a little.
            style={{ objectPosition: `${imageFocus}% 50%`, filter: blur ? `blur(${blur}px)` : undefined, scale: blur ? "1.04" : undefined }}
          />
        )}
        <div className="cover-overlay" />
        {children}
        {partners.length > 0 && <Partners sources={partners} width={corner ? BASE - 2 * CORNER_SPACE : ROW_WIDTH} />}
        {corner && <div className="cover-corner" style={{ width: CORNER_WIDTH }}>{corner}</div>}
      </section>
    </AbsoluteFill>
  );
}

// Partner logos: each one is cropped to its visible pixels (logo files often
// have wide transparent margins), then they share one height, reduced when the
// row would be wider than ROW_WIDTH.
const ROW_WIDTH = 760;
// Bottom-right slot: its width, and the space it takes from each side of the
// row (margin, slot, gap) so the row stays centred.
export const CORNER_WIDTH = 190;
const CORNER_SPACE = 45 + CORNER_WIDTH + 30;
const ROW_HEIGHT = 88;
const ROW_GAP = 56;

function Partners({ sources, width }: { sources: string[]; width: number }) {
  const boxes = useVisibleBoxes(sources.map(resolve));
  if (!boxes) return null;
  const totalAspect = boxes.reduce((sum, box) => sum + box.aspect, 0);
  const h = Math.min(ROW_HEIGHT, (width - ROW_GAP * (boxes.length - 1)) / totalAspect);

  return (
    <div className="cover-partners" style={{ gap: ROW_GAP }}>
      {boxes.map((box, i) => (
        <div key={i} className="cover-partner" style={{ width: h * box.aspect, height: h }}>
          <Img
            src={box.src}
            style={{
              width: `${100 / box.w}%`,
              height: `${100 / box.h}%`,
              left: `${(-100 * box.x) / box.w}%`,
              top: `${(-100 * box.y) / box.h}%`,
            }}
          />
        </div>
      ))}
    </div>
  );
}

/** Visible area of an image (fractions of its size) and its aspect ratio. */
type Box = { src: string; x: number; y: number; w: number; h: number; aspect: number };

function useVisibleBoxes(sources: string[]): Box[] | null {
  const [boxes, setBoxes] = useState<Box[] | null>(null);
  const [handle] = useState(() => delayRender("Measuring the partner logos"));
  const key = sources.join("\n");

  useEffect(() => {
    let cancelled = false;
    Promise.all(sources.map(visibleBox)).then((result) => {
      if (cancelled) return;
      setBoxes(result);
      continueRender(handle);
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return boxes;
}

const SAMPLE = 512;

function visibleBox(src: string): Promise<Box> {
  return new Promise((done) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onerror = () => done({ src, x: 0, y: 0, w: 1, h: 1, aspect: 1 });
    img.onload = () => {
      const full = { src, x: 0, y: 0, w: 1, h: 1, aspect: img.naturalWidth / img.naturalHeight };
      try {
        // Alpha channel on a reduced copy: precise enough for a bounding box.
        const ratio = Math.min(1, SAMPLE / Math.max(img.naturalWidth, img.naturalHeight));
        const cw = Math.max(1, Math.round(img.naturalWidth * ratio));
        const ch = Math.max(1, Math.round(img.naturalHeight * ratio));
        const ctx = Object.assign(document.createElement("canvas"), { width: cw, height: ch }).getContext("2d")!;
        ctx.drawImage(img, 0, 0, cw, ch);
        const alpha = ctx.getImageData(0, 0, cw, ch).data;
        let x0 = cw, y0 = ch, x1 = -1, y1 = -1;
        for (let y = 0; y < ch; y++) {
          for (let x = 0; x < cw; x++) {
            if (alpha[(y * cw + x) * 4 + 3] > 8) {
              if (x < x0) x0 = x;
              if (x > x1) x1 = x;
              if (y < y0) y0 = y;
              if (y > y1) y1 = y;
            }
          }
        }
        if (x1 < 0) return done(full);
        const box = { x: x0 / cw, y: y0 / ch, w: (x1 + 1 - x0) / cw, h: (y1 + 1 - y0) / ch };
        done({ src, ...box, aspect: (box.w * img.naturalWidth) / (box.h * img.naturalHeight) });
      } catch {
        // A cross-origin image without CORS cannot be read: keep it whole.
        done(full);
      }
    };
    img.src = src;
  });
}
