import {
  forwardRef,
  type Ref,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-brand-red to-brand-orange text-white shadow-[0_10px_30px_rgba(190,20,34,0.45)] hover:translate-y-[-1px] hover:shadow-[0_14px_35px_rgba(190,20,34,0.52)]",
  secondary:
    "border border-white/25 bg-white/10 text-white backdrop-blur-md hover:bg-white/15 dark:border-white/15 dark:bg-black/20",
  ghost:
    "border border-foreground/10 bg-transparent text-foreground hover:bg-foreground/5",
};

const baseClass =
  "relative inline-flex items-center justify-center overflow-hidden rounded-full px-6 py-3 text-sm font-semibold tracking-wide transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70";

export type ButtonProps =
  | (ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined; variant?: ButtonVariant })
  | (AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; variant?: ButtonVariant });

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    const styles = cn(baseClass, variantClass[variant], className);
    if ("href" in props && typeof props.href === "string") {
      const { href, children, ...anchorRest } = props;
      return (
        <a ref={ref as Ref<HTMLAnchorElement>} href={href} className={styles} {...anchorRest}>
          {children}
        </a>
      );
    }
    const { children, ...buttonRest } = props as ButtonHTMLAttributes<HTMLButtonElement>;
    return (
      <button ref={ref as Ref<HTMLButtonElement>} className={styles} type="button" {...buttonRest}>
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
