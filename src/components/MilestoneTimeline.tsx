import { useCallback, useEffect, useRef, useState } from "react";
import { fetchGitHubRepos, repoToTimelineStep } from "../lib/github";

interface TimelineStep {
  id: string;
  year: string;
  label: string;
  emoji: string;
  description: string;
  tag: string;
  url: string;
  githubUrl: string;
  stars: number;
  topics: string[];
  createdAt: string;
}

const NODE_R = 24;
const NODE_SPACING = 160;
const ARC_HEIGHT = 48;
const TRACK_PADDING = 60;

export function MilestoneTimeline() {
  const [steps, setSteps] = useState<TimelineStep[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [prevIdx, setPrevIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hasEntered, setHasEntered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const sectionRef = useRef<HTMLElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetchGitHubRepos()
      .then((repos) => {
        setSteps(repos.map((repo, i) => repoToTimelineStep(repo, i)));
        setIsLoading(false);
      })
      .catch(() => {
        setSteps(FALLBACK_STEPS);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEntered(true);
        }
      },
      { threshold: 0.2 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const advance = useCallback(() => {
    setActiveIdx((prev) => {
      if (steps.length === 0) return 0;
      const next = (prev + 1) % steps.length;
      setPrevIdx(prev);
      return next;
    });
  }, [steps.length]);

  useEffect(() => {
    if (!isPlaying || steps.length < 2) return undefined;

    timerRef.current = setTimeout(advance, 3200);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [activeIdx, isPlaying, advance, steps.length]);

  const goTo = (idx: number) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setPrevIdx(activeIdx);
    setActiveIdx(idx);
    setIsPlaying(false);
  };

  const svgWidth =
    steps.length > 0
      ? TRACK_PADDING * 2 + (steps.length - 1) * NODE_SPACING
      : 600;
  const svgHeight = ARC_HEIGHT + NODE_R * 2 + 52;

  const nodeX = (i: number) => TRACK_PADDING + i * NODE_SPACING;
  const nodeY = svgHeight - NODE_R - 32;

  const arcPath = (i: number) => {
    const x1 = nodeX(i);
    const x2 = nodeX(i + 1);
    const y = nodeY;
    const cx = (x1 + x2) / 2;
    const cy = y - ARC_HEIGHT;
    return `M ${x1} ${y} Q ${cx} ${cy} ${x2} ${y}`;
  };

  const activeStep = steps[activeIdx];

  return (
    <section
      ref={sectionRef}
      className={`tl-section${hasEntered ? " is-visible" : ""}`}
    >
      <div className="tl-header">
        <span className="tl-eyebrow">github.com/Whauv</span>
        <h2 className="tl-title">Project Timeline</h2>
      </div>

      {isLoading ? (
        <div className="tl-loading-wrap">
          <div className="tl-loading-bar" />
          <p className="tl-loading-text">Loading from GitHub...</p>
        </div>
      ) : (
        <>
          <div className="tl-track-scroll">
            <div className="tl-track-inner" style={{ width: svgWidth }}>
              <svg
                className="tl-svg"
                width={svgWidth}
                height={svgHeight}
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                overflow="visible"
              >
                <defs>
                  <linearGradient id="arc-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(101,74,213,0.9)" />
                    <stop offset="100%" stopColor="rgba(200,169,110,0.95)" />
                  </linearGradient>
                  <filter id="node-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {steps.slice(0, -1).map((_, i) => {
                  const isFilled = i < activeIdx;
                  const isActiveArc = i === activeIdx - 1 && activeIdx !== prevIdx;

                  return (
                    <path
                      key={`arc-${i}`}
                      d={arcPath(i)}
                      fill="none"
                      stroke={isFilled ? "url(#arc-gradient)" : "rgba(255,255,255,0.1)"}
                      strokeWidth={isFilled ? 2 : 1.5}
                      strokeLinecap="round"
                      className={isActiveArc ? "tl-arc-active" : undefined}
                    />
                  );
                })}

                {steps.map((step, i) => {
                  const x = nodeX(i);
                  const y = nodeY;
                  const isActive = i === activeIdx;
                  const isPast = i < activeIdx;
                  const dateLabel = new Date(step.createdAt)
                    .toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })
                    .toUpperCase()
                    .replace(",", "");

                  return (
                    <g
                      key={`node-${step.id}`}
                      className={`tl-node-g${isActive ? " is-active" : ""}${isPast ? " is-past" : ""}`}
                      onClick={() => goTo(i)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          goTo(i);
                        }
                      }}
                      aria-label={`Open timeline step ${step.label}`}
                    >
                      {isActive ? (
                        <circle
                          cx={x}
                          cy={y}
                          r={NODE_R + 8}
                          fill="none"
                          stroke="rgba(200,169,110,0.2)"
                          strokeWidth="1"
                          className="tl-pulse-ring"
                        />
                      ) : null}

                      <circle
                        cx={x}
                        cy={y}
                        r={isActive ? NODE_R + 2 : NODE_R}
                        fill={
                          isActive
                            ? "rgba(200,169,110,0.15)"
                            : isPast
                              ? "rgba(200,169,110,0.07)"
                              : "rgba(14,8,32,0.9)"
                        }
                        stroke={
                          isActive
                            ? "rgba(200,169,110,0.85)"
                            : isPast
                              ? "rgba(200,169,110,0.35)"
                              : "rgba(255,255,255,0.15)"
                        }
                        strokeWidth={isActive ? 1.5 : 1}
                        filter={isActive ? "url(#node-glow)" : undefined}
                        className="tl-node-circle"
                      />

                      <text
                        x={x}
                        y={y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={isActive ? "18" : "15"}
                        className="tl-node-emoji"
                      >
                        {step.emoji}
                      </text>

                      <text
                        x={x}
                        y={y + NODE_R + 18}
                        textAnchor="middle"
                        className="tl-node-year"
                      >
                        {dateLabel}
                      </text>

                      <text
                        x={x}
                        y={y + NODE_R + 34}
                        textAnchor="middle"
                        className={`tl-node-label${isActive ? " is-active" : ""}`}
                      >
                        {step.label.length > 14 ? `${step.label.slice(0, 13)}…` : step.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {activeStep ? (
            <div className="tl-detail" key={activeStep.id}>
              <div className="tl-detail-inner">
                <div className="tl-detail-meta">
                  <span className="tl-detail-tag">{activeStep.tag}</span>
                  <span className="tl-detail-year">{activeStep.year}</span>
                </div>

                <h3 className="tl-detail-title">{activeStep.label}</h3>
                <p className="tl-detail-desc">{activeStep.description}</p>

                {activeStep.topics?.length > 0 ? (
                  <div className="tl-detail-topics">
                    {activeStep.topics.slice(0, 4).map((topic) => (
                      <span key={topic} className="tl-topic">
                        {topic}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className="tl-detail-links">
                  <a
                    href={activeStep.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tl-btn"
                    data-cursor="hover"
                  >
                    GitHub ↗
                  </a>
                  {activeStep.url !== activeStep.githubUrl && activeStep.url ? (
                    <a
                      href={activeStep.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tl-btn tl-btn--gold"
                      data-cursor="hover"
                    >
                      Live ↗
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}

          <div className="tl-controls">
            <button
              className="tl-ctrl-btn"
              onClick={() => goTo(Math.max(0, activeIdx - 1))}
              disabled={activeIdx === 0}
              aria-label="Previous step"
              data-cursor="hover"
            >
              ←
            </button>

            <button
              className={`tl-ctrl-play${isPlaying ? " is-playing" : ""}`}
              onClick={() => setIsPlaying((playing) => !playing)}
              aria-label={isPlaying ? "Pause" : "Play"}
              data-cursor="hover"
            >
              <span className="tl-ctrl-play-icon">{isPlaying ? "⏸" : "▶"}</span>
              <span>{isPlaying ? "Auto" : "Paused"}</span>
            </button>

            <button
              className="tl-ctrl-btn"
              onClick={() => goTo(Math.min(steps.length - 1, activeIdx + 1))}
              disabled={activeIdx === steps.length - 1}
              aria-label="Next step"
              data-cursor="hover"
            >
              →
            </button>
          </div>

          <p className="tl-counter">
            {steps.length === 0 ? 0 : activeIdx + 1} / {steps.length}
          </p>
        </>
      )}
    </section>
  );
}

const FALLBACK_STEPS: TimelineStep[] = [
  {
    id: "fb1",
    year: "2021",
    label: "2D Game",
    emoji: "🌱",
    description: "GitHub repository from the ongoing build journey.",
    tag: "Python",
    url: "https://github.com/Whauv",
    githubUrl: "https://github.com/Whauv",
    stars: 0,
    topics: [],
    createdAt: "2021-09-01",
  },
  {
    id: "fb2",
    year: "2022",
    label: "Senseworth",
    emoji: "⚙️",
    description: "A web classification tool to classify tweets into true or false with accuracy.",
    tag: "React",
    url: "https://github.com/Whauv",
    githubUrl: "https://github.com/Whauv",
    stars: 0,
    topics: [],
    createdAt: "2022-09-01",
  },
  {
    id: "fb3",
    year: "2023",
    label: "Third Eye",
    emoji: "📷",
    description: "Suspicious activity detecting camera using Python, OpenCV and numpy.",
    tag: "Python",
    url: "https://github.com/Whauv",
    githubUrl: "https://github.com/Whauv",
    stars: 0,
    topics: [],
    createdAt: "2023-04-01",
  },
  {
    id: "fb4",
    year: "2023",
    label: "Portfolio",
    emoji: "✨",
    description: "Personal portfolio — React, TypeScript, WebGL particles, spring physics.",
    tag: "TypeScript",
    url: "https://github.com/Whauv",
    githubUrl: "https://github.com/Whauv",
    stars: 0,
    topics: ["react", "typescript", "vite"],
    createdAt: "2023-06-01",
  },
];
