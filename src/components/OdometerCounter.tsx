import { useEffect, useRef, useState } from "react";
import { OdometerDigit } from "./OdometerDigit";

interface OdometerCounterProps {
  value: number;
  from?: number;
  duration?: number;
  fontSize?: number;
  color?: string;
  prefix?: string;
  suffix?: string;
  separator?: boolean;
  trigger?: "onAppear" | "onScroll" | "inView";
  className?: string;
}

export function OdometerCounter({
  value,
  from = 0,
  duration = 2200,
  fontSize = 48,
  color = "rgba(200, 169, 110, 0.95)",
  prefix = "",
  suffix = "",
  separator = true,
  trigger = "inView",
  className = "",
}: OdometerCounterProps) {
  const [displayValue, setDisplayValue] = useState(from);
  const [prevValue, setPrevValue] = useState(from);
  const [hasTriggered, setHasTriggered] = useState(trigger === "onAppear");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (trigger !== "inView" || hasTriggered) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasTriggered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [trigger, hasTriggered]);

  useEffect(() => {
    if (!hasTriggered) return;
    setPrevValue(displayValue);
    setDisplayValue(value);
  }, [value, hasTriggered]);

  const formatNumber = (n: number) =>
    separator ? Math.floor(n).toLocaleString("en-US") : String(Math.floor(n));

  const toDigitArray = (numStr: string) =>
    numStr.split("").map((ch) => ({
      char: ch,
      isDigit: /\d/.test(ch),
      value: /\d/.test(ch) ? Number.parseInt(ch, 10) : -1,
    }));

  const currentStr = formatNumber(displayValue);
  const prevStr = formatNumber(prevValue);
  const maxLen = Math.max(currentStr.length, prevStr.length);
  const paddedCurrent = currentStr.padStart(maxLen, "0");
  const paddedPrev = prevStr.padStart(maxLen, "0");
  const currentDigits = toDigitArray(paddedCurrent);
  const totalDigits = currentDigits.filter((digit) => digit.isDigit).length;
  let digitIndex = 0;

  const getDigitDuration = (currentDigitIndex: number, allDigits: number) => {
    const position = allDigits - 1 - currentDigitIndex;
    const speedFactor = 0.6 + (position / (allDigits - 1 || 1)) * 0.4;
    return duration * speedFactor;
  };

  return (
    <div
      ref={containerRef}
      className={`odometer-counter ${className}`}
      role="status"
      aria-live="polite"
      aria-label={`${prefix}${formatNumber(value)}${suffix}`}
    >
      {prefix ? <span className="odometer-prefix">{prefix}</span> : null}
      <div className="odometer-housing">
        <div className="odometer-housing-inner">
          <div className="odometer-digits-row">
            {currentDigits.map((digit, i) => {
              if (!digit.isDigit) {
                return (
                  <span key={`sep-${i}`} className="odometer-separator">
                    {digit.char}
                  </span>
                );
              }

              const currentDigitIndex = digitIndex++;
              const prevChar = paddedPrev[i] ?? "0";
              const prevDigitValue = /\d/.test(prevChar) ? Number.parseInt(prevChar, 10) : 0;

              return (
                <OdometerDigit
                  key={`digit-${i}`}
                  digit={digit.value}
                  prevDigit={prevDigitValue}
                  duration={getDigitDuration(currentDigitIndex, totalDigits)}
                  delay={0}
                  fontSize={fontSize}
                  color={color}
                />
              );
            })}
          </div>
        </div>
        <div className="odometer-glass" aria-hidden="true" />
      </div>
      {suffix ? <span className="odometer-suffix">{suffix}</span> : null}
    </div>
  );
}
