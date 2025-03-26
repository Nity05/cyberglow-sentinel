
import * as React from "react";
import { VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center whitespace-nowrap rounded font-medium transition-all focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border border-cyber-primary text-cyber-primary hover:bg-cyber-primary/10 hover:shadow-neon",
        destructive: "border border-cyber-destructive text-cyber-destructive hover:bg-cyber-destructive/10 hover:shadow-neonRed",
        success: "border border-cyber-secondary text-cyber-secondary hover:bg-cyber-secondary/10 hover:shadow-neonGreen",
        outline: "border border-cyber-border bg-transparent hover:border-cyber-primary hover:text-cyber-primary",
        ghost: "hover:bg-cyber-muted/50",
        link: "text-cyber-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-8 px-4 text-sm",
        lg: "h-12 px-8",
        icon: "h-9 w-9",
      },
      animation: {
        none: "",
        pulse: "animate-pulse-neon",
        glow: "after:content-[''] after:absolute after:inset-0 after:z-[-1] after:bg-gradient-to-r after:from-cyber-primary/0 after:via-cyber-primary/30 after:to-cyber-primary/0 after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-500",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "none",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const ButtonGlow = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, animation, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, animation, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
ButtonGlow.displayName = "ButtonGlow";

export { ButtonGlow, buttonVariants };
