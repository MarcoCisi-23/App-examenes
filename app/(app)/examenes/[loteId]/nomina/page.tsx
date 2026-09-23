import { notFound } from "next/navigation";
import { DrilldownShell } from "@/components/layout/DrilldownShell";
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
      <section className="flex items-start justify-between gap-space-sm">
        <div className="flex flex-col gap-1 min-w-0">
          <h2 className="font-headline-sm text-headline-sm text-on-surface truncate">
            {lote.empresaNombre}
          </h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Lote {lote.codigo} · {completados} de {total} completados
            {pendientes > 0 && ` · ${pendientes} pendientes`}
          </p>
        </div>
        <div className="flex flex-col items-end shrink-0">
          <span className="font-headline-sm text-headline-sm text-primary">
            {avancePct}%
          </span>
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            completado
          </span>
        </div>
      </section>

      <RosterInteractive loteId={lote.id} roster={roster} />
    </DrilldownShell>
  );
}
