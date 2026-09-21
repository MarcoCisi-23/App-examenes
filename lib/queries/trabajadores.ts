import { prisma } from "@/lib/db";
import { calcularEdad } from "@/lib/edad";
import { fromJson } from "@/lib/json";
import { ESTUDIOS_REGISTRY, type TipoEstudio } from "@/lib/estudios/registry";
import type { EstadoAsignacion, Dictamen, Sexo } from "@/lib/types";

export interface EstudioRosterItem {
  tipo: TipoEstudio;
  label: string;
  icon: string;
  cargado: boolean;
}

export interface TrabajadorRosterItem {
  trabajadorId: string;
  asignacionId: string;
  dni: string;
  nombre: string;
  apellido: string;
  sexo: Sexo;
  edad: number;
  puesto: string;
  estado: EstadoAsignacion;
  dictamen: Dictamen | null;
  observacionesMedicas: string | null;
  turnoEtiqueta: string | null;
  estudios: EstudioRosterItem[];
  estudiosCargados: number;
  estudiosTotal: number;
}

export interface NominaLote {
  id: string;
  codigo: string;
  campaniaNombre: string;
  empresaNombre: string;
  empresaCuit: string;
  tipoExamen: string;
}

export async function getNominaDeLote(
  loteId: string,
): Promise<{ lote: NominaLote; roster: TrabajadorRosterItem[] } | null> {
  const lote = await prisma.lote.findUnique({
    where: { id: loteId },
    include: { empresa: true },
  });
  if (!lote) return null;

  const asignaciones = await prisma.asignacionExamen.findMany({
    where: { loteId },
    include: {
      trabajador: true,
      estudiosRequeridos: {
        include: { resultado: true },
        orderBy: { orden: "asc" },
      },
    },
    orderBy: [{ trabajador: { apellido: "asc" } }, { trabajador: { nombre: "asc" } }],
  });

  const roster: TrabajadorRosterItem[] = asignaciones.map((asig) => {
    const estudios: EstudioRosterItem[] = asig.estudiosRequeridos.map((er) => {
      const tipo = er.tipo as TipoEstudio;
      return {
        tipo,
        label: ESTUDIOS_REGISTRY[tipo].label,
        icon: ESTUDIOS_REGISTRY[tipo].icon,
        cargado: er.resultado?.estado === "CARGADO",
      };
    });

    return {
      trabajadorId: asig.trabajador.id,
      asignacionId: asig.id,
      dni: asig.trabajador.dni,
      nombre: asig.trabajador.nombre,
      apellido: asig.trabajador.apellido,
      sexo: asig.trabajador.sexo as Sexo,
      edad: calcularEdad(asig.trabajador.fechaNacimiento),
      puesto: asig.trabajador.puesto,
      estado: asig.estado as EstadoAsignacion,
      dictamen: (asig.dictamen as Dictamen) ?? null,
      observacionesMedicas: asig.observacionesMedicas,
      turnoEtiqueta: asig.turnoEtiqueta,
      estudios,
      estudiosCargados: estudios.filter((e) => e.cargado).length,
      estudiosTotal: estudios.length,
    };
  });

  return {
    lote: {
      id: lote.id,
      codigo: lote.codigo,
      campaniaNombre: lote.campaniaNombre,
      empresaNombre: lote.empresa.razonSocial,
      empresaCuit: lote.empresa.cuit,
      tipoExamen: lote.tipoExamen,
    },
    roster,
  };
}

export interface EstudioDetalle {
  estudioRequeridoId: string;
  tipo: TipoEstudio;
  orden: number;
  estado: "PENDIENTE" | "LISTO" | "CARGADO";
  datos: Record<string, unknown> | null;
  archivoNombre: string | null;
}

export interface AsignacionDetalle {
  asignacionId: string;
  estado: EstadoAsignacion;
  dictamen: Dictamen | null;
  observacionesMedicas: string | null;
  lote: { id: string; codigo: string; empresaNombre: string };
  trabajador: {
    id: string;
    dni: string;
    nombre: string;
    apellido: string;
    sexo: Sexo;
    edad: number;
    fechaNacimiento: Date;
    puesto: string;
    empresaNombre: string;
    antiguedadAnios: number;
    factoresRiesgo: string[];
  };
  estudios: EstudioDetalle[];
}

export async function getAsignacionDetalle(
  loteId: string,
  trabajadorId: string,
): Promise<AsignacionDetalle | null> {
  const asignacion = await prisma.asignacionExamen.findUnique({
    where: { loteId_trabajadorId: { loteId, trabajadorId } },
    include: {
      lote: { include: { empresa: true } },
      trabajador: { include: { empresa: true } },
      estudiosRequeridos: {
        include: { resultado: true },
        orderBy: { orden: "asc" },
      },
    },
  });
  if (!asignacion) return null;

  return {
    asignacionId: asignacion.id,
    estado: asignacion.estado as EstadoAsignacion,
    dictamen: (asignacion.dictamen as Dictamen) ?? null,
    observacionesMedicas: asignacion.observacionesMedicas,
    lote: {
      id: asignacion.lote.id,
      codigo: asignacion.lote.codigo,
      empresaNombre: asignacion.lote.empresa.razonSocial,
    },
    trabajador: {
      id: asignacion.trabajador.id,
      dni: asignacion.trabajador.dni,
      nombre: asignacion.trabajador.nombre,
      apellido: asignacion.trabajador.apellido,
      sexo: asignacion.trabajador.sexo as Sexo,
      edad: calcularEdad(asignacion.trabajador.fechaNacimiento),
      fechaNacimiento: asignacion.trabajador.fechaNacimiento,
      puesto: asignacion.trabajador.puesto,
      empresaNombre: asignacion.trabajador.empresa.razonSocial,
      antiguedadAnios: asignacion.trabajador.antiguedadAnios,
      factoresRiesgo: fromJson<string[]>(asignacion.trabajador.factoresRiesgo, []),
    },
    estudios: asignacion.estudiosRequeridos.map((er) => ({
      estudioRequeridoId: er.id,
      tipo: er.tipo as TipoEstudio,
      orden: er.orden,
      estado: (er.resultado?.estado as EstudioDetalle["estado"]) ?? "PENDIENTE",
      datos: er.resultado
        ? fromJson<Record<string, unknown> | null>(er.resultado.datos, null)
        : null,
      archivoNombre: er.resultado?.archivoNombre ?? null,
    })),
  };
}
