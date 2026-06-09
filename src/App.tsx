import { useEffect, useState } from "react";

const profileFacts = [
  "1K followers",
  "500+ connections",
  "Boulder, Colorado",
  "Data Science at CU Boulder",
];

const storyMoments = [
  {
    label: "Origin",
    title: "From Thane to Boulder, with a builder's instinct the whole way through.",
    body:
      "The path started in Maharashtra and now runs through Boulder, where I am completing a Master's in Data Science at the University of Colorado Boulder. The through-line has stayed the same: curiosity, systems, and a strong need to make ideas tangible.",
  },
  {
    label: "Discipline",
    title: "I move between code, product, and interface without treating them like separate worlds.",
    body:
      "That means backend services, AI workflows, research tools, finance dashboards, and user-facing experiences all belong to the same practice. I care about what the system does, how it feels, and whether people understand it immediately.",
  },
  {
    label: "Direction",
    title: "The work is getting sharper: more intentional, more ambitious, more narrative.",
    body:
      "This portfolio is not meant to be a shelf of screenshots. It is a story about how I think, what I build, and why the details matter when software is supposed to carry real weight.",
  },
];

const timeline = [
  {
    year: "2018 - 2020",
    title: "Foundation years",
    detail:
      "The early chapter focused on building discipline, technical range, and the confidence to keep making things from scratch.",
  },
  {
    year: "2020 - 2024",
    title: "Undergraduate expansion",
    detail:
      "This was the period where projects multiplied, interests widened, and engineering stopped being just coursework and became identity.",
  },
  {
    year: "2024 - 2026",
    title: "CU Boulder, Master's in Data Science",
    detail:
      "Graduate work brought more depth: stronger analytical rigor, more product ambition, and a clearer sense of the kind of systems I want to build next.",
  },
];

const proofPoints = [
  {
    metric: "3.6 GPA",
    caption: "Master's performance at the University of Colorado Boulder",
  },
  {
    metric: "AIR 483",
    caption: "GATE CS 2026 result highlighted in recent LinkedIn activity",
  },
  {
    metric: "AIR 2323",
    caption: "GATE DA 2026 result as part of the same milestone",
  },
  {
    metric: "2022",
    caption: "Publication year for Senseworth: A Tweet Classifier",
  },
];

const projectChapters = [
  {
    name: "Auralize",
    type: "AI x sensory design",
    copy:
      "An AI-powered application that turns music into dynamic visuals by reading tempo, frequency, and mood as a living visual system.",
  },
  {
    name: "Quantrisk",
    type: "Regime-aware analytics",
    copy:
      "A portfolio analytics and risk dashboard built around market data, scenario analysis, hidden Markov regime detection, and practical financial storytelling.",
  },
  {
    name: "Savant",
    type: "Research intelligence",
    copy:
      "A research assistant platform built across FastAPI, Next.js, and a browser extension, designed to help users explore papers, concepts, and citations more fluidly.",
  },
  {
    name: "Daemon / Forge / Aria",
    type: "Systems under construction",
    copy:
      "A cluster of newer projects that show where my head is now: modular infrastructure, intelligent workflows, and tools that behave like adaptable systems instead of static apps.",
  },
];

const credentials = [
  "Google certifications earned across 2022 and 2023",
  "Cybersecurity Fundamentals Certificate from Zscaler",
  "Publication: Senseworth: A Tweet Classifier",
  "Activity spanning hackathons, cloud security, and service recognition",
];

const backgroundAsset =
  "https://mir-s3-cdn-cf.behance.net/project_modules/disp/6c674e241287029.6953aa1320b47.gif";

