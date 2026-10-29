// Formats available in the Studio and on the command line
// (`npx remotion still <id>`, `npx remotion render <id>`).
//
// Everything stays inline on each registration, defaultProps included: the
// Studio can only save edited props back to an object literal written on the
// <Composition>/<Still> itself. Each format therefore keeps its own content.

import { Composition, Folder, Still } from "remotion";
import { Poster } from "./Poster";
import { posterSchema, type PosterProps } from "./schema";

const PosterVideo = (props: PosterProps) => <Poster {...props} animated />;

export function Root() {
  return (
    <>
      <Folder name="Posters">
        {/* 300 dpi, print */}
        <Still
          id="PosterA4"
          component={Poster}
          width={2480}
          height={3508}
          schema={posterSchema}
          defaultProps={{
            brand: "#2563eb",
            edition: "2026 edition · April to July",
            intro: "Conference cycle of the openEugenia ecosystem",
            tagline: "Imagine and describe more human and responsible uses of contemporary technologies",
            eyebrow: "Conference III",
            title: "Creating and thinking in the technological age",
            infos: [
              { icon: "calendar", label: "Date", value: "June 30, 2026 at 7:45 PM" },
              { icon: "drink", label: "Snacks and drinks", value: "To deepen the discussion" },
              { icon: "location", label: "Location", value: "Venue name, Paris" },
            ],
            topicsLabel: "Conference topics",
            topics: [
              { title: "Access to knowledge in the age of artificial intelligence", speaker: "Speaker name, role" },
              { title: "Artificial intelligence and the environment", speaker: "Speaker name, role" },
              { title: "Building near a moving coastline", speaker: "Speaker name, role" },
            ],
            image: "hero-sample.svg",
            logo: { vector: true, vignette: true, tint: true },
          }}
        />
        <Still
          id="PosterStory"
          component={Poster}
          width={1080}
          height={1920}
          schema={posterSchema}
          defaultProps={{
            brand: "#2563eb",
            edition: "2026 edition · April to July",
            intro: "Conference cycle of the openEugenia ecosystem",
            tagline: "Imagine and describe more human and responsible uses of contemporary technologies",
            eyebrow: "Conference III",
            title: "Creating and thinking in the technological age",
            infos: [
              { icon: "calendar", label: "Date", value: "June 30, 2026 at 7:45 PM" },
              { icon: "drink", label: "Snacks and drinks", value: "To deepen the discussion" },
              { icon: "location", label: "Location", value: "Venue name, Paris" },
            ],
            topicsLabel: "Conference topics",
            topics: [
              { title: "Access to knowledge in the age of artificial intelligence", speaker: "Speaker name, role" },
              { title: "Artificial intelligence and the environment", speaker: "Speaker name, role" },
              { title: "Building near a moving coastline", speaker: "Speaker name, role" },
            ],
            image: "hero-sample.svg",
            logo: { vector: true, vignette: true, tint: true },
          }}
        />
        <Still
          id="PosterSquare"
          component={Poster}
          width={1080}
          height={1080}
          schema={posterSchema}
          defaultProps={{
            brand: "#2563eb",
            edition: "2026 edition · April to July",
            intro: "Conference cycle of the openEugenia ecosystem",
            tagline: "Imagine and describe more human and responsible uses of contemporary technologies",
            eyebrow: "Conference III",
            title: "Creating and thinking in the technological age",
            infos: [
              { icon: "calendar", label: "Date", value: "June 30, 2026 at 7:45 PM" },
              { icon: "drink", label: "Snacks and drinks", value: "To deepen the discussion" },
              { icon: "location", label: "Location", value: "Venue name, Paris" },
            ],
            topicsLabel: "Conference topics",
            topics: [
              { title: "Access to knowledge in the age of artificial intelligence", speaker: "Speaker name, role" },
              { title: "Artificial intelligence and the environment", speaker: "Speaker name, role" },
              { title: "Building near a moving coastline", speaker: "Speaker name, role" },
            ],
            image: "hero-sample.svg",
            logo: { vector: true, vignette: true, tint: true },
          }}
        />
        <Still
          id="PosterBanner"
          component={Poster}
          width={1920}
          height={1080}
          schema={posterSchema}
          defaultProps={{
            brand: "#2563eb",
            edition: "2026 edition · April to July",
            intro: "Conference cycle of the openEugenia ecosystem",
            tagline: "Imagine and describe more human and responsible uses of contemporary technologies",
            eyebrow: "Conference III",
            title: "Creating and thinking in the technological age",
            infos: [
              { icon: "calendar", label: "Date", value: "June 30, 2026 at 7:45 PM" },
              { icon: "drink", label: "Snacks and drinks", value: "To deepen the discussion" },
              { icon: "location", label: "Location", value: "Venue name, Paris" },
            ],
            topicsLabel: "Conference topics",
            topics: [
              { title: "Access to knowledge in the age of artificial intelligence", speaker: "Speaker name, role" },
              { title: "Artificial intelligence and the environment", speaker: "Speaker name, role" },
              { title: "Building near a moving coastline", speaker: "Speaker name, role" },
            ],
            image: "hero-sample.svg",
            logo: { vector: true, vignette: true, tint: true },
          }}
        />
      </Folder>
      <Folder name="Videos">
        <Composition
          id="VideoStory"
          component={PosterVideo}
          width={1080}
          height={1920}
          fps={30}
          durationInFrames={360}
          schema={posterSchema}
          defaultProps={{
            brand: "#2563eb",
            edition: "2026 edition · April to July",
            intro: "Conference cycle of the openEugenia ecosystem",
            tagline: "Imagine and describe more human and responsible uses of contemporary technologies",
            eyebrow: "Conference III",
            title: "Creating and thinking in the technological age",
            infos: [
              { icon: "calendar", label: "Date", value: "June 30, 2026 at 7:45 PM" },
              { icon: "drink", label: "Snacks and drinks", value: "To deepen the discussion" },
              { icon: "location", label: "Location", value: "Venue name, Paris" },
            ],
            topicsLabel: "Conference topics",
            topics: [
              { title: "Access to knowledge in the age of artificial intelligence", speaker: "Speaker name, role" },
              { title: "Artificial intelligence and the environment", speaker: "Speaker name, role" },
              { title: "Building near a moving coastline", speaker: "Speaker name, role" },
            ],
            image: "hero-sample.svg",
            logo: { vector: true, vignette: true, tint: true },
          }}
        />
        <Composition
          id="VideoSquare"
          component={PosterVideo}
          width={1080}
          height={1080}
          fps={30}
          durationInFrames={360}
          schema={posterSchema}
          defaultProps={{
            brand: "#2563eb",
            edition: "2026 edition · April to July",
            intro: "Conference cycle of the openEugenia ecosystem",
            tagline: "Imagine and describe more human and responsible uses of contemporary technologies",
            eyebrow: "Conference III",
            title: "Creating and thinking in the technological age",
            infos: [
              { icon: "calendar", label: "Date", value: "June 30, 2026 at 7:45 PM" },
              { icon: "drink", label: "Snacks and drinks", value: "To deepen the discussion" },
              { icon: "location", label: "Location", value: "Venue name, Paris" },
            ],
            topicsLabel: "Conference topics",
            topics: [
              { title: "Access to knowledge in the age of artificial intelligence", speaker: "Speaker name, role" },
              { title: "Artificial intelligence and the environment", speaker: "Speaker name, role" },
              { title: "Building near a moving coastline", speaker: "Speaker name, role" },
            ],
            image: "hero-sample.svg",
            logo: { vector: true, vignette: true, tint: true },
          }}
        />
        <Composition
          id="VideoLandscape"
          component={PosterVideo}
          width={1920}
          height={1080}
          fps={30}
          durationInFrames={360}
          schema={posterSchema}
          defaultProps={{
            brand: "#2563eb",
            edition: "2026 edition · April to July",
            intro: "Conference cycle of the openEugenia ecosystem",
            tagline: "Imagine and describe more human and responsible uses of contemporary technologies",
            eyebrow: "Conference III",
            title: "Creating and thinking in the technological age",
            infos: [
              { icon: "calendar", label: "Date", value: "June 30, 2026 at 7:45 PM" },
              { icon: "drink", label: "Snacks and drinks", value: "To deepen the discussion" },
              { icon: "location", label: "Location", value: "Venue name, Paris" },
            ],
            topicsLabel: "Conference topics",
            topics: [
              { title: "Access to knowledge in the age of artificial intelligence", speaker: "Speaker name, role" },
              { title: "Artificial intelligence and the environment", speaker: "Speaker name, role" },
              { title: "Building near a moving coastline", speaker: "Speaker name, role" },
            ],
            image: "hero-sample.svg",
            logo: { vector: true, vignette: true, tint: true },
          }}
        />
      </Folder>
    </>
  );
}
