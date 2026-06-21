import { gsap } from "gsap";
import { type CSSProperties, type MutableRefObject, useEffect, useMemo, useRef, useState } from "react";

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

const portfolioMenuItems = [
  {
    id: "story",
    title: "Story",
    subtitle: "Who I am and how I build",
    ctaLabel: "Enter story",
    baseAngle: 180,
    spinDuration: 18,
    spinDirection: 1,
    artwork:
      "https://mir-s3-cdn-cf.behance.net/project_modules/hd/71c525241287029.6953aa1322398.gif",
    position: "18% center",
  },
  {
    id: "timeline",
    title: "Timeline",
    subtitle: "My journey and experience",
    ctaLabel: "View timeline",
    baseAngle: -90,
    spinDuration: 24,
    spinDirection: -1,
    artwork:
      "https://mir-s3-cdn-cf.behance.net/project_modules/disp/6c674e241287029.6953aa1320b47.gif",
    position: "center center",
  },
  {
    id: "projects",
    title: "Projects",
    subtitle: "Selected work and case studies",
    ctaLabel: "See projects",
    baseAngle: 0,
    spinDuration: 15,
    spinDirection: 1,
    artwork:
      "https://mir-s3-cdn-cf.behance.net/project_modules/hd/71c525241287029.6953aa1322398.gif",
    position: "74% center",
  },
  {
    id: "contact",
    title: "Contact",
    subtitle: "Ways to reach and collaborate",
    ctaLabel: "Get in touch",
    baseAngle: 90,
    spinDuration: 21,
    spinDirection: -1,
    artwork:
      "https://mir-s3-cdn-cf.behance.net/project_modules/disp/6c674e241287029.6953aa1320b47.gif",
    position: "82% center",
  },
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

const galleryCards = [
  {
    id: "01",
    title: "Auralize",
    subtitle: "AI x Sensory Design",
    bg: backgroundAsset,
  },
  {
    id: "02",
    title: "Quantrisk",
    subtitle: "Regime-Aware Analytics",
    bg: storyBackgroundAsset,
  },
  {
    id: "03",
    title: "Projects",
    subtitle: "Selected Work & Case Studies",
    bg: backgroundAsset,
  },
  {
    id: "04",
    title: "Savant",
    subtitle: "Research Intelligence",
    bg: storyBackgroundAsset,
  },
] as const;

const CARD_COUNT = galleryCards.length;
const CARD_WIDTH = 280;
const CARD_HEIGHT = 360;
const CARD_GAP_ANGLE = 360 / CARD_COUNT;

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

type FlickerState = "on" | "off";

type FlickerStep = {
  state: FlickerState;
  duration: number;
};

type FlickerTextOptions = {
  element: HTMLElement;
  flickerPattern: FlickerStep[];
  glowColor?: string;
  idleMin?: number;
  idleMax?: number;
};

type FlickerStyleKey = "neon" | "led" | "retro";

const FLICKER_STYLE_MAP: Record<FlickerStyleKey, { color: string; glow: string }> = {
  neon: { color: "#F5C842", glow: "245, 200, 66" },
  led: { color: "#d3e7ff", glow: "180, 220, 255" },
  retro: { color: "#f2a34a", glow: "255, 160, 50" },
};

const DEFAULT_FLICKER_PATTERN: FlickerStep[] = [
  { state: "off", duration: 80 },
  { state: "on", duration: 60 },
  { state: "off", duration: 40 },
  { state: "on", duration: 100 },
  { state: "off", duration: 30 },
  { state: "on", duration: 50 },
  { state: "on", duration: 1020 },
];

function getFlickerSpeedMultiplier(value: string | undefined) {
  if (value === "fast") return 0.5;
  if (value === "slow") return 1.5;
  return 1;
}

export class FlickerText {
  element: HTMLElement;
  flickerPattern: FlickerStep[];
  glowColor: string;
  idleMin: number;
  idleMax: number;
  styleKey: FlickerStyleKey;
  speedMultiplier: number;
  repeatOnView: boolean;
  idlePhaseOffset: number;
  introPlayed = false;
  isDestroyed = false;
  isRunningBurst = false;
  timeouts = new Set<number>();
  observer: IntersectionObserver | null = null;

  constructor({
    element,
    flickerPattern,
    glowColor,
    idleMin = 2000,
    idleMax = 6000,
  }: FlickerTextOptions) {
    this.element = element;
    this.speedMultiplier = getFlickerSpeedMultiplier(
      element.dataset.flickerSpeed,
    );
    this.styleKey =
      (element.dataset.flickerStyle as FlickerStyleKey | undefined) ?? "neon";
    this.repeatOnView = element.dataset.flickerRepeat === "true";
    const preset = FLICKER_STYLE_MAP[this.styleKey] ?? FLICKER_STYLE_MAP.neon;
    this.glowColor = glowColor ?? preset.glow;
    this.idleMin = Math.round(idleMin * this.speedMultiplier);
    this.idleMax = Math.round(idleMax * this.speedMultiplier);
    this.idlePhaseOffset = 240 + Math.round(Math.random() * 1300);
    this.flickerPattern = flickerPattern.map((step) => ({
      ...step,
      duration: Math.round(step.duration * this.speedMultiplier),
    }));

    this.element.style.transition = "none";
    this.element.style.willChange = "opacity, text-shadow";
    this.element.style.color = preset.color;
    this.applyState("off", 0.08);
    this.setupObserver();
    this.start();
  }

  schedule(callback: () => void, delay: number) {
    const timeoutId = window.setTimeout(() => {
      this.timeouts.delete(timeoutId);
      callback();
    }, delay);
    this.timeouts.add(timeoutId);
  }

  applyState(state: FlickerState, opacityJitter?: number) {
    if (state === "off") {
      this.element.style.opacity = String(opacityJitter ?? 0.08);
      this.element.style.textShadow = "0 0 4px rgba(245,200,66,0.1)";
      return;
    }

    this.element.style.opacity = String(opacityJitter ?? 1);
    this.element.style.textShadow = `0 0 10px rgba(${this.glowColor}, 0.9), 0 0 20px rgba(${this.glowColor}, 0.7), 0 0 40px rgba(${this.glowColor}, 0.5), 0 0 80px rgba(${this.glowColor}, 0.3)`;
  }

  runPattern(pattern: FlickerStep[], done?: () => void, index = 0) {
    if (this.isDestroyed) return;
    if (index >= pattern.length) {
      this.applyState("on", 1);
      done?.();
      return;
    }

    const step = pattern[index];
    const intensity =
      step.state === "off"
        ? 0.06 + Math.random() * 0.06
        : 0.88 + Math.random() * 0.12;

    this.applyState(step.state, intensity);
    this.schedule(() => this.runPattern(pattern, done, index + 1), step.duration);
  }

  playIntro() {
    this.isRunningBurst = true;
    this.runPattern(this.flickerPattern, () => {
      this.introPlayed = true;
      this.isRunningBurst = false;
      this.scheduleAmbientBurst();
    });
  }

  scheduleAmbientBurst() {
    if (this.isDestroyed || this.isRunningBurst) return;
    const delay =
      this.idleMin +
      this.idlePhaseOffset +
      Math.round(Math.random() * (this.idleMax - this.idleMin));

    this.schedule(() => {
      if (this.isDestroyed || this.isRunningBurst) return;
      this.isRunningBurst = true;
      const burstPattern: FlickerStep[] = [
        { state: "off", duration: 22 + Math.round(Math.random() * 18) },
        { state: "on", duration: 14 + Math.round(Math.random() * 14) },
        { state: "off", duration: 10 + Math.round(Math.random() * 14) },
        { state: "on", duration: 16 + Math.round(Math.random() * 18) },
      ];

      this.runPattern(
        burstPattern.map((step) => ({
          ...step,
          duration: Math.round(step.duration * this.speedMultiplier),
        })),
        () => {
          this.isRunningBurst = false;
          this.applyState("on", 1);
          this.scheduleAmbientBurst();
        },
      );
    }, delay);
  }

  setupObserver() {
    if (!this.repeatOnView || typeof IntersectionObserver === "undefined") {
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          this.clearTimers();
          this.introPlayed = false;
          this.applyState("off", 0.08);
          this.start();
        });
      },
      { threshold: 0.55 },
    );

    this.observer.observe(this.element);
  }

  start() {
    if (this.isDestroyed || this.introPlayed) return;
    this.playIntro();
  }

  clearTimers() {
    this.timeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
    this.timeouts.clear();
    this.isRunningBurst = false;
  }

  destroy() {
    this.isDestroyed = true;
    this.clearTimers();
    this.observer?.disconnect();
    this.element.style.removeProperty("will-change");
  }

  static autoInit(root: ParentNode = document) {
    return Array.from(root.querySelectorAll<HTMLElement>(".flicker-text")).map(
      (element) => {
        const delay = Number(element.dataset.flickerDelay ?? "0");
        const instance = new FlickerText({
          element,
          flickerPattern: DEFAULT_FLICKER_PATTERN,
        });

        if (delay > 0) {
          instance.clearTimers();
          instance.applyState("off", 0.08);
          instance.schedule(() => instance.start(), delay);
        }

        return instance;
      },
    );
  }
}

