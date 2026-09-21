import { clsx } from "clsx";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "destructive" | "ghost";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-primary-container text-on-primary shadow-sm active:bg-primary disabled:opacity-60",
  secondary:
    "bg-surface-container-high text-on-surface hover:bg-surface-container-highest",
  destructive: "bg-error-container text-on-error-container",
  ghost: "bg-transparent text-primary hover:bg-surface-container-low",
};

export function Button({
  variant = "primary",
  icon,
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  icon?: string;
}) {
  return (
    <button
      className={clsx(
        "min-h-touch-target-min px-space-md rounded-xl flex items-center justify-center gap-2 font-label-lg text-label-lg transition-all active:scale-[0.99]",
        VARIANT_CLASSES[variant],
        className,
      )}
      {...props}
    >
      {icon && <span className="material-symbols-outlined text-[20px]">{icon}</span>}
      {children}
    </button>
  );
}
