import { clsx } from "clsx";

export function ProgressBar({
  pct,
  className,
  trackClassName,
}: {
  pct: number;
  className?: string;
  trackClassName?: string;
}) {
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <div
      className={clsx(
        "w-full h-2 rounded-full bg-surface-container overflow-hidden",
        trackClassName,
      )}
    >
      <div
        className={clsx("h-full rounded-full bg-primary-container", className)}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
