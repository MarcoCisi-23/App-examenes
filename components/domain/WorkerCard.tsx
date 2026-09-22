"use client";

import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { asignacionBadgeInfo } from "@/lib/estadoUi";
import type { TrabajadorRosterItem } from "@/lib/queries/trabajadores";

export function WorkerCard({
  worker,
  loteId,
  onSelect,
}: {
  worker: TrabajadorRosterItem;
  loteId: string;
  onSelect: () => void;
}) {
  const badge = asignacionBadgeInfo(
    worker.estado,
    worker.estudiosCargados,
    worker.estudiosTotal,
  );

  return (
    <article
      onClick={onSelect}
      className="flex flex-col bg-surface-container-lowest rounded-xl p-space-md shadow-card cursor-pointer transition-transform active:scale-[0.99]"
    >
      <div className="flex items-start gap-space-sm">
        <Avatar nombre={worker.nombre} apellido={worker.apellido} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-space-xs">
            <h3 className="font-title text-title text-on-surface leading-tight truncate">
              {worker.apellido}, {worker.nombre}
            </h3>
            <Badge icon={badge.icon} className={badge.className} pulse={badge.pulse}>
              {badge.label}
            </Badge>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
            DNI {worker.dni} • {worker.edad} años • {worker.puesto}
          </p>
          {worker.turnoEtiqueta && (
            <p className="font-label-sm text-label-sm text-primary mt-1">
              {worker.turnoEtiqueta}
            </p>
          )}
        </div>
      </div>

      {worker.estado === "PENDIENTE" && (
        <Link
          href={`/examenes/${loteId}/trabajador/${worker.trabajadorId}`}
          onClick={(e) => e.stopPropagation()}
          className="mt-space-sm w-full min-h-touch-target-min px-space-md bg-primary-container text-on-primary rounded-xl flex items-center justify-center gap-2 font-label-lg text-label-lg active:scale-[0.99] transition-transform"
        >
          <span className="material-symbols-outlined text-[20px]">clinical_notes</span>
          Iniciar Examen
        </Link>
      )}

      {worker.estado === "EN_CURSO" && (
        <Link
          href={`/examenes/${loteId}/trabajador/${worker.trabajadorId}`}
          onClick={(e) => e.stopPropagation()}
          className="mt-space-sm w-full min-h-touch-target-min px-space-md bg-surface-container-high text-on-surface rounded-xl flex items-center justify-center gap-2 font-label-lg text-label-lg active:scale-[0.99] transition-transform"
        >
          <span className="material-symbols-outlined text-[20px]">edit_note</span>
          Continuar Examen
        </Link>
      )}
    </article>
  );
}
