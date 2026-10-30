// Formats available in the Studio and on the command line
// (`npx remotion still <id>`, `npx remotion render <id>`).
//
// Everything stays inline on each registration, defaultProps included: the
// Studio can only save edited props back to an object literal written on the
// <Composition>/<Still> itself. Each format therefore keeps its own content.

import { Composition, Folder, Still } from "remotion";
import { BackCover } from "./BackCover";
import { Cover } from "./Cover";
import { LogoExport, LogoLoop, lockupSize, transparentVideo } from "./logo/LogoExport";
import { logoExportSchema } from "./logo/schema";
import { Poster } from "./Poster";
import { backCoverSchema, coverSchema, posterSchema, type PosterProps } from "./schema";

const PosterVideo = (props: PosterProps) => <Poster {...props} animated />;

export function Root() {
  return (
    <>
      <Folder name="Logo">
        {/* Native size of the logo's drawing. See src/logo/README.md for the exports. */}
        <Still
          id="LogoMark"
          component={LogoExport}
          width={1208}
          height={1208}
          schema={logoExportSchema}
          defaultProps={{
            brand: "#2563eb",
            background: "rgba(0, 0, 0, 0)",
            logo: {
              variant: "full" as const,
              initials: "",
              exponent: "",
              label: "OPEN-EUGENIA",
              vector: false,
              vignette: false,
              tint: false,
              background: false,
              frame: false,
              ink: "#ffffff",
              labelWeight: 500,
            },
          }}
        />
        <Still
          id="LogoFull"
          component={LogoExport}
          width={1208}
          height={1208}
          schema={logoExportSchema}
          defaultProps={{
            brand: "#2563eb",
            background: "rgba(0, 0, 0, 0)",
            logo: {
              variant: "full" as const,
              initials: "",
              exponent: "",
              label: "OPEN-EUGENIA",
              vector: true,
              vignette: true,
              tint: true,
              background: true,
              frame: true,
              ink: "#ffffff",
              labelWeight: 500,
            },
          }}
        />
        {/* Its size follows the label. */}
        <Still
          id="LogoLockup"
          component={LogoExport}
          width={2400}
          height={486}
          calculateMetadata={lockupSize}
          schema={logoExportSchema}
          defaultProps={{
            brand: "#2563eb",
            background: "rgba(0, 0, 0, 0)",
            logo: {
              variant: "lockup" as const,
              initials: "",
              exponent: "",
              label: "open Eugenia",
              vector: false,
              vignette: false,
              tint: false,
              background: false,
              frame: true,
              ink: "#ffffff",
              labelWeight: 300,
            },
          }}
        />
        {/* 14 s: one back-and-forth of the frame glow, so it loops. */}
        <Composition
          id="LogoAnimated"
          component={LogoLoop}
          width={1208}
          height={1208}
          fps={30}
          durationInFrames={420}
          calculateMetadata={transparentVideo}
          schema={logoExportSchema}
          defaultProps={{
            brand: "#2563eb",
            background: "rgba(0, 0, 0, 0)",
            logo: {
              variant: "full" as const,
              initials: "",
              exponent: "",
              label: "OPEN-EUGENIA",
              vector: true,
              vignette: true,
              tint: true,
              background: true,
              frame: true,
              ink: "#ffffff",
              labelWeight: 500,
            },
          }}
        />
      </Folder>
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
            logo: {
              variant: "mark",
              initials: "",
              exponent: "",
              label: "OPEN-EUGENIA",
              size: 104,
              vector: true,
              vignette: true,
              tint: true,
              background: true,
              frame: true,
              ink: "#ffffff",
              labelWeight: 500,
            },
          }}
        />
        <Still
          id="PosterStory"
          component={Poster}
          width={1080}
          height={1920}
          schema={posterSchema}
          defaultProps={{
            brand: "#42eb25",
            edition: "2026 edition · April to July",
            intro: "Conference cycle of the openEugenia ecosystem",
            tagline: "Imagine and describe more human and responsible uses of contemporary technologies",
            eyebrow: "Conference III",
            title: "Creating and thinking in the technological age",
            infos: [{
              icon: "calendar" as const,
              label: "Date",
              value: "June 30, 2026 at 7:45 PM",
            }, {
              icon: "drink" as const,
              label: "Snacks",
              value: "To deepen the discussion",
            }, {
              icon: "location" as const,
              label: "Location",
              value: "Venue name, Paris",
            }],
            topicsLabel: "Conference topics",
            topics: [{
              title: "Access to knowledge in the age of artificial intelligence",
              speaker: "Speaker name, role",
            }, {
              title: "Artificial intelligence and the environment",
              speaker: "Speaker name, role",
            }, {
              title: "Building near a moving coastline",
              speaker: "Speaker name, role",
            }],
            image: "hero-sample.svg",
            logo: {
              variant: "full" as const,
              initials: "Cy",
              exponent: "",
              label: "CYTOPIA",
              size: 104,
              vector: true,
              vignette: true,
              tint: true,
              background: true,
              frame: true,
              ink: "#ffffff",
              labelWeight: 500,
            },
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
            logo: {
              variant: "mark",
              initials: "",
              exponent: "",
              label: "OPEN-EUGENIA",
              size: 104,
              vector: true,
              vignette: true,
              tint: true,
              background: true,
              frame: true,
              ink: "#ffffff",
              labelWeight: 500,
            },
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
            logo: {
              variant: "mark",
              initials: "",
              exponent: "",
              label: "OPEN-EUGENIA",
              size: 120,
              vector: true,
              vignette: true,
              tint: true,
              background: true,
              frame: true,
              ink: "#ffffff",
              labelWeight: 500,
            },
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
            logo: {
              variant: "mark",
              initials: "",
              exponent: "",
              label: "OPEN-EUGENIA",
              size: 104,
              vector: true,
              vignette: true,
              tint: true,
              background: true,
              frame: true,
              ink: "#ffffff",
              labelWeight: 500,
            },
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
            logo: {
              variant: "mark",
              initials: "",
              exponent: "",
              label: "OPEN-EUGENIA",
              size: 104,
              vector: true,
              vignette: true,
              tint: true,
              background: true,
              frame: true,
              ink: "#ffffff",
              labelWeight: 500,
            },
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
            logo: {
              variant: "mark",
              initials: "",
              exponent: "",
              label: "OPEN-EUGENIA",
              size: 120,
              vector: true,
              vignette: true,
              tint: true,
              background: true,
              frame: true,
              ink: "#ffffff",
              labelWeight: 500,
            },
          }}
        />
      </Folder>
      <Folder name="Covers">
        <Still
          id="BookCover"
          component={Cover}
          width={1015}
          height={1440}
          schema={coverSchema}
          defaultProps={{
            brand: "#00bc72",
            edition: "2025·2026 edition",
            intro: "Conference cycles organized by residents of the Cité internationale universitaire de Paris",
            eyebrow: "Proceedings of",
            title: "The 1st conference cycles of Cytopia",
            image: "img/mi.jpg",
            imageFocus: 76,
            overlay: 0.6,
            logo: {
              variant: "full" as const,
              initials: "Cy",
              exponent: "",
              label: "CYTOPIA",
              size: 204,
              vector: true,
              vignette: true,
              tint: true,
              background: true,
              frame: true,
              ink: "#ffffff",
              labelWeight: 500,
            },
            partners: [{
              src: "img/fir.png",
              radius: 0,
              filter: "none" as const,
            }, {
              src: "img/diplo.jpg",
              radius: 0,
              filter: "remove-light" as const,
            }, {
              src: "img/gt2.png",
              radius: 0,
              filter: "remove-dark" as const,
            }, {
              src: "img/oe8.png",
              radius: 0,
              filter: "grayscale" as const,
            }],
          }}
        />
        <Still
          id="BookBackCover"
          component={BackCover}
          width={1015}
          height={1440}
          schema={backCoverSchema}
          defaultProps={{
            brand: "#00bc72",
            title: "1st conference cycles of Cytopia",
            infos: [{
              icon: "none" as const,
              label: "Year",
              value: "2025-2026",
            }, {
              icon: "none" as const,
              label: "Place",
              value: "CiuP, 75014 Paris, France",
            }, {
              icon: "none" as const,
              label: "Tags",
              value: "biology, diplomacy, technology",
            }],
            photo: "https://www.cytopia.fr/cycles/2026/tech/conferences/tech_2/pictures/WhatsApp%20Image%202026-06-11%20at%2002.03.20.jpeg",
            photoFocus: 56,
            abstractLabel: "Abstract",
            abstract: "Cytopia is a program of thematic cycles of conferences organized at the Cité internationale universitaire de Paris. Each cycle gathers several conferences around a shared theme and creates an interdisciplinary space for reflection, debate, and knowledge production.\n\nThe project is not only a hosting platform for innovative conferences: it is also an experiment in new conference program formats. Discussions, articles, conferences, the final book, and the website are designed as media enhanced by the use of artificial intelligence, making it possible to navigate and query the content in a more interactive way.\n\nThe format sits at the intersection of an open and experimental campus dynamic and the standards of national and international academic conferences. This intermediate position makes it possible to introduce original tools and presentation formats that depart from more conventional conference models.",
            image: "img/mi.jpg",
            imageFocus: 25,
            overlay: 0.6,
            blur: 0,
            partners: [],
            isbn: "979-10-990960-0-5",
            barcodeColor: "#ffffff",
            barcodeBackground: "rgba(255, 255, 255, 0)",
          }}
        />
      </Folder>
    </>
  );
}
