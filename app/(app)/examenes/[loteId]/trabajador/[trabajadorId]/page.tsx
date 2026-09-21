import { notFound } from "next/navigation";
import { DrilldownShell } from "@/components/layout/DrilldownShell";
import { WorkerInfoCard } from "@/components/domain/WorkerInfoCard";
import { ExamFormClient } from "@/components/domain/ExamFormClient";
import { getAsignacionDetalle } from "@/lib/queries/trabajadores";

export default async function CargaExamenPage({
  params,
}: {
  params: Promise<{ loteId: string; trabajadorId: string }>;
}) {
  const { loteId, trabajadorId } = await params;
  const asignacion = await getAsignacionDetalle(loteId, trabajadorId);
  if (!asignacion) notFound();

  return (
    <DrilldownShell title="Carga Estudio" backHref={`/examenes/${loteId}/nomina`}>
      <div className="flex items-center gap-space-xs">
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
          <span className="material-symbols-outlined text-[14px]">assignment_ind</span>
          {asignacion.lote.empresaNombre} • Lote {asignacion.lote.codigo}
        </span>
      </div>

      <WorkerInfoCard trabajador={asignacion.trabajador} />

      <ExamFormClient
        loteId={loteId}
        trabajadorId={trabajadorId}
        asignacion={asignacion}
      />
    </DrilldownShell>
  );
}