export default function App() {
  const [scrollY, setScrollY] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(1);

  useEffect(() => {
    const updateViewport = () => {
      setViewportHeight(window.innerHeight || 1);
    };

    const updateScroll = () => {
      setScrollY(window.scrollY);
    };

    updateViewport();
    updateScroll();

    window.addEventListener("resize", updateViewport);
    window.addEventListener("scroll", updateScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", updateViewport);
      window.removeEventListener("scroll", updateScroll);
    };
  }, []);

  const introProgress = Math.min(scrollY / viewportHeight, 1);
  const backgroundShift = -Math.min(scrollY * 0.045, viewportHeight * 0.18);
  const backgroundScale = 1.08 - introProgress * 0.04;
  const overlayOpacity = 0.12 + introProgress * 0.42;

  return (
    <div className="page-shell">
      <div
        className="background-media"
        aria-hidden="true"
        style={{
          transform: `translate3d(0, ${backgroundShift}px, 0) scale(${backgroundScale})`,
        }}
      >
        <img src={backgroundAsset} alt="" />
      </div>
      <div className="background-overlay" style={{ opacity: overlayOpacity }} />
      <div className="intro-veil" aria-hidden="true" />
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <section className="landing-stage">
        <div className="landing-copy">
          <div className="landing-kicker">
            <span className="kicker-line" />
            <p className="eyebrow">Welcome to</p>
          </div>
          <h1>
            Pranav&apos;s
            <span>Portfolio</span>
          </h1>
          <p className="landing-text">
            A story about systems, ambition, migration, and the craft of making
            software feel alive.
          </p>
          <div className="fact-ribbon">
            {profileFacts.map((fact) => (
              <span key={fact}>{fact}</span>
            ))}
          </div>
          <a href="#story" className="scroll-invite">
            Enter the story
          </a>
        </div>
      </section>

      <main className="layout">
        <section className="hero-card narrative-card" id="story">
          <div className="section-heading">
            <p className="eyebrow">Chapter one</p>
            <h2 className="hero-title">This is not a normal portfolio. It is a guided read of how I build.</h2>
          </div>
          <div className="hero-grid">
            <div>
              <p className="hero-copy">
                Hello, I&apos;m Pranav Chopdekar. Publicly, the profile reads like
                a Master&apos;s student in Data Science at CU Boulder with 1K
                followers, 500+ connections, and a growing body of technical
                work. But the more interesting story is how those pieces connect.
              </p>
              <div className="hero-actions">
                <a href="#timeline" className="primary-link">
                  Follow the timeline
                </a>
                <a href="#chapters" className="secondary-link">
                  Jump to projects
                </a>
              </div>
            </div>

            <aside className="status-panel">
              <p className="status-label">Current lens</p>
              <div className="status-value">Software with narrative force</div>
              <div className="status-list">
                {credentials.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section className="story-sequence">
          {storyMoments.map((moment) => (
            <article className="story-panel" key={moment.label}>
              <p className="eyebrow">{moment.label}</p>
              <h3>{moment.title}</h3>
              <p>{moment.body}</p>
            </article>
          ))}
        </section>

        <section className="timeline-section" id="timeline">
          <div className="section-heading">
            <p className="eyebrow">Timeline</p>
            <h2>A path that keeps getting broader, but also more specific.</h2>
          </div>
          <div className="timeline-grid">
            {timeline.map((item) => (
              <article className="timeline-card" key={item.year}>
                <p className="timeline-year">{item.year}</p>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="proof-section">
          <div className="section-heading">
            <p className="eyebrow">Signals</p>
            <h2>The visible milestones are only interesting because of what they imply.</h2>
          </div>
          <div className="proof-grid">
            {proofPoints.map((point) => (
              <article className="proof-card" key={point.metric}>
                <div className="proof-metric">{point.metric}</div>
                <p>{point.caption}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="chapters-section" id="chapters">
          <div className="section-heading">
            <p className="eyebrow">Project chapters</p>
            <h2>Each project marks a different version of what I was trying to learn how to do.</h2>
          </div>
          <div className="chapter-stack">
            {projectChapters.map((project) => (
              <article className="chapter-card" key={project.name}>
                <div className="chapter-meta">{project.type}</div>
                <h3>{project.name}</h3>
                <p>{project.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="contact-banner closing-panel">
          <p className="eyebrow">Next scene</p>
          <h2>If this story resonates, the next step is a conversation.</h2>
          <p>
            I&apos;m building across AI products, research systems, analytics, and
            thoughtful user experiences. This portfolio will keep expanding, but
            the direction is already clear.
          </p>
        </section>
      </main>
    </div>
  );
}
