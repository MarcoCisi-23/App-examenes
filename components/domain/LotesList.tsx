"use client";

import { useMemo, useState } from "react";
import { Chip } from "@/components/ui/Chip";
import { ExamCard } from "@/components/domain/ExamCard";
import type { LoteConProgreso } from "@/lib/queries/lotes";

type Filtro = "todos" | "en-curso" | "prioridad-alta" | "vencer";

const DIAS_PROXIMO_A_VENCER = 14;

function esProximoAVencer(lote: LoteConProgreso): boolean {
  if (lote.estado === "FINALIZADO") return false;
  const diasRestantes =
    (lote.fechaLimite.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  return diasRestantes >= 0 && diasRestantes <= DIAS_PROXIMO_A_VENCER;
}

export function LotesList({ lotes }: { lotes: LoteConProgreso[] }) {
  const [filtro, setFiltro] = useState<Filtro>("todos");

  const contadores = useMemo(
    () => ({
      todos: lotes.length,
      "en-curso": lotes.filter((l) => l.estado === "EN_CURSO").length,
      "prioridad-alta": lotes.filter((l) => l.estado === "PRIORIDAD_ALTA").length,
      vencer: lotes.filter(esProximoAVencer).length,
    }),
    [lotes],
  );

  const filtrados = useMemo(() => {
    switch (filtro) {
      case "en-curso":
        return lotes.filter((l) => l.estado === "EN_CURSO");
      case "prioridad-alta":
        return lotes.filter((l) => l.estado === "PRIORIDAD_ALTA");
      case "vencer":
        return lotes.filter(esProximoAVencer);
      default:
        return lotes;
    }
  }, [lotes, filtro]);

  return (
    <>
      <section className="flex gap-space-xs overflow-x-auto pb-1 -mx-gutter-mobile px-gutter-mobile">
        <Chip active={filtro === "todos"} onClick={() => setFiltro("todos")}>
          <span>Todos</span>
          <span className="bg-surface-container-lowest/25 px-1.5 py-0.2 rounded-full text-label-sm font-label-sm">
            {contadores.todos}
          </span>
        </Chip>
        <Chip active={filtro === "en-curso"} onClick={() => setFiltro("en-curso")}>
          <span>En curso</span>
          <span className="bg-surface-container-lowest px-1.5 py-0.2 rounded-full text-label-sm font-label-sm">
            {contadores["en-curso"]}
          </span>
        </Chip>
        <Chip
          active={filtro === "prioridad-alta"}
          onClick={() => setFiltro("prioridad-alta")}
        >
          <span className="w-2 h-2 rounded-full bg-error" />
          <span>Alta prioridad</span>
          <span className="bg-surface-container-lowest px-1.5 py-0.2 rounded-full text-label-sm font-label-sm">
            {contadores["prioridad-alta"]}
          </span>
        </Chip>
        <Chip active={filtro === "vencer"} onClick={() => setFiltro("vencer")}>
          <span className="material-symbols-outlined text-[16px]">schedule</span>
          <span>Próximos a vencer</span>
        </Chip>
      </section>

      <section className="flex flex-col gap-space-md">
        {filtrados.length === 0 ? (
          <p className="text-center font-body-md text-body-md text-on-surface-variant py-space-xl">
            No hay lotes que coincidan con este filtro.
          </p>
        ) : (
          filtrados.map((lote) => <ExamCard key={lote.id} lote={lote} />)
        )}
      </section>
    </>
  );
}
