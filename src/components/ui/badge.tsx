import * as React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "danger" | "warning" | "neutral";
}

const variantClasses = {
  default: "bg-ansem-accent/20 text-ansem-accent border-ansem-accent/30",
  success: "bg-ansem-up/20 text-ansem-up border-ansem-up/30",
  danger: "bg-ansem-down/20 text-ansem-down border-ansem-down/30",
  warning: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  neutral: "bg-white/10 text-gray-300 border-white/10",
};

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
);
Badge.displayName = "Badge";

export { Badge };
