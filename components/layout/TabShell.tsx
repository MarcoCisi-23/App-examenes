import { AppHeader } from "@/components/layout/AppHeader";

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
      <AppHeader subtitle={SUBTITLES[active]} active={active} />
      <main className="flex-1 pt-20 pb-space-xl px-margin-screen flex flex-col gap-space-md">
        {children}
      </main>
    </div>
  );
}
