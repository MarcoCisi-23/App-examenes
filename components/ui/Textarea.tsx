import { clsx } from "clsx";
import type { TextareaHTMLAttributes } from "react";

export function Textarea({
  label,
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }) {
  return (
    <label className="flex flex-col gap-1.5">
      {label && (
        <span className="font-label-lg text-label-lg text-on-surface">{label}</span>
      )}
      <textarea
        rows={4}
        className={clsx(
          "w-full px-space-md py-space-sm rounded-lg bg-surface-container-low text-on-surface font-body-lg text-body-lg placeholder:text-outline-variant focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary transition-colors resize-none",
          className,
        )}
        {...props}
      />
    </label>
  );
}
