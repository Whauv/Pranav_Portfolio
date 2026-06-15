import { gsap } from "gsap";
import { type CSSProperties, useEffect, useMemo, useRef, useState } from "react";

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

const chapterDialLabels = [
  "Story",
  "Timeline",
  "Projects",
  "Contact",
  "Signals",
  "Direction",
  "Systems",
  "Motion",
] as const;

const haloSets = {
  story: ["Origin", "Systems", "Narrative", "Build", "Clarity", "Craft"],
  timeline: ["Foundation", "Expansion", "Depth", "Discipline", "Range", "Direction"],
  projects: ["Auralize", "Quantrisk", "Savant", "Forge", "Aria", "Daemon"],
  contact: ["Signal", "Conversation", "Ideas", "Systems", "Taste", "Next"],
} as const;

const signalNodes = [
  { x: 10, y: 62, size: "sm" },
  { x: 23, y: 28, size: "md" },
  { x: 37, y: 46, size: "sm" },
  { x: 51, y: 18, size: "lg" },
  { x: 66, y: 40, size: "md" },
  { x: 84, y: 24, size: "sm" },
  { x: 72, y: 72, size: "md" },
  { x: 42, y: 78, size: "sm" },
  { x: 18, y: 84, size: "sm" },
] as const;

const signalLinks = [
  { x1: 10, y1: 62, x2: 23, y2: 28 },
  { x1: 23, y1: 28, x2: 37, y2: 46 },
  { x1: 37, y1: 46, x2: 51, y2: 18 },
  { x1: 51, y1: 18, x2: 66, y2: 40 },
  { x1: 66, y1: 40, x2: 84, y2: 24 },
  { x1: 37, y1: 46, x2: 42, y2: 78 },
  { x1: 42, y1: 78, x2: 72, y2: 72 },
  { x1: 18, y1: 84, x2: 42, y2: 78 },
] as const;

const ORBIT_LOADER_CONFIG = {
  accentColor: "#F5C842",
  bgColor: "#080808",
  duration: 4200,
  ringRadiiBase: [60, 100, 145, 195, 250, 310, 375, 445],
  rings: [
    "DATA SCIENCE",
    "MACHINE LEARNING",
    "COMPUTER VISION",
    "NLP",
    "PYTHON",
    "PYTORCH",
    "FULL STACK",
    "AI ENGINEER",
  ],
} as const;

const ORBIT_RINGS = ORBIT_LOADER_CONFIG.rings.map((label, index) => ({
  label,
  baseRadius: ORBIT_LOADER_CONFIG.ringRadiiBase[index],
  duration: 12 + index * 3.2,
  direction: index % 2 === 0 ? -1 : 1,
  pulseScale: 1.025 + index * 0.004,
}));

const ORBIT_LOADER_DURATION_MS = ORBIT_LOADER_CONFIG.duration;

type PageId = (typeof pages)[number]["id"];
type CursorMode =
  | "default"
  | "hover"
  | "project"
  | "heading"
  | "cta"
  | "text"
  | "soundtrack";

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

function SectionHalo({
  words,
  className = "",
}: {
  words: readonly string[];
  className?: string;
}) {
  return (
    <div className={`section-halo ${className}`.trim()} aria-hidden="true">
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          className="section-halo-word"
          style={
            {
              "--halo-index": index,
              "--halo-count": words.length,
            } as CSSProperties
          }
        >
          {word}
        </span>
      ))}
    </div>
  );
}

