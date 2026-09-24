"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireSessionEvaluador } from "@/lib/auth/session";
import { ESTUDIOS_REGISTRY, type TipoEstudio } from "@/lib/estudios/registry";
import { toJson } from "@/lib/json";
import { DICTAMENES, type Dictamen } from "@/lib/types";

export type ExamenFormState = { error?: string; success?: string } | undefined;

function extraerDatosEstudio(
  formData: FormData,
  tipo: TipoEstudio,
): Record<string, string> {
  const prefix = `${tipo}.`;
  const datos: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (key.startsWith(prefix) && typeof value === "string") {
      datos[key.slice(prefix.length)] = value;
    }
  }
  return datos;
}

async function actualizarEstudios(
  asignacionId: string,
  formData: FormData,
  { estricto }: { estricto: boolean },
): Promise<void> {
  const estudiosRequeridos = await prisma.estudioRequerido.findMany({
    where: { asignacionId },
  });

  for (const er of estudiosRequeridos) {
    const tipo = er.tipo as TipoEstudio;
    const definicion = ESTUDIOS_REGISTRY[tipo];
    const crudo = extraerDatosEstudio(formData, tipo);
    const hayDatos = Object.values(crudo).some((v) => v.trim().length > 0);

    if (estricto) {
      const parsed = definicion.schema.safeParse(crudo);
      if (!parsed.success) {
        throw new Error(`Revisá los datos de "${definicion.label}".`);
      }
      await prisma.estudioResultado.update({
        where: { estudioRequeridoId: er.id },
        data: { datos: toJson(parsed.data), estado: "CARGADO", completadoEn: new Date() },
      });
    } else {
      await prisma.estudioResultado.update({
        where: { estudioRequeridoId: er.id },
        data: {
          datos: hayDatos ? toJson(crudo) : null,
          estado: hayDatos ? "LISTO" : "PENDIENTE",
        },
      });
    }
  }
}

export async function guardarExamen(
  loteId: string,
  trabajadorId: string,
  asignacionId: string,
  _prevState: ExamenFormState,
  formData: FormData,
): Promise<ExamenFormState> {
  const evaluador = await requireSessionEvaluador();
  const intent = formData.get("intent");
  const observaciones = String(formData.get("observaciones") ?? "").trim();

  if (intent === "finalizar") {
    const dictamen = String(formData.get("dictamen") ?? "");
    if (!DICTAMENES.includes(dictamen as Dictamen)) {
      return { error: "Seleccioná un dictamen antes de finalizar." };
    }

    try {
      await actualizarEstudios(asignacionId, formData, { estricto: true });
    } catch (e) {
      return {
        error: e instanceof Error ? e.message : "Revisá los datos cargados.",
      };
    }

    await prisma.asignacionExamen.update({
      where: { id: asignacionId },
      data: {
        estado: "COMPLETADO",
        dictamen,
        observacionesMedicas: observaciones || null,
        evaluadorId: evaluador.id,
        completadoEn: new Date(),
        turnoEtiqueta: null,
      },
    });

    revalidatePath(`/examenes/${loteId}/nomina`);
    revalidatePath("/examenes");
    revalidatePath("/realizados");
    redirect(`/examenes/${loteId}/nomina`);
  }

  // Borrador parcial: guarda lo que haya sin exigir campos completos.
  await actualizarEstudios(asignacionId, formData, { estricto: false });

  const asignacionActual = await prisma.asignacionExamen.findUniqueOrThrow({
    where: { id: asignacionId },
    select: { estado: true },
  });

  await prisma.asignacionExamen.update({
    where: { id: asignacionId },
    data: {
      observacionesMedicas: observaciones || null,
      estado: asignacionActual.estado === "COMPLETADO" ? "COMPLETADO" : "EN_CURSO",
    },
  });

  revalidatePath(`/examenes/${loteId}/nomina`);
  revalidatePath(`/examenes/${loteId}/trabajador/${trabajadorId}`);

  return {
    success:
      "Borrador guardado. Los cambios se preservaron para continuar más tarde.",
  };
}

export async function marcarAusente(
  loteId: string,
  asignacionId: string,
): Promise<void> {
  await requireSessionEvaluador();

  await prisma.asignacionExamen.update({
    where: { id: asignacionId },
    data: { estado: "AUSENTE", turnoEtiqueta: null },
  });

  revalidatePath(`/examenes/${loteId}/nomina`);
  revalidatePath("/examenes");
}