function InertiaGallery({
  onViewProject,
}: {
  onViewProject: (index: number) => void;
}) {
  const rotationRef = useRef(0);
  const targetRotRef = useRef(0);
  const [activeCard, setActiveCard] = useState(2);
  const activeCardRef = useRef(2);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartRot = useRef(0);
  const velocityRef = useRef(0);
  const lastDragX = useRef(0);
  const lastDragTime = useRef(0);
  const galleryRaf = useRef<number>(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const isSnapping = useRef(false);

  useEffect(() => {
    rotationRef.current = -2 * CARD_GAP_ANGLE;
    targetRotRef.current = -2 * CARD_GAP_ANGLE;
    activeCardRef.current = 2;
    setActiveCard(2);
  }, []);

  useEffect(() => {
    const FRICTION = 0.92;
    const SNAP_THRESHOLD = 0.15;
    const LERP_SPEED = 0.12;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const getSnapAngle = (currentRot: number) => {
      const normalized = ((currentRot % 360) + 360) % 360;
      const nearest = Math.round(normalized / CARD_GAP_ANGLE) * CARD_GAP_ANGLE;
      const turns = Math.floor(currentRot / 360);
      return turns * 360 + nearest;
    };

    const getActiveIndex = (rot: number) => {
      const normalized = ((-rot % 360) + 360) % 360;
      return Math.round(normalized / CARD_GAP_ANGLE) % CARD_COUNT;
    };

    const tick = () => {
      if (!isDragging.current) {
        if (Math.abs(velocityRef.current) > SNAP_THRESHOLD) {
          targetRotRef.current += velocityRef.current;
          velocityRef.current *= FRICTION;
        } else if (!isSnapping.current && Math.abs(velocityRef.current) > 0) {
          velocityRef.current = 0;
          isSnapping.current = true;
          targetRotRef.current = getSnapAngle(targetRotRef.current);
        }
      }

      rotationRef.current = lerp(
        rotationRef.current,
        targetRotRef.current,
        isDragging.current ? 0.85 : LERP_SPEED,
      );

      if (
        isSnapping.current &&
        Math.abs(rotationRef.current - targetRotRef.current) < 0.05
      ) {
        rotationRef.current = targetRotRef.current;
        isSnapping.current = false;
      }

      const newActive = getActiveIndex(rotationRef.current);
      if (newActive !== activeCardRef.current) {
        activeCardRef.current = newActive;
        setActiveCard(newActive);
      }

      if (trackRef.current) {
        const cards =
          trackRef.current.querySelectorAll<HTMLElement>(".gallery-card");
        cards.forEach((card, i) => {
          const cardAngle = i * CARD_GAP_ANGLE;
          const angle = (rotationRef.current + cardAngle) % 360;
          const normalizedAngle = ((angle % 360) + 360) % 360;
          const rad = (normalizedAngle * Math.PI) / 180;
          const SPREAD = 260;
          const DEPTH = 120;
          const x = Math.sin(rad) * SPREAD;
          const z = Math.cos(rad) * DEPTH;
          const normalizedZ = (z + DEPTH) / (DEPTH * 2);
          const scale = 0.72 + normalizedZ * 0.28;
          const opacity = 0.35 + normalizedZ * 0.65;
          const y = -normalizedZ * 20;
          const rotY = -Math.sin(rad) * 28;
          const zIndex = Math.round(normalizedZ * 10);

          card.style.transform =
            `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${z}px) ` +
            `rotateY(${rotY}deg) scale(${scale})`;
          card.style.opacity = String(opacity);
          card.style.zIndex = String(zIndex);
          card.classList.toggle("is-active", i === newActive);
        });
      }

      galleryRaf.current = window.requestAnimationFrame(tick);
    };

    galleryRaf.current = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(galleryRaf.current);
  }, []);

  const handleDragStart = (clientX: number) => {
    isDragging.current = true;
    isSnapping.current = false;
    dragStartX.current = clientX;
    dragStartRot.current = targetRotRef.current;
    lastDragX.current = clientX;
    lastDragTime.current = performance.now();
    velocityRef.current = 0;
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging.current) return;
    const now = performance.now();
    const dt = now - lastDragTime.current;
    const delta = clientX - dragStartX.current;
    const DRAG_SENSITIVITY = 0.35;
    targetRotRef.current = dragStartRot.current + delta * DRAG_SENSITIVITY;

    if (dt > 0) {
      const instantVelocity = (clientX - lastDragX.current) * DRAG_SENSITIVITY;
      velocityRef.current = velocityRef.current * 0.6 + instantVelocity * 0.4;
    }

    lastDragX.current = clientX;
    lastDragTime.current = now;
  };

  const handleDragEnd = () => {
    isDragging.current = false;
  };

  return (
    <div className="inertia-gallery-scene">
      <div className="gallery-glow" aria-hidden="true" />
      <div
        ref={trackRef}
        className="gallery-track"
        onMouseDown={(e) => {
          e.preventDefault();
          handleDragStart(e.clientX);
        }}
        onMouseMove={(e) => handleDragMove(e.clientX)}
        onMouseUp={handleDragEnd}
        onMouseLeave={() => {
          if (isDragging.current) handleDragEnd();
        }}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
        onTouchEnd={handleDragEnd}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") {
            targetRotRef.current -= CARD_GAP_ANGLE;
            velocityRef.current = 0;
          }
          if (e.key === "ArrowRight") {
            targetRotRef.current += CARD_GAP_ANGLE;
            velocityRef.current = 0;
          }
        }}
        tabIndex={0}
        role="listbox"
        aria-label="Project gallery"
      >
        {galleryCards.map((card, i) => (
          <div
            key={card.id}
            className="gallery-card"
            data-index={i}
            aria-selected={activeCard === i}
          >
            <div
              className="gallery-card-bg"
              style={{ backgroundImage: `url(${card.bg})` }}
            />
            <div className="gallery-card-overlay" />
            <div className="gallery-card-content">
              <span className="gallery-card-number">{card.id}</span>
              <h3 className="gallery-card-title">{card.title}</h3>
            </div>
            <div className="gallery-card-shimmer" aria-hidden="true" />
          </div>
        ))}
      </div>
      <div className="gallery-info">
        <p className="gallery-info-subtitle">
          {galleryCards[activeCard]?.subtitle}
        </p>
        <button
          className="gallery-cta"
          onClick={() => onViewProject(activeCard)}
          aria-label={`View ${galleryCards[activeCard]?.title} project`}
        >
          See Projects <span aria-hidden="true">&rarr;</span>
        </button>
      </div>
      <p className="gallery-hint">
        Drag to spin the gallery, then release to feel the inertia.
      </p>
    </div>
  );
}

