import { prisma } from "@/lib/db";
import type { EstadoLote } from "@/lib/types";

export interface LoteConProgreso {
  id: string;
  codigo: string;
  campaniaNombre: string;
  empresaNombre: string;
  tipoExamen: string;
  ubicacion: string;
  fechaLimite: Date;
  estado: EstadoLote;
  total: number;
  completados: number;
  progresoPct: number;
}

export async function getLotesConProgreso(): Promise<LoteConProgreso[]> {
  const lotes = await prisma.lote.findMany({
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
      tipoExamen: lote.tipoExamen,
      ubicacion: lote.ubicacion,
      fechaLimite: lote.fechaLimite,
      estado: lote.estado as EstadoLote,
      total,
      completados,
      progresoPct: total === 0 ? 0 : Math.round((completados / total) * 100),
    };
  });
}

export async function getResumenGlobal(lotes: LoteConProgreso[]) {
  const trabajadores = lotes.reduce((acc, l) => acc + l.total, 0);
  const completados = lotes.reduce((acc, l) => acc + l.completados, 0);
  const pendientes = trabajadores - completados;
  const progresoPct =
    trabajadores === 0 ? 0 : Math.round((completados / trabajadores) * 1000) / 10;

  return { trabajadores, completados, pendientes, progresoPct };
}
