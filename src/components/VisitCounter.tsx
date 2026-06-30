import { useEffect, useRef, useState } from "react";
import { OdometerCounter } from "./OdometerCounter";
import { recordVisitAndGetCount, subscribeToVisits } from "../lib/supabase";

export function VisitCounter() {
  const [visitCount, setVisitCount] = useState<number | null>(null);
  const [hasAppeared, setHasAppeared] = useState(false);
  const hasRecorded = useRef(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAppeared(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );

    if (wrapRef.current) observer.observe(wrapRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (hasRecorded.current) return;
    hasRecorded.current = true;

    recordVisitAndGetCount().then((count) => {
      setVisitCount(Math.max(count, 1200));
    });

    const channel = subscribeToVisits((count) => {
      setVisitCount(Math.max(count, 1200));
    });

    return () => {
      void channel.unsubscribe();
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className={`visit-counter-wrap${hasAppeared ? " is-visible" : ""}`}
    >
      <div className="visit-counter-glow" aria-hidden="true" />
      <div className="visit-counter-rule" aria-hidden="true" />
      <div className="visit-counter-label">
        <span className="visit-counter-eyebrow">Total Visits</span>
        <span className="visit-live-dot" aria-label="Live counter" title="Updates in real time" />
      </div>
      {visitCount !== null ? (
        <OdometerCounter
          value={visitCount}
          from={Math.max(0, visitCount - 80)}
          duration={2400}
          fontSize={72}
          color="rgba(200, 169, 110, 1)"
          separator
          trigger="inView"
          className="visit-odometer"
        />
      ) : (
        <div className="visit-counter-skeleton">
          <span className="skeleton-shimmer">-</span>
        </div>
      )}
      <p className="visit-counter-sub">and counting</p>
      <div className="visit-counter-rule" aria-hidden="true" />
    </div>
  );
}
