"use client";

import { useMemo, useState } from "react";
import { clsx } from "clsx";
import { ExamCard } from "@/components/domain/ExamCard";
import type { LoteConProgreso } from "@/lib/queries/lotes";

type Filtro = "todos" | "en-curso" | "vencer" | "vencidos";

const DIAS_PROXIMO_A_VENCER = 14;

function inicioDeHoy(): number {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  return hoy.getTime();
}

function esProximoAVencer(lote: LoteConProgreso): boolean {
  if (lote.estado === "FINALIZADO") return false;
  const diasRestantes = (lote.fechaLimite.getTime() - inicioDeHoy()) / 86_400_000;
  return diasRestantes >= 0 && diasRestantes <= DIAS_PROXIMO_A_VENCER;
}

function esVencido(lote: LoteConProgreso): boolean {
  if (lote.estado === "FINALIZADO") return false;
  return lote.fechaLimite.getTime() < inicioDeHoy();
}

const BOTONES: {
  filtro: Exclude<Filtro, "todos">;
  label: string;
  icon: string;
  activeClassName: string;
}[] = [
  {
    filtro: "en-curso",
    label: "En curso",
    icon: "sync",
    activeClassName: "bg-secondary-container text-on-secondary-container",
  },
  {
    filtro: "vencer",
    label: "Próximos a vencer",
    icon: "schedule",
    activeClassName: "bg-warning-container text-on-warning-container",
  },
  {
    filtro: "vencidos",
    label: "Vencidos",
    icon: "event_busy",
    activeClassName: "bg-error-container text-on-error-container",
  },
];

export function LotesList({ lotes }: { lotes: LoteConProgreso[] }) {
  const [filtro, setFiltro] = useState<Filtro>("todos");

  const contadores = useMemo(
    () => ({
      "en-curso": lotes.filter((l) => l.estado === "EN_CURSO").length,
      vencer: lotes.filter(esProximoAVencer).length,
      vencidos: lotes.filter(esVencido).length,
    }),
    [lotes],
  );

  const filtrados = useMemo(() => {
    switch (filtro) {
      case "en-curso":
        return lotes.filter((l) => l.estado === "EN_CURSO");
      case "vencer":
        return lotes.filter(esProximoAVencer);
      case "vencidos":
        return lotes.filter(esVencido);
      default:
        return lotes;
    }
  }, [lotes, filtro]);

  return (
    <>
      <section className="grid grid-cols-3 gap-space-sm">
        {BOTONES.map((boton) => {
          const active = filtro === boton.filtro;
          return (
            <button
              key={boton.filtro}
              type="button"
              onClick={() => setFiltro(active ? "todos" : boton.filtro)}
              className={clsx(
                "flex flex-col items-center gap-1 rounded-xl py-space-md px-space-sm transition-colors",
                active
                  ? boton.activeClassName
                  : "bg-surface-container-lowest text-on-surface shadow-card",
              )}
            >
              <span className="material-symbols-outlined text-[26px]">
                {boton.icon}
              </span>
              <span className="font-label-lg text-label-lg text-center">
                {boton.label}
              </span>
              <span className="font-headline-sm text-headline-sm">
                {contadores[boton.filtro]}
              </span>
            </button>
          );
        })}
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