function PortfolioMenuGallery({
  items,
  activeIndex,
  onSelect,
  onEnter,
  trackRef,
}: {
  items: typeof portfolioMenuItems;
  activeIndex: number;
  onSelect: (index: number) => void;
  onEnter: () => void;
  trackRef: MutableRefObject<HTMLDivElement | null>;
}) {
  const gapAngle = 360 / items.length;
  const rotationRef = useRef(0);
  const targetRotRef = useRef(0);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartRot = useRef(0);
  const velocityRef = useRef(0);
  const lastDragX = useRef(0);
  const lastDragTime = useRef(0);
  const rafRef = useRef<number>(0);
  const isSnapping = useRef(false);
  const activeRef = useRef(activeIndex);

  useEffect(() => {
    const initial = -activeIndex * gapAngle;
    rotationRef.current = initial;
    targetRotRef.current = initial;
    activeRef.current = activeIndex;
  }, [activeIndex, gapAngle]);

  useEffect(() => {
    if (isDragging.current) return;
    const nextRotation = -activeIndex * gapAngle;
    targetRotRef.current = nextRotation;
    if (Math.abs(rotationRef.current - nextRotation) < 0.01) {
      rotationRef.current = nextRotation;
    }
  }, [activeIndex, gapAngle]);

  useEffect(() => {
    const FRICTION = 0.92;
    const SNAP_THRESHOLD = 0.15;
    const LERP_SPEED = 0.12;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const normalize = (value: number) => ((value % 360) + 360) % 360;

    const getNearestIndex = (rot: number) =>
      Math.round(normalize(-rot) / gapAngle) % items.length;

    const getSnapAngle = (rot: number) => -getNearestIndex(rot) * gapAngle;

    const tick = () => {
      if (!isDragging.current) {
        if (Math.abs(velocityRef.current) > SNAP_THRESHOLD) {
          targetRotRef.current += velocityRef.current;
          velocityRef.current *= FRICTION;
        } else if (!isSnapping.current && Math.abs(velocityRef.current) > 0) {
          velocityRef.current = 0;
          isSnapping.current = true;
          targetRotRef.current = getSnapAngle(targetRotRef.current);
        }
      }

      rotationRef.current = lerp(
        rotationRef.current,
        targetRotRef.current,
        isDragging.current ? 0.85 : LERP_SPEED,
      );

      if (
        isSnapping.current &&
        Math.abs(rotationRef.current - targetRotRef.current) < 0.05
      ) {
        rotationRef.current = targetRotRef.current;
        isSnapping.current = false;
      }

      const nextActive = getNearestIndex(rotationRef.current);
      if (nextActive !== activeRef.current) {
        activeRef.current = nextActive;
        onSelect(nextActive);
      }

      const track = trackRef.current;
      if (track) {
        const cards = track.querySelectorAll<HTMLElement>(".menu-gallery-card");
        cards.forEach((card, index) => {
          const angle = normalize(rotationRef.current + index * gapAngle);
          const rad = (angle * Math.PI) / 180;
          const spreadX = 310;
          const spreadY = 46;
          const depth = 170;
          const x = Math.sin(rad) * spreadX;
          const y = Math.cos(rad) * spreadY;
          const z = Math.cos(rad) * depth;
          const normalizedZ = (z + depth) / (depth * 2);
          const scale = 0.72 + normalizedZ * 0.4;
          const opacity = 0.3 + normalizedZ * 0.7;
          const rotateY = -Math.sin(rad) * 24;
          const zIndex = Math.round(normalizedZ * 10);

          card.style.transform =
            `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${z}px) ` +
            `rotateY(${rotateY}deg) scale(${scale})`;
          card.style.opacity = String(opacity);
          card.style.zIndex = String(zIndex);
          card.classList.toggle("is-active", index === nextActive);
        });
      }

      rafRef.current = window.requestAnimationFrame(tick);
    };

    rafRef.current = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafRef.current);
  }, [gapAngle, items.length, onSelect, trackRef]);

  const handleDragStart = (clientX: number) => {
    isDragging.current = true;
    isSnapping.current = false;
    dragStartX.current = clientX;
    dragStartRot.current = targetRotRef.current;
    lastDragX.current = clientX;
    lastDragTime.current = performance.now();
    velocityRef.current = 0;
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging.current) return;

    const now = performance.now();
    const dt = now - lastDragTime.current;
    const delta = clientX - dragStartX.current;
    const sensitivity = 0.32;
    targetRotRef.current = dragStartRot.current + delta * sensitivity;

    if (dt > 0) {
      const instantVelocity = (clientX - lastDragX.current) * sensitivity;
      velocityRef.current = velocityRef.current * 0.6 + instantVelocity * 0.4;
    }

    lastDragX.current = clientX;
    lastDragTime.current = now;
  };

  const handleDragEnd = () => {
    isDragging.current = false;
  };

  const moveBy = (step: number) => {
    const nextIndex = (activeRef.current + step + items.length) % items.length;
    velocityRef.current = 0;
    isSnapping.current = true;
    targetRotRef.current = -nextIndex * gapAngle;
    onSelect(nextIndex);
  };

  return (
    <div className="menu-gallery-shell">
      <div
        ref={trackRef}
        className="menu-gallery-track"
        onMouseDown={(event) => {
          event.preventDefault();
          handleDragStart(event.clientX);
        }}
        onMouseMove={(event) => handleDragMove(event.clientX)}
        onMouseUp={handleDragEnd}
        onMouseLeave={() => {
          if (isDragging.current) handleDragEnd();
        }}
        onTouchStart={(event) => handleDragStart(event.touches[0].clientX)}
        onTouchMove={(event) => handleDragMove(event.touches[0].clientX)}
        onTouchEnd={handleDragEnd}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            moveBy(-1);
          }
          if (event.key === "ArrowRight") {
            event.preventDefault();
            moveBy(1);
          }
          if (event.key === "Enter") {
            event.preventDefault();
            onEnter();
          }
        }}
        tabIndex={0}
        role="listbox"
        aria-label="Portfolio navigation gallery"
      >
        <div className="menu-gallery-orbit" aria-hidden="true" />
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className="menu-gallery-card"
            aria-selected={activeIndex === index}
            onClick={() => onSelect(index)}
          >
            <span
              className="menu-gallery-card-bg"
              style={
                {
                  "--menu-gallery-artwork": `url("${item.artwork}")`,
                  "--menu-gallery-position": item.position,
                } as CSSProperties
              }
            />
            <span className="menu-gallery-card-overlay" />
            <span className="menu-gallery-card-content">
              <span className="menu-gallery-card-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="menu-gallery-card-title">{item.title}</span>
            </span>
            <span className="menu-gallery-card-shimmer" aria-hidden="true" />
          </button>
        ))}
      </div>
    </div>
  );
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuFocusIndex, setMenuFocusIndex] = useState(0);
  const [menuSelectedIndex, setMenuSelectedIndex] = useState(0);
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
  const menuMotionRef = useRef<HTMLDivElement>(null);
  const menuDetailsRef = useRef<HTMLDivElement>(null);
  const menuSelectorRef = useRef<HTMLDivElement>(null);
  const menuTrackRef = useRef<HTMLDivElement>(null);

  const pageIndex = useMemo(
    () => pages.findIndex((page) => page.id === activePage),
    [activePage],
  );

  const menuActiveItem =
    portfolioMenuItems[menuSelectedIndex] ?? portfolioMenuItems[0];

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

  const animateToMenuIndex = (nextIndex: number) => {
    const finalIndex = Math.max(0, Math.min(portfolioMenuItems.length - 1, nextIndex));
    setMenuSelectedIndex(finalIndex);
    setMenuFocusIndex(finalIndex);
  };

  const handleMenuEnter = () => {
    const nextItem = portfolioMenuItems[menuSelectedIndex];
    if (!nextItem) return;

    setActivePage(nextItem.id as PageId);
    closePortfolioMenu();
  };

  const openPortfolioMenu = () => {
    if (menuOpen) return;
    setMenuSelectedIndex(pageIndex);
    setMenuFocusIndex(pageIndex);
    setMenuOpen(true);
  };

  const closePortfolioMenu = () => {
    if (!menuOpen) return;
    const motion = menuMotionRef.current;
    const details = menuDetailsRef.current;
    const rail = menuSelectorRef.current;
    const cards = menuTrackRef.current?.querySelectorAll(".menu-gallery-card");

    if (!motion || !details || !rail) {
      setMenuOpen(false);
      return;
    }

    const timeline = gsap.timeline({
      onComplete: () => {
        setMenuOpen(false);
      },
    });

    timeline.to(details, {
      opacity: 0,
      x: -40,
      duration: 0.3,
      ease: "power2.in",
    });

    timeline.to(
      cards ?? [],
      {
        opacity: 0,
        y: 20,
        scale: 0.92,
        duration: 0.3,
        stagger: 0.03,
        ease: "power3.in",
      },
      0,
    );

    timeline.to(
      rail,
      {
        opacity: 0,
        x: 60,
        duration: 0.3,
        ease: "power2.in",
      },
      0,
    );

    timeline.to(
      ".portfolio-nav-overlay-backdrop",
      {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      },
      0,
    );
  };

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
      if (target.closest(".menu-gallery-track")) return "project";
      if (target.closest(".gallery-track")) return "project";
      if (target.closest(".gallery-cta")) return "cta";
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

  useEffect(() => {
    if (!menuOpen) {
      setMenuSelectedIndex(pageIndex);
      setMenuFocusIndex(pageIndex);
    }
  }, [menuOpen, pageIndex]);

  useEffect(() => {
    if (!menuOpen) return;

    const motion = menuMotionRef.current;
    const details = menuDetailsRef.current;
    const rail = menuSelectorRef.current;
    const cards = menuTrackRef.current?.querySelectorAll(".menu-gallery-card");

    if (!motion || !details || !rail) return;

    gsap.set(details, { opacity: 0, x: -40 });
    gsap.set(rail, { opacity: 0, x: 60 });
    gsap.set(cards ?? [], { opacity: 0, y: 30, scale: 0.92 });
    gsap.set(motion, { opacity: 1, x: 0, scale: 1 });
    gsap.set(".portfolio-nav-overlay-backdrop", { opacity: 0 });

    const timeline = gsap.timeline();
    timeline.to(".portfolio-nav-overlay-backdrop", {
      opacity: 1,
      duration: 0.35,
      ease: "power2.out",
    });
    timeline.to(
      rail,
      {
        opacity: 1,
        x: 0,
        duration: 0.55,
        ease: "power3.out",
      },
      0,
    );
    timeline.to(
      cards ?? [],
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.55,
        stagger: 0.07,
        ease: "back.out(1.5)",
      },
      0.06,
    );
    timeline.to(
      details,
      {
        opacity: 1,
        x: 0,
        duration: 0.55,
        ease: "power3.out",
      },
      0,
    );
    menuTrackRef.current?.focus({ preventScroll: true });
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    const details = menuDetailsRef.current;
    if (!details) return;

    const timeline = gsap.timeline();
    timeline.fromTo(
      details.querySelectorAll(
        ".portfolio-nav-label, .portfolio-nav-title, .portfolio-nav-subtitle, .portfolio-nav-meta, .portfolio-nav-enter, .portfolio-nav-helper",
      ),
      { opacity: 0, y: 12 },
      {
        opacity: 1,
        y: 0,
        duration: 0.42,
        stagger: 0.04,
        ease: "power3.out",
      },
    );
  }, [menuOpen, menuSelectedIndex]);

  useEffect(() => {
    if (!menuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closePortfolioMenu();
        return;
      }

      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        event.preventDefault();
        animateToMenuIndex((menuSelectedIndex + 1) % portfolioMenuItems.length);
        return;
      }

      if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        event.preventDefault();
        animateToMenuIndex(
          (menuSelectedIndex - 1 + portfolioMenuItems.length) % portfolioMenuItems.length,
        );
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        handleMenuEnter();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen, menuSelectedIndex]);

  useEffect(() => {
    if (!revealReady) return;

    const flickerInstances = FlickerText.autoInit();
    return () => {
      flickerInstances.forEach((instance) => instance.destroy());
    };
  }, [revealReady]);

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
        <>
          <button
            type="button"
            className="portfolio-menu-toggle"
            aria-label="Open circular portfolio navigation"
            aria-expanded={menuOpen}
            onClick={openPortfolioMenu}
          >
            <span className="portfolio-menu-lines" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>

          {menuOpen ? (
            <div
              className="portfolio-nav-overlay"
              aria-hidden={!menuOpen}
            >
              <div
                className="portfolio-nav-overlay-backdrop"
                onClick={closePortfolioMenu}
              />
              <div className="portfolio-nav-panel">
                <section className="portfolio-nav-stage">
                  <button
                    type="button"
                    className="portfolio-nav-close"
                    aria-label="Close circular navigation"
                    onClick={closePortfolioMenu}
                  >
                    &times;
                  </button>
                  <div className="portfolio-nav-motion" ref={menuMotionRef}>
                    <div
                      className="portfolio-nav-selector portfolio-nav-selector--inertia"
                      ref={menuSelectorRef}
                      aria-label="Navigation gallery"
                    >
                      <div className="portfolio-nav-rail-glow" aria-hidden="true" />
                      <PortfolioMenuGallery
                        items={portfolioMenuItems}
                        activeIndex={menuSelectedIndex}
                        onSelect={animateToMenuIndex}
                        onEnter={handleMenuEnter}
                        trackRef={menuTrackRef}
                      />
                    </div>
                    <div className="portfolio-nav-core portfolio-nav-core--inertia" ref={menuDetailsRef}>
                      <p className="portfolio-nav-label">Current selection</p>
                      <h2 className="portfolio-nav-title">{menuActiveItem.title}</h2>
                      <p className="portfolio-nav-subtitle">{menuActiveItem.subtitle}</p>
                      <div className="portfolio-nav-meta">
                        {String(menuSelectedIndex + 1).padStart(2, "0")} / {String(portfolioMenuItems.length).padStart(2, "0")}
                      </div>
                      <button
                        type="button"
                        className="portfolio-nav-enter"
                        onClick={handleMenuEnter}
                      >
                        {menuActiveItem.ctaLabel} <span aria-hidden="true">&rarr;</span>
                      </button>
                      <p className="portfolio-nav-helper">
                        Drag to spin the gallery, then press enter to step into that chapter.
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          ) : null}

        </>
      ) : null}

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
            <span
              className="headline-line flicker-text"
              data-stagger-child
              data-flicker-style="neon"
              data-flicker-speed="fast"
              data-flicker-repeat="false"
              data-flicker-delay="0"
            >
              Pranav&apos;s
            </span>
            <span
              className="headline-line accent-line flicker-text"
              data-stagger-child
              data-flicker-style="neon"
              data-flicker-speed="fast"
              data-flicker-repeat="false"
              data-flicker-delay="260"
            >
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
                <InertiaGallery
                  onViewProject={(index) => {
                    console.log("View project:", index);
                  }}
                />
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
