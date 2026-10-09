import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-ink text-paper hover:bg-marigold hover:text-ink",
  secondary:
    "bg-transparent text-ink border border-ink hover:bg-ink hover:text-paper",
  ghost: "bg-transparent text-ink hover:bg-mist",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-tag font-sans font-medium tracking-wide transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none";

/**
 * Returns the button's class string without rendering an element.
 * Use this on next/link's <Link> directly (Link already renders its
 * own <a>, so nesting ButtonLink's <a> inside it would produce
 * invalid nested anchors).
 */
export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string
) {
  return cn(base, variantClasses[variant], sizeClasses[size], className);
}

/**
 * Polymorphic-lite Button: renders a <button> by default, or an <a>
 * when an `href` is passed (via ButtonLink below). Kept simple on
 * purpose — no full polymorphic typing since this project only needs
 * these two shapes.
 */
export const Button = forwardRef<
  HTMLButtonElement,
  ButtonBaseProps & React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ variant = "primary", size = "md", className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(base, variantClasses[variant], sizeClasses[size], className)}
    {...props}
  />
));
Button.displayName = "Button";

export const ButtonLink = forwardRef<
  HTMLAnchorElement,
  ButtonBaseProps & React.AnchorHTMLAttributes<HTMLAnchorElement>
>(({ variant = "primary", size = "md", className, ...props }, ref) => (
  <a
    ref={ref}
    className={cn(base, variantClasses[variant], sizeClasses[size], className)}
    {...props}
  />
));
ButtonLink.displayName = "ButtonLink";
