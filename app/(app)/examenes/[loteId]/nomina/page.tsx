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
      <section className="flex flex-col gap-1">
        <h2 className="font-headline-sm text-headline-sm text-on-surface">
          {lote.empresaNombre}
        </h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Lote {lote.codigo} · {completados} de {total} completados
          {pendientes > 0 && ` · ${pendientes} pendientes`}
        </p>
        <div className="flex items-center gap-space-sm mt-1">
          <ProgressBar pct={avancePct} className="flex-1" />
          <span className="font-label-md text-label-md text-primary shrink-0">
            {avancePct}%
          </span>
        </div>
      </section>

      <RosterInteractive loteId={lote.id} roster={roster} />
    </DrilldownShell>
  );
}
