import { TabShell } from "@/components/layout/TabShell";
import { LotesList } from "@/components/domain/LotesList";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { getLotesConProgreso, getResumenGlobal } from "@/lib/queries/lotes";

export default async function ExamenesPage() {
  const lotes = await getLotesConProgreso();
  const resumen = await getResumenGlobal(lotes);
  const activos = lotes.filter((l) => l.estado !== "FINALIZADO").length;

  return (
    <TabShell active="examenes">
      <section className="flex flex-col bg-surface-container-lowest rounded-xl p-space-md shadow-card">
        <div className="flex items-center justify-between mb-space-xs">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary text-[22px]">
              health_and_safety
            </span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              Campaña Periódica 2024
            </h2>
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            {activos} Activos
          </span>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
          Seguimiento de cumplimiento de exámenes en nóminas con riesgos declarados.
        </p>

        <div className="flex flex-col gap-1.5 mb-space-md">
          <div className="flex justify-between items-center text-label-md font-label-md">
            <span className="text-on-surface-variant">Progreso Global del Plan</span>
            <span className="text-primary font-title">{resumen.progresoPct}%</span>
          </div>
          <ProgressBar
            pct={resumen.progresoPct}
            className="bg-gradient-to-r from-secondary-fixed-dim to-primary-container"
          />
        </div>

        <div className="grid grid-cols-3 gap-space-xs bg-surface-container-low rounded-lg p-space-sm text-center">
          <div className="flex flex-col items-center justify-center">
            <span className="font-headline-sm text-headline-sm text-on-surface">
              {resumen.trabajadores}
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Trabajadores
            </span>
          </div>
          <div className="flex flex-col items-center justify-center bg-surface-container-lowest rounded-md py-1 shadow-card">
            <span className="font-headline-sm text-headline-sm text-primary">
              {resumen.completados}
            </span>
            <span className="font-label-sm text-label-sm text-primary">
              Completados
            </span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <span className="font-headline-sm text-headline-sm text-on-tertiary-fixed-variant">
              {resumen.pendientes}
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Pendientes
            </span>
          </div>
        </div>
      </section>

      <LotesList lotes={lotes} />
    </TabShell>
  );
}