function SignalField({ className = "" }: { className?: string }) {
  return (
    <div className={`signal-field ${className}`.trim()} aria-hidden="true">
      <svg viewBox="0 0 100 100" className="signal-field-svg">
        {signalLinks.map((link, index) => (
          <line
            key={`signal-link-${index}`}
            className="signal-link"
            x1={link.x1}
            y1={link.y1}
            x2={link.x2}
            y2={link.y2}
          />
        ))}
        {signalNodes.map((node, index) => (
          <circle
            key={`signal-node-${index}`}
            className={`signal-node signal-node--${node.size}`}
            cx={node.x}
            cy={node.y}
            r={node.size === "lg" ? 1.7 : node.size === "md" ? 1.25 : 0.95}
          />
        ))}
      </svg>
      <span className="signal-pulse signal-pulse--one" />
      <span className="signal-pulse signal-pulse--two" />
    </div>
  );
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

function getOrbitFontSize(radius: number) {
  return Math.max(12, radius * 0.095);
}

function buildOrbitRingText(label: string, radius: number, fontSize: number) {
  const arcLength = Math.PI * radius;
  const segment = `${label} • `;
  const estimatedCharWidth = fontSize * 0.6;
  const minCharacters = Math.ceil(arcLength / estimatedCharWidth);
  const repeatCount = Math.max(2, Math.ceil(minCharacters / segment.length));
  return Array.from({ length: repeatCount }, () => segment).join("");
}

export default function App() {
  const [scrollY, setScrollY] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(1);
  const [viewportHeight, setViewportHeight] = useState(1);
  const [storyActive, setStoryActive] = useState(false);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(false);
  const [activePage, setActivePage] = useState<PageId>("story");
  const [isLoaded, setIsLoaded] = useState(false);
  const [orbitLoading, setOrbitLoading] = useState(false);
  const [orbitDone, setOrbitDone] = useState(false);
  const [cursor, setCursor] = useState({
    x: 0,
    y: 0,
    mode: "default" as CursorMode,
  });
  const [audioReady, setAudioReady] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [devSoundMuted, setDevSoundMuted] = useState(true);
  const [revealReady, setRevealReady] = useState(false);
  const cursorTrailRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const ringPos = useRef({ x: 0, y: 0 });
  const trailPos = useRef({ x: 0, y: 0 });
  const mousePos = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const playerRef = useRef<{ playVideo: () => void; pauseVideo: () => void } | null>(null);
  const shouldAutoplayRef = useRef(false);
  const orbitSceneRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const orbitRafRef = useRef<number>(0);
  const orbitExitRef = useRef<(() => void) | null>(null);

  const pageIndex = useMemo(
    () => pages.findIndex((page) => page.id === activePage),
    [activePage],
  );

  const orbitScale = useMemo(
    () => Math.max(0.32, Math.min(viewportWidth, viewportHeight) / 1000),
    [viewportHeight, viewportWidth],
  );

  const orbitRings = useMemo(
    () =>
      ORBIT_RINGS.map((ring) => {
        const radius = ring.baseRadius * orbitScale;
        const fontSize = getOrbitFontSize(radius);
        const repeatedText = buildOrbitRingText(ring.label, radius, fontSize);
        const halfArcLength = Math.PI * radius;

        return {
          ...ring,
          radius,
          fontSize,
          repeatedText,
          textLength: halfArcLength,
        };
      }),
    [orbitScale],
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
      setViewportWidth(window.innerWidth || 1);
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
    document.body.style.overflow =
      storyActive && !orbitLoading ? "" : "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [storyActive, orbitLoading]);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    if (!finePointer.matches) return;

    const getMode = (target: HTMLElement | null): CursorMode => {
      if (!target) return "default";
      if (target.closest(".orbit-rig")) return "hover";
      if (target.closest(".project-entry")) return "project";
      if (target.closest(".soundtrack-toggle")) return "soundtrack";
      if (
        target.closest(
          ".scroll-invite, .inline-actions a, .inline-toggle, .cta-link, .page-nav-btn",
        )
      ) {
        return "cta";
      }
      if (target.closest("h1, h2, h3")) return "heading";
      if (target.closest("button, a, .page-tab, .contact-link")) return "hover";
      if (target.closest("p")) return "text";
      return "default";
    };

    const handleMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      const mode = getMode(e.target as HTMLElement);

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      setCursor((prev) =>
        prev.mode !== mode ? { x: e.clientX, y: e.clientY, mode } : prev,
      );
    };

    const handleLeave = () => {
      setCursor((prev) => ({ ...prev, mode: "default" }));
    };

    const animateRing = () => {
      const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
      const speed = 0.11;
      const trailSpeed = 0.06;

      ringPos.current.x = lerp(ringPos.current.x, mousePos.current.x, speed);
      ringPos.current.y = lerp(ringPos.current.y, mousePos.current.y, speed);
      trailPos.current.x = lerp(trailPos.current.x, mousePos.current.x, trailSpeed);
      trailPos.current.y = lerp(trailPos.current.y, mousePos.current.y, trailSpeed);

      if (cursorRingRef.current) {
        const dx = mousePos.current.x - ringPos.current.x;
        const dy = mousePos.current.y - ringPos.current.y;
        const ringVelocity = Math.min(Math.hypot(dx, dy), 120);
        const ringAngle = Math.atan2(dy, dx) * (180 / Math.PI);
        const squeeze = 1 + ringVelocity / 140;

        cursorRingRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) rotate(${ringAngle}deg) scaleX(${squeeze})`;
      }

      if (cursorTrailRef.current) {
        const dx = mousePos.current.x - trailPos.current.x;
        const dy = mousePos.current.y - trailPos.current.y;
        const velocity = Math.min(Math.hypot(dx, dy), 120);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        const stretch = 1 + velocity / 42;
        const opacity = Math.min(0.16 + velocity / 260, 0.52);

        cursorTrailRef.current.style.transform = `translate3d(${trailPos.current.x}px, ${trailPos.current.y}px, 0) rotate(${angle}deg) scaleX(${stretch})`;
        cursorTrailRef.current.style.opacity = `${opacity}`;
      }
      rafRef.current = requestAnimationFrame(animateRing);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseout", handleLeave);
    rafRef.current = requestAnimationFrame(animateRing);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseout", handleLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    if (!orbitLoading) return;
    if (!orbitSceneRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      setOrbitLoading(false);
      setOrbitDone(false);
      setStoryActive(true);
      setActivePage("story");
      window.dispatchEvent(new CustomEvent("preloaderDone"));
      return;
    }

    let exitStarted = false;
    let counterFrame = 0;
    let orbitTimeline: gsap.core.Timeline | null = null;
    let exitTimeline: gsap.core.Timeline | null = null;

    const finishOrbitLoader = () => {
      setOrbitLoading(false);
      setOrbitDone(false);
      setStoryActive(true);
      setActivePage("story");
      shouldAutoplayRef.current = false;
      if (!devSoundMuted && audioReady && playerRef.current) {
        playerRef.current.playVideo();
        setAudioPlaying(true);
      }
      window.dispatchEvent(new CustomEvent("preloaderDone"));
      window.setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 220);
    };

    const runOrbitExit = () => {
      if (exitStarted || !orbitSceneRef.current) return;
      exitStarted = true;
      orbitTimeline?.pause();
      cancelAnimationFrame(counterFrame);

      const ringSelectors = orbitRings
        .map((_, index) => `.orbit-ring--${index}`)
        .reverse();

      exitTimeline = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        onComplete: finishOrbitLoader,
      });

      exitTimeline
        .to(
          ringSelectors,
          {
            opacity: 0,
            scale: 0.86,
            duration: 0.34,
            stagger: 0.08,
          },
          0,
        )
        .to(
          ".orbit-counter-group, .orbit-center-label, .orbit-progress, .orbit-skip",
          {
            opacity: 0,
            duration: 0.28,
          },
          0.12,
        )
        .to(
          ".orbit-ambient",
          {
            opacity: 0,
            scale: 1.12,
            duration: 0.36,
          },
          0.18,
        )
        .to(
          ".orbit-loader-scene",
          {
            opacity: 0,
            duration: 0.4,
          },
          0.42,
        );
    };

    orbitExitRef.current = runOrbitExit;

    const ctx = gsap.context(() => {
      orbitRings.forEach((ring, index) => {
        const selector = `.orbit-ring--${index}`;
        const topPathSelector = `.orbit-ring-path-top--${index}`;
        const bottomPathSelector = `.orbit-ring-path-bottom--${index}`;
        const textSelector = `.orbit-ring-text--${index}`;
        const randomOffset = Math.random() * 100;

        gsap.set(selector, {
          transformOrigin: "50% 50%",
          scale: 1,
          opacity: 0.35,
        });

        gsap.set([topPathSelector, bottomPathSelector], {
          attr: { startOffset: `${randomOffset}%` },
        });

        gsap.set(textSelector, {
          opacity: index % 2 === 0 ? 0.85 : 0.58,
          letterSpacing: "0.15em",
        });
      });

      orbitTimeline = gsap.timeline({ repeat: -1 });

      orbitRings.forEach((ring, index) => {
        const selector = `.orbit-ring--${index}`;
        const topPathSelector = `.orbit-ring-path-top--${index}`;
        const bottomPathSelector = `.orbit-ring-path-bottom--${index}`;
        const textSelector = `.orbit-ring-text--${index}`;
        const randomOffset = Math.random() * 100;
        const breatheDelay = (orbitRings.length - 1 - index) * 0.12;

        orbitTimeline?.to(
          [topPathSelector, bottomPathSelector],
          {
            attr: { startOffset: `${randomOffset + ring.direction * 100}%` },
            duration: ring.duration,
            ease: "none",
          },
          0,
        );

        orbitTimeline?.to(
          selector,
          {
            scale: ring.pulseScale,
            opacity: 1,
            duration: 2.4,
            ease: "sine.inOut",
            yoyo: true,
            repeat: 1,
          },
          breatheDelay,
        );

        orbitTimeline?.to(
          textSelector,
          {
            letterSpacing: "0.17em",
            opacity: index % 2 === 0 ? 0.96 : 0.76,
            duration: 2.4,
            ease: "sine.inOut",
            yoyo: true,
            repeat: 1,
          },
          breatheDelay,
        );
      });

      orbitTimeline.to(
        ".orbit-ambient",
        {
          scale: 1.08,
          opacity: 1,
          duration: 2.4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: 1,
        },
        0,
      );

      gsap.fromTo(
        ".orbit-progress-fill",
        { scaleX: 0, opacity: 0.2 },
        {
          scaleX: 1,
          opacity: 1,
          transformOrigin: "left center",
          duration: ORBIT_LOADER_DURATION_MS / 1000,
          ease: "power1.inOut",
        },
      );
    }, orbitSceneRef);

    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const counterEl = orbitSceneRef.current.querySelector<HTMLElement>(
      ".orbit-counter-value",
    );
    const startTime = performance.now();

    const animateCounter = (now: number) => {
      const progress = Math.min(
        (now - startTime) / ORBIT_LOADER_DURATION_MS,
        1,
      );
      const eased = easeInOutCubic(progress);
      const value = Math.round(eased * 100);

      if (counterEl) {
        counterEl.textContent = String(value);
      }

      if (progress < 1) {
        counterFrame = window.requestAnimationFrame(animateCounter);
      } else {
        runOrbitExit();
      }
    };

    counterFrame = window.requestAnimationFrame(animateCounter);

    return () => {
      orbitExitRef.current = null;
      cancelAnimationFrame(counterFrame);
      orbitTimeline?.kill();
      exitTimeline?.kill();
      ctx.revert();
    };
  }, [audioReady, audioPlaying, devSoundMuted, orbitLoading, orbitRings]);

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
    const revealTimers: number[] = [];
    const revealNodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const delay = Number(el.dataset.revealDelay ?? 0);

          const revealTimer = window.setTimeout(() => {
            el.classList.add("is-visible");

            if (el.dataset.reveal === "stagger-children") {
              const children = Array.from(
                el.querySelectorAll<HTMLElement>("[data-stagger-child]"),
              );
              children.forEach((child, i) => {
                const base = Number(el.dataset.staggerBase ?? 80);
                const childTimer = window.setTimeout(() => {
                  child.classList.add("is-visible");
                }, i * base);
                revealTimers.push(childTimer);
              });
            }
          }, delay);
          revealTimers.push(revealTimer);

          revealObserver.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
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
      revealTimers.forEach((timer) => window.clearTimeout(timer));
      revealObserver.disconnect();
      counterObserver.disconnect();
    };
  }, [activePage, storyActive, revealReady]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    setAutoScrollEnabled(false);
  }, [activePage]);

  const introProgress = Math.min(scrollY / viewportHeight, 1);
  const overlayOpacity = 0.18 + introProgress * 0.36;

  const handleEnterStory = () => {
    if (orbitLoading || storyActive) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStoryActive(true);
      setActivePage("story");
      window.dispatchEvent(new CustomEvent("preloaderDone"));
      return;
    }

    setOrbitLoading(true);
  };

  const handleSkipOrbit = () => {
    orbitExitRef.current?.();
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

    setDevSoundMuted(false);
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
        ref={cursorTrailRef}
        className={`cursor-trail cursor-trail--${cursor.mode}`}
        aria-hidden="true"
      />
      <div
        ref={cursorDotRef}
        className={`cursor-dot cursor-dot--${cursor.mode}`}
        aria-hidden="true"
      />
      <div
        ref={cursorRingRef}
        className={`cursor-ring cursor-ring--${cursor.mode}`}
        aria-hidden="true"
      >
        <span className="cursor-label" aria-hidden="true">
          {cursor.mode === "project" ? "View" : ""}
          {cursor.mode === "cta" ? "→" : ""}
          {cursor.mode === "soundtrack" ? "♪" : ""}
        </span>
      </div>
      <div className="background-media intro-background" aria-hidden="true">
        <img src={backgroundAsset} alt="" />
      </div>
      <div className="background-media story-background" aria-hidden="true">
        <img src={storyBackgroundAsset} alt="" />
      </div>
      <div className="background-overlay" style={{ opacity: overlayOpacity }} />
      <div className="vignette-overlay" aria-hidden="true" />
      <div className="grain-overlay" aria-hidden="true" />
      {orbitLoading ? (
        <div
          ref={orbitSceneRef}
          className={`orbit-loader-scene${orbitDone ? " is-exiting" : ""}`}
          aria-label="Loading"
          role="status"
        >
          <div className="orbit-ambient" aria-hidden="true" />
          <div ref={orbitRef} className="orbit-rig" aria-hidden="true">
              <svg
                className="orbit-svg"
                viewBox="0 0 1000 1000"
                xmlns="http://www.w3.org/2000/svg"
                overflow="visible"
              >
                <defs>
                  {orbitRings.map((ring, i) => (
                    <g key={`orbit-loader-path-group-${i}`}>
                      <path
                        id={`orbit-loader-path-top-${i}`}
                        d={`M ${500 - ring.radius},500 A ${ring.radius},${ring.radius} 0 0,1 ${500 + ring.radius},500`}
                        fill="none"
                      />
                      <path
                        id={`orbit-loader-path-bottom-${i}`}
                        d={`M ${500 + ring.radius},500 A ${ring.radius},${ring.radius} 0 0,1 ${500 - ring.radius},500`}
                        fill="none"
                      />
                    </g>
                  ))}
                </defs>
              {orbitRings.map((ring, i) => (
                <g
                  key={`ring-${i}`}
                  className={`orbit-ring orbit-ring--${i}`}
                >
                  <text
                    className={`orbit-ring-text orbit-ring-text--${i}`}
                    style={{ fontSize: `${ring.fontSize}px` }}
                    xmlSpace="preserve"
                  >
                    <textPath
                      className={`orbit-ring-path orbit-ring-path-top orbit-ring-path-top--${i}`}
                      href={`#orbit-loader-path-top-${i}`}
                      startOffset="0%"
                      textLength={ring.textLength}
                      lengthAdjust="spacing"
                    >
                      {ring.repeatedText}
                    </textPath>
                  </text>
                  <text
                    className={`orbit-ring-text orbit-ring-text--${i}`}
                    style={{ fontSize: `${ring.fontSize}px` }}
                    xmlSpace="preserve"
                  >
                    <textPath
                      className={`orbit-ring-path orbit-ring-path-bottom orbit-ring-path-bottom--${i}`}
                      href={`#orbit-loader-path-bottom-${i}`}
                      startOffset="0%"
                      textLength={ring.textLength}
                      lengthAdjust="spacing"
                    >
                      {ring.repeatedText}
                    </textPath>
                  </text>
                </g>
              ))}
              </svg>

              <div className="orbit-counter-group">
                <div className="orbit-counter-ring" />
                <div className="orbit-counter-number">
                  <span className="orbit-counter-value">0</span>
                  <span className="orbit-counter-suffix">%</span>
                </div>
              </div>
          </div>
          <div className="orbit-text">
            <p className="orbit-label">entering the story</p>
            <div className="orbit-progress">
              <div className="orbit-progress-fill" />
            </div>
          </div>
          <button
            className="orbit-skip"
            onClick={handleSkipOrbit}
            aria-label="Skip loading animation"
          >
            skip &rarr;
          </button>
        </div>
      ) : null}
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
            <span
              className="kicker-line draw-line"
              data-reveal
              data-reveal-delay={200}
            />
            <p className="eyebrow">Welcome to</p>
            <span
              className="kicker-line draw-line kicker-line--right"
              data-reveal
              data-reveal-delay={200}
            />
          </div>
          <h1 data-reveal="stagger-children" data-stagger-base={120}>
            <span className="headline-line" data-stagger-child>
              Pranav&apos;s
            </span>
            <span className="headline-line accent-line" data-stagger-child>
              Portfolio
            </span>
          </h1>
          <p className="landing-text" data-reveal data-reveal-delay={400}>
            A story about systems, ambition, migration, and the craft of making
            software feel alive.
          </p>
          <button
            type="button"
            className="scroll-invite"
            aria-label="Enter the story"
            onClick={handleEnterStory}
            disabled={orbitLoading}
          >
            Enter the story <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </header>

      <main className="layout" aria-hidden={!storyActive || !revealReady}>
        {storyActive ? (
          <div className="story-shell">
            <aside
              className="chapter-dial-shell"
              aria-label="Current chapter dial"
            >
              <div
                className="chapter-dial"
                aria-hidden="true"
                style={{ "--dial-rotation": `${pageIndex * 90}deg` } as CSSProperties}
              >
                <div className="chapter-dial-core">
                  <span>{pages[pageIndex]?.label ?? "Story"}</span>
                </div>
                <div className="chapter-dial-ring">
                  {chapterDialLabels.map((label, index) => (
                    <span
                      key={`${label}-${index}`}
                      className="chapter-dial-word"
                      style={
                        {
                          "--dial-index": index,
                          "--dial-count": chapterDialLabels.length,
                        } as CSSProperties
                      }
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </aside>
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
                <section className="intro-section">
                  <SectionHalo words={haloSets.story} className="section-halo--story" />
                  <div className="section-rule" aria-hidden="true" />
                  <p className="eyebrow" data-reveal="fade-left" data-reveal-delay={0}>
                    Chapter one
                  </p>
                  <h2 className="hero-title" data-reveal="clip-wipe" data-reveal-delay={120}>
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
                    <article
                      className="chapter-panel chapter-panel-wrap"
                      key={moment.label}
                    >
                      <div className="chapter-marker">
                        <p
                          className="eyebrow"
                          data-reveal="fade-left"
                          data-reveal-delay={0}
                        >
                          {moment.label}
                        </p>
                      </div>
                      <div className="chapter-content">
                        <div className="section-rule" aria-hidden="true" />
                        <h3 data-reveal="clip-wipe" data-reveal-delay={120}>
                          {moment.title}
                        </h3>
                        <p className="text-scrim" data-reveal data-reveal-delay={280}>
                          {moment.body}
                        </p>
                      </div>
                    </article>
                  ))}
                </section>
              </>
            ) : null}

            {activePage === "timeline" ? (
              <>
                <section className="timeline-section" data-reveal>
                  <SectionHalo
                    words={haloSets.timeline}
                    className="section-halo--timeline"
                  />
                  <SignalField className="signal-field--timeline" />
                  <div className="section-rule" aria-hidden="true" />
                  <p className="eyebrow">Timeline</p>
                  <h2>A path that keeps getting broader, but also more specific.</h2>
                  <div
                    className="timeline-rule draw-line"
                    data-reveal
                    data-reveal-delay={0}
                    style={{
                      height: "1px",
                      background: "rgba(255,255,255,0.15)",
                      marginBottom: "2rem",
                      width: "100%",
                    }}
                  />
                  <ol className="timeline-track">
                    {timeline.map((item) => (
                      <li
                        className="timeline-item dot-pop"
                        key={item.year}
                        data-reveal
                        data-reveal-delay={item === timeline[0] ? 0 : item === timeline[1] ? 150 : 300}
                      >
                        <p className="timeline-year">{item.year}</p>
                        <h3
                          className="timeline-title"
                          data-reveal="clip-wipe"
                          data-reveal-delay={item === timeline[0] ? 100 : item === timeline[1] ? 250 : 400}
                        >
                          {item.title}
                        </h3>
                        <p className="text-scrim">{item.detail}</p>
                      </li>
                    ))}
                  </ol>
                </section>

                <section className="proof-section">
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
                        data-reveal="scale-pop"
                        data-reveal-delay={index * 110}
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
                        <p className="proof-caption">{point.caption}</p>
                      </article>
                    ))}
                  </div>
                </section>
              </>
            ) : null}

            {activePage === "projects" ? (
              <section className="projects-section">
                <SectionHalo
                  words={haloSets.projects}
                  className="section-halo--projects"
                />
                <div className="section-rule" aria-hidden="true" />
                <p className="eyebrow">Project chapters</p>
                <h2>
                  Each project marks a different version of what I was trying to
                  learn how to do.
                </h2>
                <div
                  className="draw-line"
                  data-reveal
                  data-reveal-delay={0}
                  style={{ height: "1px", background: "var(--line-strong)", marginBottom: "0" }}
                />
                <div className="projects-index" role="list">
                  {projectChapters.map((project) => (
                    <article
                      className="project-entry"
                      key={project.name}
                      role="listitem"
                      tabIndex={0}
                      aria-label={`${project.name}, ${project.type}`}
                      data-reveal
                      data-reveal-delay={project === projectChapters[0] ? 0 : project === projectChapters[1] ? 100 : project === projectChapters[2] ? 200 : 300}
                    >
                      <p className="project-role project-type">{project.type}</p>
                      <h3>
                        <span
                          className="project-name"
                          data-reveal="fade-left"
                          data-reveal-delay={project === projectChapters[0] ? 80 : project === projectChapters[1] ? 180 : project === projectChapters[2] ? 280 : 380}
                        >
                          {project.name}
                          <span className="project-arrow" aria-hidden="true">
                            &rarr;
                          </span>
                        </span>
                      </h3>
                      <p
                        className="project-copy text-scrim"
                        data-reveal="fade-right"
                        data-reveal-delay={project === projectChapters[0] ? 160 : project === projectChapters[1] ? 260 : project === projectChapters[2] ? 360 : 460}
                      >
                        {project.copy}
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}

            {activePage === "contact" ? (
              <section className="contact-scene" data-reveal>
                <SectionHalo
                  words={haloSets.contact}
                  className="section-halo--contact"
                />
                <SignalField className="signal-field--contact" />
                <div className="section-rule" aria-hidden="true" />
                <p className="eyebrow">Next scene</p>
                <h2 data-reveal="clip-wipe">
                  If this story resonates, the next step is a conversation.
                </h2>
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
                      data-reveal
                      data-reveal-delay={0}
                    >
                      LinkedIn <span aria-hidden="true">&rarr;</span>
                    </a>
                    <a
                      href="https://github.com/Whauv"
                      target="_blank"
                      rel="noreferrer"
                      className="contact-link"
                      data-reveal
                      data-reveal-delay={90}
                    >
                      GitHub <span aria-hidden="true">&rarr;</span>
                    </a>
                    <a
                      href="mailto:pranav20022018@outlook.com"
                      className="contact-link"
                      data-reveal
                      data-reveal-delay={180}
                    >
                      pranav20022018@outlook.com <span aria-hidden="true">&rarr;</span>
                    </a>
                    <div
                      className="contact-link contact-link-static"
                      data-reveal
                      data-reveal-delay={270}
                    >
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
                    className="inline-toggle page-nav-btn prev"
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
                    className="inline-toggle page-nav-btn next"
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
