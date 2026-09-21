"use client";

import { clsx } from "clsx";

export function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "shrink-0 px-3.5 py-2 rounded-full font-label-md text-label-md flex items-center gap-1.5 transition-transform active:scale-95",
        active
          ? "bg-primary text-on-primary shadow-sm"
          : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest",
      )}
    >
      {children}
    </button>
  );
}
