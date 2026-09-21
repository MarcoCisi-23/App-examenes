"use client";

import { useState } from "react";
import { clsx } from "clsx";
import type { Dictamen } from "@/lib/types";

const OPCIONES: {
  value: Dictamen;
  label: string;
  descripcion: string;
  icon: string;
}[] = [
  {
    value: "APTO",
    label: "Apto Laboral",
    descripcion: "Sin observaciones restrictivas para la tarea habitual",
    icon: "task_alt",
  },
  {
    value: "APTO_CON_PREEXISTENCIAS",
    label: "Apto con Preexistencias",
    descripcion: "Con adecuaciones ergonómicas o patología de base",
    icon: "info",
  },
  {
    value: "NO_APTO_TEMPORAL",
    label: "No Apto Temporal",
    descripcion: "Requiere interconsulta médica o reposo funcional",
    icon: "cancel",
  },
];

export function DictamenSelector({
  defaultValue,
}: {
  defaultValue: Dictamen | null;
}) {
  const [seleccionado, setSeleccionado] = useState<Dictamen>(
    defaultValue ?? "APTO",
  );

  return (
    <div className="flex flex-col gap-space-xs">
      {OPCIONES.map((opcion) => {
        const active = seleccionado === opcion.value;
        return (
          <label
            key={opcion.value}
            className={clsx(
              "flex items-start gap-space-sm p-space-sm rounded-lg border cursor-pointer transition-colors",
              active
                ? "border-primary bg-primary-container/10"
                : "border-outline-variant bg-surface-container-low",
            )}
          >
            <input
              type="radio"
              name="dictamen"
              value={opcion.value}
              checked={active}
              onChange={() => setSeleccionado(opcion.value)}
              className="sr-only"
            />
            <span
              className={clsx(
                "material-symbols-outlined text-[20px] mt-0.5",
                active ? "text-primary" : "text-outline",
              )}
            >
              {opcion.icon}
            </span>
            <span className="min-w-0">
              <span className="block font-label-lg text-label-lg text-on-surface">
                {opcion.label}
              </span>
              <span className="block font-body-sm text-body-sm text-on-surface-variant">
                {opcion.descripcion}
              </span>
            </span>
          </label>
        );
      })}
    </div>
  );
}
