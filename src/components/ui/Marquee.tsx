"use client";

/**
 * Marquee — infinite horizontal scrolling strip.
 * Renders children twice side-by-side so the loop is seamless.
 * Respects prefers-reduced-motion (handled in globals.css).
 */
export function Marquee({
  children,
  speedSeconds = 60,
  reverse = false,
  className = "",
}: {
  children: React.ReactNode;
  speedSeconds?: number;
  reverse?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`relative flex w-full overflow-hidden ${className}`}
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
      }}
    >
      <div
        className="flex shrink-0 animate-ticker-scroll gap-8 pr-8"
        style={{
          animationDuration: `${speedSeconds}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {children}
      </div>
      <div
        className="flex shrink-0 animate-ticker-scroll gap-8 pr-8"
        style={{
          animationDuration: `${speedSeconds}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
        aria-hidden
      >
        {children}
      </div>
    </div>
  );
}
