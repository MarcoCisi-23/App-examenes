export const ESTADOS_LOTE = [
  "PENDIENTE",
  "EN_CURSO",
  "PRIORIDAD_ALTA",
  "FINALIZADO",
] as const;
export type EstadoLote = (typeof ESTADOS_LOTE)[number];

export const ESTADOS_ASIGNACION = [
  "PENDIENTE",
  "EN_CURSO",
  "COMPLETADO",
  "AUSENTE",
] as const;
export type EstadoAsignacion = (typeof ESTADOS_ASIGNACION)[number];

export const ESTADOS_ESTUDIO = ["PENDIENTE", "LISTO", "CARGADO"] as const;
export type EstadoEstudio = (typeof ESTADOS_ESTUDIO)[number];

export const DICTAMENES = [
  "APTO",
  "APTO_CON_PREEXISTENCIAS",
  "NO_APTO_TEMPORAL",
] as const;
export type Dictamen = (typeof DICTAMENES)[number];

export const SEXOS = ["M", "F", "X"] as const;
export type Sexo = (typeof SEXOS)[number];

export const DICTAMEN_LABEL: Record<Dictamen, string> = {
  APTO: "Apto Laboral",
  APTO_CON_PREEXISTENCIAS: "Apto con Preexistencias",
  NO_APTO_TEMPORAL: "No Apto Temporal",
};

export const ESTADO_LOTE_LABEL: Record<EstadoLote, string> = {
  PENDIENTE: "Pendiente",
  EN_CURSO: "En curso",
  PRIORIDAD_ALTA: "Prioridad Alta",
  FINALIZADO: "Finalizado",
};

export const PERIODICIDADES_LOTE = ["SEMESTRAL", "ANUAL"] as const;
export type PeriodicidadLote = (typeof PERIODICIDADES_LOTE)[number];

export const PERIODICIDAD_LOTE_LABEL: Record<PeriodicidadLote, string> = {
  SEMESTRAL: "Semestral",
  ANUAL: "Anual",
};
