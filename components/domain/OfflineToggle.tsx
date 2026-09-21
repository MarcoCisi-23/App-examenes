"use client";

import { useState } from "react";
import { clsx } from "clsx";

export function OfflineToggle() {
  const [enabled, setEnabled] = useState(true);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => setEnabled((v) => !v)}
      className={clsx(
        "shrink-0 w-11 h-6 rounded-full transition-colors relative",
        enabled ? "bg-primary" : "bg-outline-variant",
      )}
    >
      <span
        className={clsx(
          "absolute top-0.5 w-5 h-5 rounded-full bg-surface-container-lowest transition-transform",
          enabled ? "translate-x-[22px]" : "translate-x-0.5",
        )}
      />
    </button>
  );
}
