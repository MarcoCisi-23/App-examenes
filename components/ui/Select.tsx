import { clsx } from "clsx";
import type { SelectHTMLAttributes } from "react";

export function Select({
  label,
  options,
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex flex-col gap-1.5">
      {label && (
        <span className="font-label-lg text-label-lg text-on-surface">{label}</span>
      )}
      <select
        className={clsx(
          "w-full h-[48px] px-space-md rounded-lg bg-surface-container-low text-on-surface font-body-lg text-body-lg focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary transition-colors",
          className,
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
