import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * Panel — solid terminal surface. No glassmorphism, no blur.
 * Sharp corners, hairline border, top highlight, optional hover glow.
 */
interface PanelProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "ember" | "gold";
  interactive?: boolean;
}

export const Panel = forwardRef<HTMLDivElement, PanelProps>(
  ({ className, variant = "default", interactive = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative rounded-[2px] border border-line bg-panel shadow-inset",
        variant === "ember" && "border-ember/30",
        variant === "gold" && "border-gold/25",
        interactive &&
          "transition-all duration-200 hover:-translate-y-px hover:border-ember/40 hover:shadow-ember-sm",
        className
      )}
      {...props}
    />
  )
);
Panel.displayName = "Panel";

/**
 * SectionHeader — "01 / MARKET" style eyebrow with rule line.
 */
export function SectionHeader({
  index,
  label,
  right,
  className,
}: {
  index: string;
  label: string;
  right?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-6 flex items-center gap-4", className)}>
      <span className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-ember">
        {index}
      </span>
      <h2 className="font-display text-sm font-bold uppercase tracking-[0.15em] text-text">
        {label}
      </h2>
      <div className="h-px flex-1 bg-line" />
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}
