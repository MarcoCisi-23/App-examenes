import Image from "next/image";
import { NavDrawer } from "@/components/layout/NavDrawer";

export function AppHeader({
  subtitle,
  active,
}: {
  subtitle: string;
  active: "examenes" | "realizados" | "perfil";
}) {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 pt-safe bg-surface-container-lowest/90 backdrop-blur border-b border-outline-variant/40">
      <div className="h-16 px-margin-screen flex items-center justify-between">
        <div className="flex items-center gap-space-sm min-w-0">
          <Image
            src="/icons/mark.png"
            alt="Andina ART"
            width={36}
            height={36}
            unoptimized
            className="rounded-lg shrink-0"
          />
          <div className="flex flex-col leading-tight min-w-0">
            <span className="font-title text-title text-on-surface">
              Andina ART
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              {subtitle}
            </span>
          </div>
        </div>
        <NavDrawer active={active} />
      </div>
    </header>
  );
}
