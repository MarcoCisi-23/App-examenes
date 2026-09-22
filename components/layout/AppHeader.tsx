import Image from "next/image";

export function AppHeader({ subtitle }: { subtitle: string }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 pt-safe bg-surface-container-lowest/90 backdrop-blur border-b border-outline-variant/40">
      <div className="h-16 px-margin-screen flex items-center justify-between">
        <div className="flex items-center gap-space-sm">
          <Image
            src="/icons/mark.png"
            alt="Andina ART"
            width={36}
            height={36}
            unoptimized
            className="rounded-lg"
          />
          <div className="flex flex-col leading-tight">
            <span className="font-title text-title text-on-surface">
              Andina ART
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              {subtitle}
            </span>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Activo
        </span>
      </div>
    </header>
  );
}
