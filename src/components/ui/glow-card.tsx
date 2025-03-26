
import * as React from "react";
import { VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const glowCardVariants = cva(
  "relative rounded-lg p-5 transition-all duration-300 overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-cyber-muted border border-cyber-border hover:border-cyber-primary/50 hover:shadow-neon",
        destructive: "bg-cyber-muted border border-cyber-destructive/50 hover:border-cyber-destructive hover:shadow-neonRed",
        success: "bg-cyber-muted border border-cyber-secondary/50 hover:border-cyber-secondary hover:shadow-neonGreen",
        glass: "cyber-glass border border-cyber-border/20 hover:border-cyber-primary/30",
      },
      animation: {
        none: "",
        glow: "before:content-[''] before:absolute before:inset-0 before:z-[-1] before:bg-cyber-primary before:opacity-0 before:blur-xl hover:before:opacity-20 before:transition-opacity before:duration-500",
        pulse: "animate-pulse-neon",
        scanline: "after:content-[''] after:absolute after:inset-x-0 after:h-[2px] after:bg-cyber-primary after:opacity-20 after:animate-scan-line",
      },
    },
    defaultVariants: {
      variant: "default",
      animation: "none",
    },
  }
);

export interface GlowCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glowCardVariants> {}

const GlowCard = React.forwardRef<HTMLDivElement, GlowCardProps>(
  ({ className, variant, animation, ...props }, ref) => {
    return (
      <div
        className={cn(glowCardVariants({ variant, animation, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
GlowCard.displayName = "GlowCard";

export { GlowCard, glowCardVariants };
