import Link from "next/link";

export function DrilldownShell({
  title,
  backHref,
  footer,
  children,
}: {
  title: string;
  backHref: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh flex flex-col bg-surface">
      <header className="fixed top-0 left-0 right-0 z-30 pt-safe bg-surface-container-lowest/90 backdrop-blur border-b border-outline-variant/40">
        <div className="h-16 px-margin-screen flex items-center gap-space-sm">
          <Link
            href={backHref}
            aria-label="Volver"
            className="w-10 h-10 -ml-1 flex items-center justify-center rounded-full hover:bg-surface-container-low"
          >
            <span className="material-symbols-outlined text-on-surface text-[22px]">
              arrow_back
            </span>
          </Link>
          <h1 className="font-title text-title text-on-surface truncate">{title}</h1>
        </div>
      </header>
      <main
        className={`flex-1 pt-16 px-margin-screen flex flex-col gap-space-md ${
          footer ? "pb-32" : "pb-space-xl"
        }`}
      >
        {children}
      </main>
      {footer && (
        <div className="fixed bottom-0 left-0 right-0 z-30 pb-safe bg-surface-container-lowest/95 backdrop-blur border-t border-outline-variant/40 px-margin-screen py-space-sm flex flex-col gap-space-xs">
          {footer}
        </div>
      )}
    </div>
  );
}
