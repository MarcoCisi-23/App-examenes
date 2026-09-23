import { TabShell } from "@/components/layout/TabShell";
import { LotesList } from "@/components/domain/LotesList";
import { getLotesConProgreso, getResumenGlobal } from "@/lib/queries/lotes";

export default async function ExamenesPage() {
  const lotes = await getLotesConProgreso();
  const resumen = await getResumenGlobal(lotes);

  return (
    <TabShell active="examenes">
      <section className="flex items-center justify-between gap-space-sm">
        <h1 className="font-headline-md text-headline-md text-on-surface">
          Campaña Periódica 2024
        </h1>
        <div className="flex flex-col items-end shrink-0">
          <span className="font-headline-sm text-headline-sm text-primary">
            {resumen.progresoPct}%
          </span>
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            {resumen.completados}/{resumen.trabajadores} completados
          </span>
        </div>
      </section>

      <LotesList lotes={lotes} />
    </TabShell>
  );
}
