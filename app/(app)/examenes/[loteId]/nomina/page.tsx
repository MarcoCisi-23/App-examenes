import { notFound } from "next/navigation";
import { DrilldownShell } from "@/components/layout/DrilldownShell";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { RosterInteractive } from "@/components/domain/RosterInteractive";
import { getNominaDeLote } from "@/lib/queries/trabajadores";

export default async function NominaPage({
  params,
}: {
  params: Promise<{ loteId: string }>;
}) {
  const { loteId } = await params;
  const data = await getNominaDeLote(loteId);
  if (!data) notFound();

  const { lote, roster } = data;
  const total = roster.length;
  const completados = roster.filter((w) => w.estado === "COMPLETADO").length;
  const pendientes = total - completados;
  const avancePct = total === 0 ? 0 : Math.round((completados / total) * 100);

  return (
    <DrilldownShell title="Detalle Examen" backHref="/examenes">
      <section className="flex flex-col bg-surface-container-lowest rounded-xl p-space-md shadow-card">
        <div className="flex items-center justify-between mb-space-xs">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm">
            {lote.campaniaNombre}
          </span>
        </div>
        <h2 className="font-headline-sm text-headline-sm text-on-surface">
          {lote.empresaNombre}
        </h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
          CUIT: {lote.empresaCuit} • Lote #{lote.codigo}
        </p>

        <div className="flex items-end justify-between mb-1.5">
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            Avance
          </span>
          <span className="font-headline-md text-headline-md text-primary">
            {avancePct}%
          </span>
        </div>
        <ProgressBar pct={avancePct} className="mb-space-md" />

        <div className="grid grid-cols-3 gap-space-xs bg-surface-container-low rounded-lg p-space-sm text-center">
          <div className="flex flex-col items-center justify-center">
            <span className="font-headline-sm text-headline-sm text-on-surface">
              {total}
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Nómina Total
            </span>
          </div>
          <div className="flex flex-col items-center justify-center bg-surface-container-lowest rounded-md py-1 shadow-card">
            <span className="font-headline-sm text-headline-sm text-primary">
              {completados}
            </span>
            <span className="font-label-sm text-label-sm text-primary">
              Completados
            </span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <span className="font-headline-sm text-headline-sm text-on-tertiary-fixed-variant">
              {pendientes}
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Pendientes
            </span>
          </div>
        </div>
      </section>

      <RosterInteractive loteId={lote.id} roster={roster} />
    </DrilldownShell>
  );
}
