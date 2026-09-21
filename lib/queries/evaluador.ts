import { prisma } from "@/lib/db";

export async function getAuditadosEsteMes(evaluadorId: string): Promise<number> {
  const inicioMes = new Date();
  inicioMes.setDate(1);
  inicioMes.setHours(0, 0, 0, 0);

  return prisma.asignacionExamen.count({
    where: {
      evaluadorId,
      estado: "COMPLETADO",
      completadoEn: { gte: inicioMes },
    },
  });
}
