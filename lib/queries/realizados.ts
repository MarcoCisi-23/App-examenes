import { prisma } from "@/lib/db";
import type { Dictamen } from "@/lib/types";

export interface LoteRealizado {
  loteId: string;
  loteCodigo: string;
  empresaNombre: string;
  cantidad: number;
  /** Fecha del registro completado más reciente del lote. */
  fechaRealizacion: Date | null;
  registros: {
    asignacionId: string;
    trabajadorNombre: string;
    trabajadorApellido: string;
    dni: string;
    puesto: string;
    dictamen: Dictamen | null;
    completadoEn: Date | null;
  }[];
}

export async function getExamenesRealizados(): Promise<{
  totalListos: number;
  lotes: LoteRealizado[];
}> {
  const asignaciones = await prisma.asignacionExamen.findMany({
    where: { estado: "COMPLETADO" },
    include: { trabajador: true, lote: { include: { empresa: true } } },
    orderBy: { completadoEn: "desc" },
  });

  const porLote = new Map<string, LoteRealizado>();
  for (const asig of asignaciones) {
    const existente = porLote.get(asig.loteId);
    const registro = {
      asignacionId: asig.id,
      trabajadorNombre: asig.trabajador.nombre,
      trabajadorApellido: asig.trabajador.apellido,
      dni: asig.trabajador.dni,
      puesto: asig.trabajador.puesto,
      dictamen: (asig.dictamen as Dictamen) ?? null,
      completadoEn: asig.completadoEn,
    };

    if (existente) {
      existente.cantidad += 1;
      existente.registros.push(registro);
    } else {
      porLote.set(asig.loteId, {
        loteId: asig.loteId,
        loteCodigo: asig.lote.codigo,
        empresaNombre: asig.lote.empresa.razonSocial,
        cantidad: 1,
        // Como `asignaciones` viene ordenado por completadoEn desc, el primer
        // registro de cada lote es siempre el más reciente.
        fechaRealizacion: asig.completadoEn,
        registros: [registro],
      });
    }
  }

  return { totalListos: asignaciones.length, lotes: Array.from(porLote.values()) };
}
