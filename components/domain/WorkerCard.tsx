"use client";

import type { TrabajadorRosterItem } from "@/lib/queries/trabajadores";

export function WorkerCard({
  worker,
  onSelect,
}: {
  worker: TrabajadorRosterItem;
  onSelect: () => void;
}) {
  const finalizado = worker.estado === "COMPLETADO";

  return (
    <article
      onClick={onSelect}
      className="flex items-center justify-between gap-space-sm bg-surface-container-lowest rounded-xl px-space-md py-space-sm shadow-card cursor-pointer transition-transform active:scale-[0.99]"
    >
      <div className="min-w-0">
        <h3 className="font-title text-title text-on-surface leading-tight truncate">
          {worker.apellido}, {worker.nombre}
        </h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
          DNI {worker.dni}
        </p>
      </div>
      {finalizado && (
        <span className="material-symbols-outlined text-success text-[22px] shrink-0">
          check_circle
        </span>
      )}
    </article>
  );
}
