import type { EstadoLote, EstadoAsignacion } from "@/lib/types";

export function loteBadgeInfo(estado: EstadoLote): {
  label: string;
  icon: string;
  className: string;
} {
  switch (estado) {
    case "EN_CURSO":
      return {
        label: "En curso",
        icon: "sync",
        className: "bg-secondary-container text-on-secondary-container",
      };
    case "PRIORIDAD_ALTA":
      return {
        label: "Prioridad Alta",
        icon: "priority_high",
        className: "bg-error-container text-on-error-container",
      };
    case "FINALIZADO":
      return {
        label: "Finalizado",
        icon: "check_circle",
        className: "bg-success-container text-on-success-container",
      };
    case "PENDIENTE":
    default:
      return {
        label: "Pendiente",
        icon: "schedule",
        className: "bg-surface-variant text-on-surface-variant",
      };
  }
}

export function asignacionBadgeInfo(
  estado: EstadoAsignacion,
  estudiosCargados: number,
  estudiosTotal: number,
): { label: string; icon: string; className: string; pulse?: boolean } {
  switch (estado) {
    case "COMPLETADO":
      return {
        label: "Examen Realizado",
        icon: "check_circle",
        className: "bg-success-container text-on-success-container",
      };
    case "EN_CURSO":
      return {
        label: `En Curso (${estudiosCargados}/${estudiosTotal})`,
        icon: "bolt",
        className: "bg-primary-container text-on-primary-container",
        pulse: true,
      };
    case "AUSENTE":
      return {
        label: "Ausente",
        icon: "person_off",
        className: "bg-surface-variant text-on-surface-variant",
      };
    case "PENDIENTE":
    default:
      return {
        label: "Pendiente",
        icon: "hourglass_top",
        className: "bg-warning-container text-on-warning-container",
      };
  }
}
