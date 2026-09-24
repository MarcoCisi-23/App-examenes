"use client";

import { useMemo, useState } from "react";
import { Chip } from "@/components/ui/Chip";
import { SearchBar } from "@/components/domain/SearchBar";
import { WorkerCard } from "@/components/domain/WorkerCard";
import { WorkerSheet } from "@/components/domain/WorkerSheet";
import type { TrabajadorRosterItem } from "@/lib/queries/trabajadores";

type Filtro = "todos" | "pendientes" | "completados";

function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

export function RosterInteractive({
  loteId,
  roster,
}: {
  loteId: string;
  roster: TrabajadorRosterItem[];
}) {
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [seleccionado, setSeleccionado] = useState<TrabajadorRosterItem | null>(null);

  const contadores = useMemo(
    () => ({
      todos: roster.length,
      pendientes: roster.filter((w) => w.estado !== "COMPLETADO").length,
      completados: roster.filter((w) => w.estado === "COMPLETADO").length,
    }),
    [roster],
  );

  const filtrados = useMemo(() => {
    const consulta = normalizar(busqueda.trim());
    return roster.filter((w) => {
      const coincideFiltro =
        filtro === "todos" ||
        (filtro === "completados" && w.estado === "COMPLETADO") ||
        (filtro === "pendientes" && w.estado !== "COMPLETADO");
      if (!coincideFiltro) return false;
      if (!consulta) return true;
      const haystack = normalizar(`${w.nombre} ${w.apellido} ${w.dni}`);
      return haystack.includes(consulta);
    });
  }, [roster, filtro, busqueda]);

  return (
    <>
      <div className="sticky top-0 z-10 bg-surface pt-space-xs pb-space-sm flex flex-col gap-space-sm -mx-margin-screen px-margin-screen">
        <SearchBar
          value={busqueda}
          onChange={setBusqueda}
          placeholder="Buscar por nombre, apellido o DNI..."
        />
        <div className="flex gap-space-xs overflow-x-auto pb-1">
          <Chip active={filtro === "todos"} onClick={() => setFiltro("todos")}>
            Todos ({contadores.todos})
          </Chip>
          <Chip
            active={filtro === "pendientes"}
            onClick={() => setFiltro("pendientes")}
          >
            Pendientes ({contadores.pendientes})
          </Chip>
          <Chip
            active={filtro === "completados"}
            onClick={() => setFiltro("completados")}
          >
            Completados ({contadores.completados})
          </Chip>
        </div>
      </div>

      {filtrados.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-space-xs py-space-2xl text-center">
          <span className="material-symbols-outlined text-[40px] text-outline-variant">
            person_search
          </span>
          <p className="font-title text-title text-on-surface">Sin coincidencias</p>
          <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs">
            No encontramos trabajadores con ese criterio en esta nómina.
          </p>
        </div>
      ) : (
        <section className="flex flex-col gap-space-sm">
          {filtrados.map((worker) => (
            <WorkerCard
              key={worker.trabajadorId}
              worker={worker}
              onSelect={() => setSeleccionado(worker)}
            />
          ))}
        </section>
      )}

      <WorkerSheet
        worker={seleccionado}
        loteId={loteId}
        onClose={() => setSeleccionado(null)}
      />
    </>
  );
}
