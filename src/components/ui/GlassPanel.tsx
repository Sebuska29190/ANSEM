import { cn } from "@/lib/utils";

/**
 * GlassPanel — premium glass surface used everywhere.
 * Variants:
 *   - default : black glass with hairline border
 *   - ember   : subtle ember edge tint
 *   - gold    : subtle gold edge tint
 *   - embed   : for chart / TradingView frames
 */
export function GlassPanel({
  children,
  variant = "default",
  className,
  as: Cmp = "div",
}: {
  children: React.ReactNode;
  variant?: "default" | "ember" | "gold" | "embed";
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}) {
  const variantCls = {
    default: "glass-panel",
    ember:   "border-gradient shadow-ember-sm",
    gold:    "glass-panel border border-gold/30 shadow-gold",
    embed:   "glass-deep overflow-hidden",
  }[variant];

  return <Cmp className={cn("rounded-2xl", variantCls, className)}>{children}</Cmp>;
}

/** Section eyebrow caption (e.g. "01 · Live On-Chain"). */
export function Eyebrow({
  index,
  label,
  accent = "ember",
}: {
  index: string;
  label: string;
  accent?: "ember" | "gold";
}) {
  const color = accent === "gold" ? "text-gold" : "text-ember";
  return (
    <div className="mb-4 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.25em]">
      <span className={`font-mono ${color}`}>{index}</span>
      <span className="h-px w-8 bg-white/10" />
      <span className="text-dim">{label}</span>
    </div>
  );
}
