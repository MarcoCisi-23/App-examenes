import Link from "next/link";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Button } from "@/components/ui/Button";
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
  const badge = worker
    ? asignacionBadgeInfo(worker.estado, worker.estudiosCargados, worker.estudiosTotal)
    : null;

  return (
    <BottomSheet open={worker !== null} onClose={onClose}>
      {worker && badge && (
        <div className="flex flex-col gap-space-md">
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              {worker.apellido}, {worker.nombre}
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              DNI {worker.dni} • {worker.puesto}
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

          <Link href={`/examenes/${loteId}/trabajador/${worker.trabajadorId}`}>
            <Button
              variant="primary"
              icon={worker.estado === "COMPLETADO" ? "description" : "clinical_notes"}
              className="w-full"
            >
              {worker.estado === "COMPLETADO"
                ? "Ver Certificado Médico ART"
                : "Cargar Examen en Box"}
            </Button>
          </Link>
        </div>
      )}
    </BottomSheet>
  );
}
