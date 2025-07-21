import * as React from "react"
import { motion, type HTMLMotionProps } from "framer-motion"

import { cn } from "@/lib/utils"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass' | 'gradient' | 'interactive';
  hover?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hover = false, ...props }, ref) => {
    const baseClasses = "rounded-xl border text-card-foreground transition-all duration-300";

    const variantClasses = {
      default: "bg-card shadow-sm border-border",
      elevated: "bg-white shadow-lg hover:shadow-xl border-gray-200/50",
      glass: "bg-white/80 backdrop-blur-xl shadow-lg border-white/20",
      gradient: "bg-gradient-to-br from-white to-gray-50 shadow-lg border-gray-200/50",
      interactive: "bg-white shadow-md hover:shadow-xl border-gray-200/50 cursor-pointer transform hover:scale-[1.02]"
    };

    const hoverClasses = hover ? "hover:shadow-xl hover:scale-[1.02] cursor-pointer" : "";

    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          hoverClasses,
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = "Card"

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'centered' | 'compact';
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variantClasses = {
      default: "flex flex-col space-y-1.5 p-6",
      centered: "flex flex-col items-center text-center space-y-2 p-6",
      compact: "flex flex-col space-y-1 p-4"
    };

    return (
      <div
        ref={ref}
        className={cn(variantClasses[variant], className)}
        {...props}
      />
    );
  }
);
CardHeader.displayName = "CardHeader"

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  variant?: 'default' | 'large' | 'gradient' | 'compact';
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, variant = 'default', as: Component = 'h3', ...props }, ref) => {
    const variantClasses = {
      default: "text-xl font-semibold leading-none tracking-tight text-gray-900",
      large: "text-2xl font-bold leading-tight tracking-tight text-gray-900",
      gradient: "text-xl font-semibold leading-none tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent",
      compact: "text-lg font-medium leading-none tracking-tight text-gray-900"
    };

    return (
      <Component
        ref={ref}
        className={cn(variantClasses[variant], className)}
        {...props}
      />
    );
  }
);
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
