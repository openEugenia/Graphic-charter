// Event poster with the charter's editorial modules (oe-hero, oe-glass,
// oe-info, oe-tagline, oe-display…), as on docs/poster.html.
//
// The page is laid out at a "CSS size" whose shortest side is 540px, then
// scaled to the output size: the charter's rem-based tokens keep the same
// proportions from a 1080px story to a 300 dpi A4.

import { loadFont } from "@remotion/google-fonts/Inter";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import "../../dist/openeugenia.css";
import "./poster.css";
import { Icon } from "./icons";
import { Logo } from "./Logo";
import { AnimationProvider, Reveal, useEntrance } from "./Reveal";
import type { PosterProps } from "./schema";

loadFont("normal", { weights: ["400", "500", "600", "700", "800"], subsets: ["latin"] });

const BASE = 540;

type Layout = "portrait" | "square" | "landscape";

function layoutOf(width: number, height: number): Layout {
  if (height / width >= 1.25) return "portrait";
  if (width / height >= 1.25) return "landscape";
  return "square";
}

export function Poster(props: PosterProps & { animated?: boolean }) {
  const { width, height } = useVideoConfig();
  const scale = Math.min(width, height) / BASE;
  const layout = layoutOf(width, height);

  return (
    <AnimationProvider animated={props.animated ?? false}>
      <AbsoluteFill style={{ backgroundColor: "#11161d" }}>
        <section
          className={`oe-hero poster poster--${layout}`}
          data-brand=""
          style={{
            ["--oe-brand" as string]: props.brand,
            width: width / scale,
            height: height / scale,
            // As a string: React would add "px" to a number.
            scale: String(scale),
          }}
        >
          {props.image && <Background src={props.image} />}
          <Content {...props} layout={layout} />
          <FadeOut />
        </section>
      </AbsoluteFill>
    </AnimationProvider>
  );
}

// Delays of the entrances, in seconds.
const T = { logo: 0.2, head: 0.6, tagline: 1.2, eyebrow: 2, title: 2.3, divider: 3.1, infos: 3.5, topics: 4.6 };

function Content({ layout, ...p }: PosterProps & { layout: Layout }) {
  const { fps } = useVideoConfig();
  const at = (seconds: number) => Math.round(seconds * fps);

  const head = (
    <div className="poster-head">
      <Reveal delay={at(T.logo)} distance={0}>
        <Logo options={p.logo} />
      </Reveal>
      <Reveal delay={at(T.head)} className="oe-stack" style={{ gap: "var(--oe-space-2)" }}>
        <span className="oe-eyebrow" style={{ color: "var(--oe-color-text)" }}>{p.edition}</span>
        <p className="poster-intro">{p.intro}</p>
      </Reveal>
    </div>
  );

  const tagline = (
    <Reveal delay={at(T.tagline)}>
      <p className="oe-tagline">{p.tagline}</p>
    </Reveal>
  );

  const title = (
    <div className="poster-title">
      <Reveal delay={at(T.eyebrow)}>
        <span className="oe-eyebrow" style={{ color: "var(--oe-color-text)" }}>{p.eyebrow}</span>
      </Reveal>
      <h2 className="oe-display">
        {p.title.split(/\s+/).map((word, i) => (
          <Word key={i} delay={at(T.title + i * 0.08)}>{word}</Word>
        ))}
      </h2>
      <Divider delay={at(T.divider)} />
    </div>
  );

  const infos = (
    <div className="poster-infos">
      {p.infos.map((info, i) => (
        <Reveal key={i} delay={at(T.infos + i * 0.25)} className="oe-info oe-glass">
          <span className="oe-info__label"><Icon name={info.icon} />{info.label}</span>
          <span className="oe-info__value">{info.value}</span>
        </Reveal>
      ))}
    </div>
  );

  const topics = p.topics.length > 0 && (
    <Reveal delay={at(T.topics)} className="oe-card oe-card--glass">
      <span className="oe-info__label"><Icon name="topics" />{p.topicsLabel}</span>
      <ul className="poster-topics">
        {p.topics.map((topic, i) => (
          <Reveal key={i} as="li" delay={at(T.topics + 0.4 + i * 0.3)} distance={8}>
            <strong>{topic.title}</strong><em>~ {topic.speaker}</em>
          </Reveal>
        ))}
      </ul>
    </Reveal>
  );

  if (layout === "landscape") {
    return (
      <div className="poster-content">
        <div className="oe-stack poster-column">{head}{title}{tagline}</div>
        <div className="oe-stack poster-column">{infos}{topics}</div>
      </div>
    );
  }
  // A square has no room for the topics.
  return <div className="poster-content oe-stack">{head}{tagline}{title}{infos}{layout === "portrait" && topics}</div>;
}

function Word({ delay, children }: { delay: number; children: string }) {
  const p = useEntrance(delay);
  return (
    <>
      <span style={{ display: "inline-block", opacity: p, translate: `0 ${(1 - p) * 0.4}em` }}>{children}</span>{" "}
    </>
  );
}

function Divider({ delay }: { delay: number }) {
  const p = useEntrance(delay);
  return <hr className="oe-divider" style={{ scale: `${p} 1` }} />;
}

// Photo, slowly zooming in a video.
function Background({ src }: { src: string }) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const zoom = durationInFrames > 1 ? interpolate(frame, [0, durationInFrames], [1, 1.08], { output: "perceptual-scale" }) : 1;
  return <Img className="oe-hero__image" src={/^(https?:|data:)/.test(src) ? src : staticFile(src)} style={{ scale: String(zoom) }} />;
}

// Short fade to the logo background at the end of a video, so it loops cleanly.
function FadeOut() {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  if (durationInFrames <= 1) return null;
  const opacity = interpolate(frame, [durationInFrames - fps * 0.6, durationInFrames - 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <div className="poster-fade" style={{ opacity }} />;
}
