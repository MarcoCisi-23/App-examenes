import { AppHeader } from "@/components/layout/AppHeader";
import { BottomTabBar } from "@/components/layout/BottomTabBar";

const SUBTITLES = {
  examenes: "Exámenes",
  realizados: "Realizados",
  perfil: "Mi Perfil",
} as const;

export function TabShell({
  active,
  children,
}: {
  active: keyof typeof SUBTITLES;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh flex flex-col bg-surface">
      <AppHeader subtitle={SUBTITLES[active]} />
      <main className="flex-1 pt-16 pb-24 px-margin-screen flex flex-col gap-space-md">
        {children}
      </main>
      <BottomTabBar active={active} />
    </div>
  );
}
