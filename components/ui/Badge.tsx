import { clsx } from "clsx";

export function Badge({
  icon,
  children,
  className,
  pulse,
}: {
  icon?: string;
  children: React.ReactNode;
  className?: string;
  pulse?: boolean;
}) {
  return (
    <span
      className={clsx(
        "shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-label-sm text-label-sm",
        className,
      )}
    >
      {icon && (
        <span
          className={clsx(
            "material-symbols-outlined text-[14px]",
            pulse && "animate-pulse",
          )}
        >
          {icon}
        </span>
      )}
      {children}
    </span>
  );
}
