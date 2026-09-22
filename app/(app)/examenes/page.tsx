import { TabShell } from "@/components/layout/TabShell";
import { LotesList } from "@/components/domain/LotesList";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { getLotesConProgreso, getResumenGlobal } from "@/lib/queries/lotes";

export default async function ExamenesPage() {
  const lotes = await getLotesConProgreso();
  const resumen = await getResumenGlobal(lotes);

  return (
    <TabShell active="examenes">
      <section className="flex flex-col gap-1.5">
        <h1 className="font-headline-md text-headline-md text-on-surface">
          Campaña Periódica 2024
        </h1>
        <div className="flex items-center justify-between text-label-md font-label-md">
          <span className="text-on-surface-variant">
            {resumen.completados} de {resumen.trabajadores} completados
          </span>
          <span className="text-primary font-title">{resumen.progresoPct}%</span>
        </div>
        <ProgressBar pct={resumen.progresoPct} />
      </section>

      <LotesList lotes={lotes} />
    </TabShell>
  );
}
