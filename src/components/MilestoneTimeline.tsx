import { useEffect, useRef, useState } from "react";
import {
  FALLBACK_TIMELINE_STEPS,
  fetchGitHubTimelineSteps,
  type TimelineStep,
} from "../lib/github";

const NODE_RADIUS = 18;
const ACTIVE_NODE_RADIUS = 24;
const STEP_GAP = 132;
const TRACK_PADDING = 72;
const ARC_RISE = 22;
const LABEL_YEAR_OFFSET = 22;
const LABEL_NAME_OFFSET = 38;

export function MilestoneTimeline() {
  const [steps, setSteps] = useState<TimelineStep[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hasEntered, setHasEntered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const sectionRef = useRef<HTMLElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let isMounted = true;

    void fetchGitHubTimelineSteps()
      .then((nextSteps) => {
        if (!isMounted) return;
        setSteps(nextSteps.length > 0 ? nextSteps : FALLBACK_TIMELINE_STEPS);
        setIsLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setSteps(FALLBACK_TIMELINE_STEPS);
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
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

    const section = sectionRef.current;
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isPlaying || steps.length < 2) {
      return undefined;
    }

    timerRef.current = setTimeout(() => {
      setActiveIndex((currentIndex) => {
        const nextIndex = (currentIndex + 1) % steps.length;
        setPreviousIndex(currentIndex);
        return nextIndex;
      });
    }, 3200);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [activeIndex, isPlaying, steps.length]);

  const activateStep = (nextIndex: number) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setPreviousIndex(activeIndex);
    setActiveIndex(nextIndex);
    setIsPlaying(false);
  };

  const handlePrevious = () => {
    if (steps.length === 0) return;
    const nextIndex = (activeIndex - 1 + steps.length) % steps.length;
    activateStep(nextIndex);
  };

  const handleNext = () => {
    if (steps.length === 0) return;
    const nextIndex = (activeIndex + 1) % steps.length;
    activateStep(nextIndex);
  };

  const trackWidth =
    TRACK_PADDING * 2 + Math.max(0, steps.length - 1) * STEP_GAP;
  const trackHeight = 110;
  const baselineY = 44;

  const nodeX = (i: number) => TRACK_PADDING + i * STEP_GAP;

  const arcPath = (i: number) => {
    const x1 = nodeX(i);
    const x2 = nodeX(i + 1);
    const mid = (x1 + x2) / 2;
    return `M ${x1} ${baselineY} Q ${mid} ${baselineY - ARC_RISE} ${x2} ${baselineY}`;
  };

  const activeStep = steps[activeIndex];

  return (
    <section
      ref={sectionRef}
      className={`mtl-section${hasEntered ? " is-visible" : ""}`}
    >
      <div className="mtl-header">
        <span className="mtl-eyebrow">github.com/Whauv</span>
        <h2 className="mtl-title">Project Timeline</h2>
      </div>

      {isLoading ? (
        <div className="mtl-loading">
          <div className="mtl-loading-line" />
          <p className="mtl-loading-text">Loading timeline…</p>
        </div>
      ) : activeStep ? (
        <>
          <div className="mtl-track-wrap">
            <div className="mtl-track-scroll">
              <div className="mtl-track-inner" style={{ width: trackWidth }}>
                <svg
                  className="mtl-svg"
                  width={trackWidth}
                  height={trackHeight}
                  viewBox={`0 0 ${trackWidth} ${trackHeight}`}
                >
                  <defs>
                    <filter
                      id="mtl-node-glow"
                      x="-120%"
                      y="-120%"
                      width="340%"
                      height="340%"
                    >
                      <feGaussianBlur in="SourceGraphic" stdDeviation="4.5" result="blur" />
                      <feColorMatrix
                        in="blur"
                        type="matrix"
                        values="1 0 0 0 0  0.8 0 0 0 0  0.35 0 0 0 0  0 0 0 1 0"
                        result="glow"
                      />
                      <feMerge>
                        <feMergeNode in="glow" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {steps.slice(0, -1).map((_, i) => {
                    const isPastArc = i < activeIndex;
                    const isActiveIncomingArc =
                      i === activeIndex - 1 && activeIndex !== previousIndex;

                    return (
                      <path
                        key={`arc-${steps[i]?.id ?? i}`}
                        d={arcPath(i)}
                        fill="none"
                        stroke={
                          isPastArc
                            ? "rgba(200,169,110,0.7)"
                            : "rgba(255,255,255,0.12)"
                        }
                        strokeWidth={isPastArc ? 1.9 : 1.25}
                        strokeLinecap="round"
                        className={isActiveIncomingArc ? "mtl-arc-active" : undefined}
                      />
                    );
                  })}

                  {steps.map((step, index) => {
                    const x = nodeX(index);
                    const isActive = index === activeIndex;
                    const isPast = index < activeIndex;
                    const yearLabel = new Date(step.createdAt)
                      .toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })
                      .toUpperCase()
                      .replace(",", "");

                    return (
                      <g
                        key={step.id}
                        onClick={() => activateStep(index)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            activateStep(index);
                          }
                        }}
                        role="button"
                        tabIndex={0}
                        aria-label={`Open timeline step ${step.label}`}
                        aria-current={isActive ? "true" : undefined}
                        data-cursor="hover"
                      >
                        {isActive ? (
                          <circle
                            className="mtl-pulse-ring"
                            cx={x}
                            cy={baselineY}
                            r={ACTIVE_NODE_RADIUS + 6}
                            fill="none"
                            stroke="rgba(200,169,110,0.22)"
                            strokeWidth="1"
                          />
                        ) : null}

                        <circle
                          className="mtl-node-circle"
                          cx={x}
                          cy={baselineY}
                          r={isActive ? ACTIVE_NODE_RADIUS : NODE_RADIUS}
                          fill={
                            isActive
                              ? "rgba(200,169,110,0.18)"
                              : isPast
                                ? "rgba(200,169,110,0.08)"
                                : "rgba(8,6,18,0.42)"
                          }
                          stroke={
                            isActive
                              ? "rgba(200,169,110,1)"
                              : isPast
                                ? "rgba(200,169,110,0.42)"
                                : "rgba(255,255,255,0.18)"
                          }
                          strokeWidth={isActive ? 1.8 : 1.2}
                          filter={isActive ? "url(#mtl-node-glow)" : undefined}
                        />

                        <text
                          x={x}
                          y={baselineY}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fontSize={isActive ? "15" : "13"}
                        >
                          {step.emoji}
                        </text>

                        <text
                          x={x}
                          y={baselineY + LABEL_YEAR_OFFSET}
                          textAnchor="middle"
                          className="mtl-year"
                        >
                          {yearLabel}
                        </text>

                        <text
                          x={x}
                          y={baselineY + LABEL_NAME_OFFSET}
                          textAnchor="middle"
                          className={`mtl-name${isActive ? " is-active" : ""}`}
                        >
                          {step.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
          </div>

          <div key={activeStep.id} className="mtl-detail">
            <div className="mtl-detail-panel">
              <div className="mtl-detail-meta">
                <span className="mtl-chip">{activeStep.tag}</span>
                <span className="mtl-chip mtl-chip--muted">{activeStep.year}</span>
              </div>

              <h3 className="mtl-detail-title">{activeStep.label}</h3>
              <div className="mtl-detail-summary-block" aria-live="polite">
                <span className="mtl-detail-summary-label">Project overview</span>
                <p className="mtl-detail-desc">{activeStep.description}</p>
              </div>

              {activeStep.topics?.length > 0 ? (
                <div className="mtl-topics">
                  {activeStep.topics.slice(0, 4).map((topic) => (
                    <span key={topic} className="mtl-topic">
                      {topic}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="mtl-actions">
                <a
                  className="mtl-btn"
                  href={activeStep.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="hover"
                >
                  GitHub ↗
                </a>
                {activeStep.url !== activeStep.githubUrl ? (
                  <a
                    className="mtl-btn mtl-btn--accent"
                    href={activeStep.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="hover"
                  >
                    Live ↗
                  </a>
                ) : null}
              </div>
            </div>
          </div>

          <div className="mtl-controls">
            <button
              className="mtl-icon-btn"
              onClick={handlePrevious}
              aria-label="Previous step"
              type="button"
              data-cursor="hover"
            >
              ←
            </button>
            <button
              className={`mtl-auto${isPlaying ? " is-playing" : ""}`}
              onClick={() => setIsPlaying((playing) => !playing)}
              aria-pressed={isPlaying}
              aria-label={isPlaying ? "Pause" : "Play"}
              type="button"
              data-cursor="hover"
            >
              <span>{isPlaying ? "⏸" : "▶"}</span>
              <span>Auto</span>
            </button>
            <button
              className="mtl-icon-btn"
              onClick={handleNext}
              aria-label="Next step"
              type="button"
              data-cursor="hover"
            >
              →
            </button>
          </div>

          <p className="mtl-counter">
            {activeIndex + 1} / {steps.length}
          </p>
        </>
      ) : null}
    </section>
  );
}
