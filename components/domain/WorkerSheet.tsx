"use client";

import Link from "next/link";
import { useTransition } from "react";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Button } from "@/components/ui/Button";
import { marcarAusente } from "@/actions/examenes";
import { asignacionBadgeInfo } from "@/lib/estadoUi";
import type { TrabajadorRosterItem } from "@/lib/queries/trabajadores";

export function WorkerSheet({
  worker,
  loteId,
  onClose,
}: {
  worker: TrabajadorRosterItem | null;
  loteId: string;
  onClose: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const badge = worker
    ? asignacionBadgeInfo(worker.estado, worker.estudiosCargados, worker.estudiosTotal)
    : null;

  function handleMarcarAusente() {
    if (!worker) return;
    startTransition(async () => {
      await marcarAusente(loteId, worker.asignacionId);
      onClose();
    });
  }

  return (
    <BottomSheet open={worker !== null} onClose={onClose}>
      {worker && badge && (
        <div className="flex flex-col gap-space-md">
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              {worker.apellido}, {worker.nombre}
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              DNI {worker.dni} • {worker.edad} años • {worker.puesto}
            </p>
          </div>

          <div className="bg-surface-container-low rounded-lg p-space-md">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-primary">
                {badge.icon}
              </span>
              <span className="font-title text-title text-on-surface">
                {badge.label}
              </span>
            </div>
            {worker.observacionesMedicas && (
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                {worker.observacionesMedicas}
              </p>
            )}
          </div>

          <div>
            <p className="font-label-md text-label-md text-on-surface-variant mb-space-xs">
              Estudios y Evaluaciones
            </p>
            <ul className="flex flex-col gap-1.5">
              {worker.estudios.map((estudio) => (
                <li
                  key={estudio.tipo}
                  className="flex items-center gap-2 bg-surface-container-low rounded-lg px-space-sm py-space-xs"
                >
                  <span
                    className={`material-symbols-outlined text-[18px] ${
                      estudio.cargado ? "text-success" : "text-outline"
                    }`}
                  >
                    {estudio.cargado ? "check_circle" : "radio_button_unchecked"}
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface">
                    {estudio.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {worker.estado === "COMPLETADO" ? (
            <Link href={`/examenes/${loteId}/trabajador/${worker.trabajadorId}`}>
              <Button variant="primary" icon="description" className="w-full">
                Ver Certificado Médico ART
              </Button>
            </Link>
          ) : (
            <div className="flex flex-col gap-space-xs">
              <Link href={`/examenes/${loteId}/trabajador/${worker.trabajadorId}`}>
                <Button variant="primary" icon="clinical_notes" className="w-full">
                  {worker.estado === "EN_CURSO" ? "Continuar Examen" : "Iniciar Examen"}
                </Button>
              </Link>
              {worker.estado === "PENDIENTE" && (
                <Button
                  type="button"
                  variant="secondary"
                  icon="person_off"
                  disabled={pending}
                  onClick={handleMarcarAusente}
                  className="w-full"
                >
                  Marcar como Ausente
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </BottomSheet>
  );
}
