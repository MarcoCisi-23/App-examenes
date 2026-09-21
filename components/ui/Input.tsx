import { clsx } from "clsx";
import type { InputHTMLAttributes } from "react";

export function Input({
  label,
  unit,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label?: string; unit?: string }) {
  return (
    <label className="flex flex-col gap-1.5">
      {label && (
        <span className="font-label-lg text-label-lg text-on-surface">{label}</span>
      )}
      <div className="relative flex items-center">
        <input
          className={clsx(
            "w-full h-[48px] px-space-md rounded-lg bg-surface-container-low text-on-surface font-body-lg text-body-lg placeholder:text-outline-variant focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary transition-colors",
            unit && "pr-14",
            className,
          )}
          {...props}
        />
        {unit && (
          <span className="absolute right-space-md font-label-sm text-label-sm text-outline">
            {unit}
          </span>
        )}
      </div>
    </label>
  );
}
