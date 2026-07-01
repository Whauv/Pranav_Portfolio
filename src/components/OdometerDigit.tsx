import { useEffect, useRef, useState } from "react";

interface OdometerDigitProps {
  digit: number;
  prevDigit: number;
  duration: number;
  delay: number;
  fontSize: number;
  color: string;
}

export function OdometerDigit({
  digit,
  prevDigit,
  duration,
  delay,
  fontSize,
  color,
}: OdometerDigitProps) {
  const stripRef = useRef<HTMLDivElement>(null);
  const [, setIsAnimating] = useState(false);
  const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  useEffect(() => {
    if (!stripRef.current) return;

    const cellHeight = fontSize * 1.2;
    const windowHeight = cellHeight * 1.6;
    const centerOffset = (windowHeight - cellHeight) / 2;
    const fromY = centerOffset - prevDigit * cellHeight;
    const toY = centerOffset - (digit + 10) * cellHeight;

    stripRef.current.style.transition = "none";
    stripRef.current.style.transform = `translateY(${fromY}px)`;
    void stripRef.current.offsetHeight;

    setIsAnimating(true);
    stripRef.current.style.transition = `transform ${duration}ms cubic-bezier(0.25, 0.1, 0.25, 1) ${delay}ms`;
    stripRef.current.style.transform = `translateY(${toY}px)`;

    const resetTimer = window.setTimeout(() => {
      if (!stripRef.current) return;
      stripRef.current.style.transition = "none";
      stripRef.current.style.transform = `translateY(${centerOffset - digit * cellHeight}px)`;
      setIsAnimating(false);
    }, duration + delay + 50);

    return () => window.clearTimeout(resetTimer);
  }, [digit, prevDigit, duration, delay, fontSize]);

  const cellHeight = fontSize * 1.2;
  const windowHeight = cellHeight * 1.6;
  const centerOffset = (windowHeight - cellHeight) / 2;

  return (
    <div className="odometer-digit-slot">
      <div
        className="odometer-digit-window"
        style={{
          height: `${windowHeight}px`,
          overflow: "hidden",
          position: "relative",
          maskImage: `linear-gradient(
            to bottom,
            transparent 0%,
            rgba(0,0,0,0.1) 8%,
            rgba(0,0,0,0.7) 18%,
            rgba(0,0,0,1) 28%,
            rgba(0,0,0,1) 72%,
            rgba(0,0,0,0.7) 82%,
            rgba(0,0,0,0.1) 92%,
            transparent 100%
          )`,
          WebkitMaskImage: `linear-gradient(
            to bottom,
            transparent 0%,
            rgba(0,0,0,0.1) 8%,
            rgba(0,0,0,0.7) 18%,
            rgba(0,0,0,1) 28%,
            rgba(0,0,0,1) 72%,
            rgba(0,0,0,0.7) 82%,
            rgba(0,0,0,0.1) 92%,
            transparent 100%
          )`,
        }}
      >
        <div
          ref={stripRef}
          className="odometer-digit-strip"
          style={{
            display: "flex",
            flexDirection: "column",
            transform: `translateY(${centerOffset - digit * cellHeight}px)`,
            willChange: "transform",
          }}
        >
          {digits.map((value, i) => (
            <div
              key={i}
              className="odometer-digit-cell"
              style={{
                height: `${cellHeight}px`,
                lineHeight: `${cellHeight}px`,
                fontSize: `${fontSize}px`,
                color,
                fontFamily: "var(--display)",
                fontVariantNumeric: "tabular-nums",
                fontFeatureSettings: '"tnum"',
                fontWeight: "300",
                letterSpacing: "-0.03em",
                textAlign: "center",
                width: `${fontSize * 0.62}px`,
                flexShrink: 0,
              }}
            >
              {value}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
