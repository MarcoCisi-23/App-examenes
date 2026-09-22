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
      <WorkerInfoCard trabajador={asignacion.trabajador} />

      <ExamFormClient
        loteId={loteId}
        trabajadorId={trabajadorId}
        asignacion={asignacion}
      />
    </DrilldownShell>
  );
}
