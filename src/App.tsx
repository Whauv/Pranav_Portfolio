import { useEffect, useMemo, useRef, useState } from "react";

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
    value: 3.6,
    decimals: 1,
    suffix: " GPA",
    caption: "Master's performance at the University of Colorado Boulder",
  },
  {
    metric: "AIR 483",
    value: 483,
    prefix: "AIR ",
    caption: "GATE CS 2026 result highlighted in recent LinkedIn activity",
  },
  {
    metric: "AIR 2323",
    value: 2323,
    prefix: "AIR ",
    caption: "GATE DA 2026 result as part of the same milestone",
  },
  {
    metric: "2022",
    value: 2022,
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

const pages = [
  { id: "story", label: "Story" },
  { id: "timeline", label: "Timeline" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
] as const;

type PageId = (typeof pages)[number]["id"];

declare global {
  interface Window {
    YT?: {
      Player: new (
        elementId: string,
        config: {
          videoId: string;
          playerVars?: Record<string, number | string>;
          events?: {
            onReady?: () => void;
            onStateChange?: (event: { data: number }) => void;
          };
        },
      ) => {
        playVideo: () => void;
        pauseVideo: () => void;
      };
      PlayerState: {
        PLAYING: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

const backgroundAsset =
  "https://mir-s3-cdn-cf.behance.net/project_modules/disp/6c674e241287029.6953aa1320b47.gif";
const storyBackgroundAsset =
  "https://mir-s3-cdn-cf.behance.net/project_modules/hd/71c525241287029.6953aa1322398.gif";
const soundtrackVideoId = "h0HC0UpfNuE";

function formatCount(
  value: number,
  decimals = 0,
  prefix = "",
  suffix = "",
) {
  return `${prefix}${value.toFixed(decimals)}${suffix}`;
}

export default function App() {
  const [scrollY, setScrollY] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(1);
  const [storyActive, setStoryActive] = useState(false);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(false);
  const [activePage, setActivePage] = useState<PageId>("story");
  const [isLoaded, setIsLoaded] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0, hovering: false });
  const [audioReady, setAudioReady] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [revealReady, setRevealReady] = useState(false);
  const playerRef = useRef<{ playVideo: () => void; pauseVideo: () => void } | null>(null);
  const shouldAutoplayRef = useRef(false);

  const pageIndex = useMemo(
    () => pages.findIndex((page) => page.id === activePage),
    [activePage],
  );

  useEffect(() => {
    const loaderTimer = window.setTimeout(() => {
      setIsLoaded(true);
    }, 1100);

    const revealTimer = window.setTimeout(() => {
      setRevealReady(true);
    }, 1550);

    return () => {
      window.clearTimeout(loaderTimer);
      window.clearTimeout(revealTimer);
    };
  }, []);

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

  useEffect(() => {
    document.body.style.overflow = storyActive ? "" : "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [storyActive]);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");

    if (!finePointer.matches) {
      return;
    }

    const handlePointerMove = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const hovering =
        !!target?.closest(
          "button, a, .project-entry, .contact-link, .page-tab, .inline-toggle",
        );

      setCursor({
        x: event.clientX,
        y: event.clientY,
        hovering,
      });
    };

    const handlePointerLeave = () => {
      setCursor((current) => ({ ...current, hovering: false }));
    };

    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseout", handlePointerLeave);

    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseout", handlePointerLeave);
    };
  }, []);

  useEffect(() => {
    if (!storyActive || !autoScrollEnabled) {
      return;
    }

    let animationFrame = 0;
    let lastTime = 0;

    const stopAutoScroll = () => {
      setAutoScrollEnabled(false);
    };

    const step = (time: number) => {
      if (!lastTime) {
        lastTime = time;
      }

      const delta = time - lastTime;
      lastTime = time;

      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const nextTop = Math.min(window.scrollY + delta * 0.026, maxScroll);

      window.scrollTo({ top: nextTop, behavior: "auto" });

      if (nextTop >= maxScroll) {
        setAutoScrollEnabled(false);
        return;
      }

      animationFrame = window.requestAnimationFrame(step);
    };

    const stopEvents: Array<keyof WindowEventMap> = [
      "wheel",
      "touchstart",
      "mousedown",
      "keydown",
    ];

    stopEvents.forEach((eventName) => {
      window.addEventListener(eventName, stopAutoScroll, { passive: true });
    });

    animationFrame = window.requestAnimationFrame(step);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      stopEvents.forEach((eventName) => {
        window.removeEventListener(eventName, stopAutoScroll);
      });
    };
  }, [storyActive, autoScrollEnabled]);

  useEffect(() => {
    if (window.YT?.Player) {
      if (!playerRef.current) {
        playerRef.current = new window.YT.Player("youtube-soundtrack-player", {
          videoId: soundtrackVideoId,
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
          },
          events: {
            onReady: () => {
              setAudioReady(true);
              if (shouldAutoplayRef.current) {
                playerRef.current?.playVideo();
                setAudioPlaying(true);
              }
            },
            onStateChange: (event) => {
              setAudioPlaying(
                event.data === window.YT?.PlayerState.PLAYING,
              );
            },
          },
        });
      }

      return;
    }

    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    document.body.appendChild(script);

    window.onYouTubeIframeAPIReady = () => {
      if (!window.YT?.Player || playerRef.current) {
        return;
      }

      playerRef.current = new window.YT.Player("youtube-soundtrack-player", {
        videoId: soundtrackVideoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
        },
        events: {
          onReady: () => {
            setAudioReady(true);
            if (shouldAutoplayRef.current) {
              playerRef.current?.playVideo();
              setAudioPlaying(true);
            }
          },
          onStateChange: (event) => {
            setAudioPlaying(event.data === window.YT?.PlayerState.PLAYING);
          },
        },
      });
    };

    return () => {
      window.onYouTubeIframeAPIReady = undefined;
    };
  }, []);

  useEffect(() => {
    const revealNodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" },
    );

    revealNodes.forEach((node) => revealObserver.observe(node));

    const counterNodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-count]"),
    );

    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const node = entry.target as HTMLElement;
          if (!entry.isIntersecting || node.dataset.animated === "true") {
            return;
          }

          node.dataset.animated = "true";

          const target = Number(node.dataset.target ?? "0");
          const decimals = Number(node.dataset.decimals ?? "0");
          const prefix = node.dataset.prefix ?? "";
          const suffix = node.dataset.suffix ?? "";
          const duration = 1200;
          const start = performance.now();

          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const next = target * eased;
            node.textContent = formatCount(next, decimals, prefix, suffix);

            if (progress < 1) {
              window.requestAnimationFrame(tick);
            } else {
              node.textContent = formatCount(target, decimals, prefix, suffix);
            }
          };

          window.requestAnimationFrame(tick);
        });
      },
      { threshold: 0.45 },
    );

    counterNodes.forEach((node) => counterObserver.observe(node));

    return () => {
      revealObserver.disconnect();
      counterObserver.disconnect();
    };
  }, [activePage, storyActive]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    setAutoScrollEnabled(false);
  }, [activePage]);

  const introProgress = Math.min(scrollY / viewportHeight, 1);
  const backgroundShift = storyActive
    ? 0
    : -Math.min(scrollY * 0.045, viewportHeight * 0.18);
  const backgroundScale = storyActive ? 1.01 : 1.08 - introProgress * 0.04;
  const overlayOpacity = 0.18 + introProgress * 0.36;

  const handleEnterStory = () => {
    setStoryActive(true);
    setActivePage("story");
    shouldAutoplayRef.current = true;
    if (audioReady && playerRef.current) {
      playerRef.current.playVideo();
      setAudioPlaying(true);
    }
    window.setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 220);
  };

  const toggleSoundtrack = () => {
    if (!audioReady || !playerRef.current) {
      return;
    }

    if (audioPlaying) {
      shouldAutoplayRef.current = false;
      playerRef.current.pauseVideo();
      setAudioPlaying(false);
      return;
    }

    shouldAutoplayRef.current = true;
    playerRef.current.playVideo();
    setAudioPlaying(true);
  };

  const goToPage = (page: PageId) => {
    setActivePage(page);
  };

  const previousPage = pageIndex > 0 ? pages[pageIndex - 1] : null;
  const nextPage = pageIndex < pages.length - 1 ? pages[pageIndex + 1] : null;

  return (
    <div
      className={`page-shell${storyActive ? " story-active" : ""}${revealReady ? " reveal-ready" : ""}`}
    >
      <div className={`site-loader${isLoaded ? " is-loaded" : ""}`} aria-hidden={isLoaded}>
        <div className="loader-mark">
          <p className="eyebrow">Loading</p>
          <div className="loader-line" />
          <p className="loader-title">Pranav&apos;s Portfolio</p>
        </div>
      </div>
      <div
        className={`cursor-orb${cursor.hovering ? " is-hovering" : ""}`}
        aria-hidden="true"
        style={{
          transform: `translate3d(${cursor.x}px, ${cursor.y}px, 0)`,
        }}
      />
      <div
        className="background-media intro-background"
        aria-hidden="true"
        style={{
          transform: `translate3d(0, ${backgroundShift}px, 0) scale(${backgroundScale})`,
        }}
      >
        <img src={backgroundAsset} alt="" />
      </div>
      <div
        className="background-media story-background"
        aria-hidden="true"
        style={{
          transform: `translate3d(0, ${backgroundShift}px, 0) scale(${backgroundScale})`,
        }}
      >
        <img src={storyBackgroundAsset} alt="" />
      </div>
      <div className="background-overlay" style={{ opacity: overlayOpacity }} />
      <div className="vignette-overlay" aria-hidden="true" />
      <div className="grain-overlay" aria-hidden="true" />
      <div className="intro-veil" aria-hidden="true" />
      <div id="youtube-soundtrack-player" className="youtube-soundtrack-player" />

      {storyActive ? (
        <button
          type="button"
          className={`soundtrack-toggle${audioPlaying ? " is-playing" : ""}`}
          onClick={toggleSoundtrack}
          aria-label={audioPlaying ? "Pause soundtrack" : "Play soundtrack"}
        >
          <span className="soundtrack-label">Soundtrack</span>
          <span className="soundtrack-bars" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className="soundtrack-state">
            {audioPlaying ? "Pause" : "Play"}
          </span>
        </button>
      ) : null}

      <header className="landing-stage">
        <div className="landing-copy" data-reveal>
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
          <button
            type="button"
            className="scroll-invite"
            aria-label="Enter the story"
            onClick={handleEnterStory}
          >
            Enter the story <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </header>

      <main className="layout" aria-hidden={!storyActive || !revealReady}>
        {storyActive ? (
          <div className="story-shell">
            <nav className="page-nav" aria-label="Portfolio pages">
              {pages.map((page) => (
                <button
                  key={page.id}
                  type="button"
                  className={`page-tab${activePage === page.id ? " active" : ""}`}
                  onClick={() => goToPage(page.id)}
                  aria-pressed={activePage === page.id}
                >
                  {page.label}
                </button>
              ))}
            </nav>

            {activePage === "story" ? (
              <>
                <section className="intro-section" data-reveal>
                  <div className="section-rule" aria-hidden="true" />
                  <p className="eyebrow">Chapter one</p>
                  <h2 className="hero-title">
                    This is not a normal portfolio. It is a guided read of how I
                    build.
                  </h2>
                  <div className="intro-grid">
                    <div className="intro-main">
                      <p className="hero-copy text-scrim">
                        Hello, I&apos;m Pranav Chopdekar. Publicly, the profile
                        reads like a Master&apos;s student in Data Science at CU
                        Boulder with 1K followers, 500+ connections, and a growing
                        body of technical work. But the more interesting story is
                        how those pieces connect.
                      </p>
                    </div>
                    <aside className="credentials-rail" aria-label="Current lens">
                      <p className="status-label">Current lens</p>
                      <div className="status-value">Software with narrative force</div>
                      <div className="status-list">
                        {credentials.map((item) => (
                          <span key={item}>{item}</span>
                        ))}
                      </div>
                    </aside>
                  </div>
                  <nav className="inline-actions" aria-label="Portfolio navigation">
                    <button
                      type="button"
                      className="inline-toggle"
                      onClick={() => goToPage("timeline")}
                    >
                      Follow the timeline <span aria-hidden="true">&rarr;</span>
                    </button>
                    <button
                      type="button"
                      className="inline-toggle"
                      onClick={() => goToPage("projects")}
                    >
                      Jump to projects <span aria-hidden="true">&rarr;</span>
                    </button>
                    <button
                      type="button"
                      className="inline-toggle"
                      onClick={() => setAutoScrollEnabled((value) => !value)}
                      aria-pressed={autoScrollEnabled}
                    >
                      {autoScrollEnabled ? "Pause guided scroll" : "Play guided scroll"}{" "}
                      <span aria-hidden="true">&rarr;</span>
                    </button>
                  </nav>
                </section>

                <section className="chapter-sequence" aria-label="Story chapters">
                  {storyMoments.map((moment) => (
                    <article className="chapter-panel" key={moment.label} data-reveal>
                      <div className="chapter-marker">
                        <p className="eyebrow">{moment.label}</p>
                      </div>
                      <div className="chapter-content">
                        <div className="section-rule" aria-hidden="true" />
                        <h3>{moment.title}</h3>
                        <p className="text-scrim">{moment.body}</p>
                      </div>
                    </article>
                  ))}
                </section>
              </>
            ) : null}

            {activePage === "timeline" ? (
              <>
                <section className="timeline-section" data-reveal>
                  <div className="section-rule" aria-hidden="true" />
                  <p className="eyebrow">Timeline</p>
                  <h2>A path that keeps getting broader, but also more specific.</h2>
                  <ol className="timeline-track">
                    {timeline.map((item) => (
                      <li className="timeline-item" key={item.year}>
                        <p className="timeline-year">{item.year}</p>
                        <h3>{item.title}</h3>
                        <p className="text-scrim">{item.detail}</p>
                      </li>
                    ))}
                  </ol>
                </section>

                <section className="proof-section" data-reveal>
                  <div className="section-rule" aria-hidden="true" />
                  <p className="eyebrow">Signals</p>
                  <h2>
                    The visible milestones are only interesting because of what
                    they imply.
                  </h2>
                  <div className="proof-grid">
                    {proofPoints.map((point, index) => (
                      <article
                        className="proof-item"
                        key={point.metric}
                        style={{ ["--stagger" as string]: `${index % 2 === 0 ? 0 : 2.5}rem` }}
                      >
                        <div
                          className="proof-metric"
                          data-count
                          data-target={point.value}
                          data-decimals={point.decimals ?? 0}
                          data-prefix={point.prefix ?? ""}
                          data-suffix={point.suffix ?? ""}
                          aria-label={point.metric}
                        >
                          {point.metric}
                        </div>
                        <div className="proof-caption-rule" aria-hidden="true" />
                        <p>{point.caption}</p>
                      </article>
                    ))}
                  </div>
                </section>
              </>
            ) : null}

            {activePage === "projects" ? (
              <section className="projects-section" data-reveal>
                <div className="section-rule" aria-hidden="true" />
                <p className="eyebrow">Project chapters</p>
                <h2>
                  Each project marks a different version of what I was trying to
                  learn how to do.
                </h2>
                <div className="projects-index" role="list">
                  {projectChapters.map((project) => (
                    <article
                      className="project-entry"
                      key={project.name}
                      role="listitem"
                      tabIndex={0}
                      aria-label={`${project.name}, ${project.type}`}
                    >
                      <p className="project-role">{project.type}</p>
                      <h3>{project.name}</h3>
                      <p className="project-copy text-scrim">{project.copy}</p>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}

            {activePage === "contact" ? (
              <section className="contact-scene" data-reveal>
                <div className="section-rule" aria-hidden="true" />
                <p className="eyebrow">Next scene</p>
                <h2>If this story resonates, the next step is a conversation.</h2>
                <div className="contact-grid">
                  <div className="contact-copy">
                    <p className="closing-copy text-scrim">
                      I&apos;m building across AI products, research systems,
                      analytics, and thoughtful user experiences. This portfolio
                      will keep expanding, but the direction is already clear.
                    </p>
                    <p className="contact-note text-scrim">
                      Reach out if you want to talk about machine learning
                      systems, research products, story-led interfaces, or
                      collaborations that need both technical clarity and design
                      taste.
                    </p>
                  </div>
                  <div className="contact-board" aria-label="Contact options">
                    <a
                      href="https://www.linkedin.com/in/pranavchopdekar/"
                      target="_blank"
                      rel="noreferrer"
                      className="contact-link"
                    >
                      LinkedIn <span aria-hidden="true">&rarr;</span>
                    </a>
                    <a
                      href="https://github.com/Whauv"
                      target="_blank"
                      rel="noreferrer"
                      className="contact-link"
                    >
                      GitHub <span aria-hidden="true">&rarr;</span>
                    </a>
                    <a
                      href="mailto:pranav20022018@outlook.com"
                      className="contact-link"
                    >
                      pranav20022018@outlook.com <span aria-hidden="true">&rarr;</span>
                    </a>
                    <div className="contact-link contact-link-static">
                      Add your phone number here <span aria-hidden="true">&rarr;</span>
                    </div>
                    <div className="contact-script">
                      <p className="contact-script-label">Best opening line</p>
                      <p>
                        "I saw the portfolio story and wanted to talk about what
                        you&apos;re building next."
                      </p>
                      <p className="contact-script-meta">
                        Phone number slot is ready whenever you want me to place
                        it into the contact scene.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            ) : null}

            <footer className="page-footer">
              <div className="page-footer-rule" aria-hidden="true" />
              <div className="page-footer-actions">
                {previousPage ? (
                  <button
                    type="button"
                    className="inline-toggle"
                    onClick={() => goToPage(previousPage.id)}
                  >
                    Previous: {previousPage.label} <span aria-hidden="true">&rarr;</span>
                  </button>
                ) : (
                  <span />
                )}
                {nextPage ? (
                  <button
                    type="button"
                    className="inline-toggle"
                    onClick={() => goToPage(nextPage.id)}
                  >
                    Next: {nextPage.label} <span aria-hidden="true">&rarr;</span>
                  </button>
                ) : (
                  <span />
                )}
              </div>
            </footer>
          </div>
        ) : null}
      </main>
    </div>
  );
}
