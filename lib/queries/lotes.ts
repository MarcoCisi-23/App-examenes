import { prisma } from "@/lib/db";
import type { EstadoLote, PeriodicidadLote } from "@/lib/types";

export interface LoteConProgreso {
  id: string;
  codigo: string;
  campaniaNombre: string;
  empresaNombre: string;
  periodicidad: PeriodicidadLote;
  fechaLimite: Date;
  estado: EstadoLote;
  total: number;
  completados: number;
  progresoPct: number;
}

export async function getLotesConProgreso(): Promise<LoteConProgreso[]> {
  // Los lotes finalizados dejan de listarse acá: sus resultados se
  // consultan desde la pantalla de Realizados.
  const lotes = await prisma.lote.findMany({
    where: { estado: { not: "FINALIZADO" } },
    include: {
      empresa: true,
      asignaciones: { select: { estado: true } },
    },
    orderBy: { fechaLimite: "asc" },
  });

  return lotes.map((lote) => {
    const total = lote.asignaciones.length;
    const completados = lote.asignaciones.filter(
      (a) => a.estado === "COMPLETADO",
    ).length;

    return {
      id: lote.id,
      codigo: lote.codigo,
      campaniaNombre: lote.campaniaNombre,
      empresaNombre: lote.empresa.razonSocial,
      periodicidad: lote.periodicidad as PeriodicidadLote,
      fechaLimite: lote.fechaLimite,
      estado: lote.estado as EstadoLote,
      total,
      completados,
      progresoPct: total === 0 ? 0 : Math.round((completados / total) * 100),
    };
  });
}
