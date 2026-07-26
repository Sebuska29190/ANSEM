import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref as React.Ref<HTMLButtonElement>}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ansem-accent disabled:opacity-50 disabled:pointer-events-none",
          variant === "default" &&
            "bg-ansem-accent text-white hover:bg-ansem-accent/90 shadow-lg shadow-ansem-accent/20",
          variant === "outline" &&
            "border border-white/10 bg-transparent hover:bg-white/10 text-foreground",
          variant === "ghost" && "hover:bg-white/10 text-foreground",
          size === "sm" && "h-8 px-3 text-sm",
          size === "md" && "h-10 px-4",
          size === "lg" && "h-12 px-6 text-lg",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
