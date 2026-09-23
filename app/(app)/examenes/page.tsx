import { TabShell } from "@/components/layout/TabShell";
import { LotesList } from "@/components/domain/LotesList";
import { getLotesConProgreso } from "@/lib/queries/lotes";

export default async function ExamenesPage() {
  const lotes = await getLotesConProgreso();

  return (
    <TabShell active="examenes">
      <h1 className="font-headline-lg text-headline-lg text-on-surface text-center">
        Exámenes
      </h1>

      <LotesList lotes={lotes} />
    </TabShell>
  );
}
