"use client";

import { clsx } from "clsx";

export function BottomSheet({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className={clsx(
        "fixed inset-0 z-50 transition-opacity",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      )}
      aria-hidden={!open}
    >
      <div
        className="absolute inset-0 bg-inverse-surface/40"
        onClick={onClose}
      />
      <div
        className={clsx(
          "absolute bottom-0 left-0 right-0 max-h-[85dvh] overflow-y-auto rounded-t-xl bg-surface-container-lowest shadow-modal pb-safe transition-transform duration-300",
          open ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="flex justify-center pt-space-sm">
          <div className="w-10 h-1.5 rounded-full bg-outline-variant" />
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-space-sm top-space-sm w-9 h-9 flex items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
        <div className="p-space-lg">{children}</div>
      </div>
    </div>
  );
}
