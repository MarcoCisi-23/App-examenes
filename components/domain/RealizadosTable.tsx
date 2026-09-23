"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { RealizadosSheet } from "@/components/domain/RealizadosSheet";
import type { LoteRealizado } from "@/lib/queries/realizados";

function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

interface Filtros {
  lote: string;
  empresa: string;
  trabajadoresMin: string;
  trabajadoresMax: string;
  fechaDesde: string;
  fechaHasta: string;
}

const FILTROS_VACIOS: Filtros = {
  lote: "",
  empresa: "",
  trabajadoresMin: "",
  trabajadoresMax: "",
  fechaDesde: "",
  fechaHasta: "",
};

export function RealizadosTable({ lotes }: { lotes: LoteRealizado[] }) {
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_VACIOS);
  const [seleccionado, setSeleccionado] = useState<LoteRealizado | null>(null);

  const filtrosActivos = Object.values(filtros).filter((v) => v !== "").length;

  const filtrados = useMemo(() => {
    return lotes.filter((lote) => {
      if (
        filtros.lote &&
        !normalizar(lote.loteCodigo).includes(normalizar(filtros.lote))
      ) {
        return false;
      }
      if (
        filtros.empresa &&
        !normalizar(lote.empresaNombre).includes(normalizar(filtros.empresa))
      ) {
        return false;
      }
      if (filtros.trabajadoresMin && lote.cantidad < Number(filtros.trabajadoresMin)) {
        return false;
      }
      if (filtros.trabajadoresMax && lote.cantidad > Number(filtros.trabajadoresMax)) {
        return false;
      }
      if (filtros.fechaDesde) {
        if (!lote.fechaRealizacion) return false;
        if (lote.fechaRealizacion < new Date(filtros.fechaDesde)) return false;
      }
      if (filtros.fechaHasta) {
        if (!lote.fechaRealizacion) return false;
        const hasta = new Date(`${filtros.fechaHasta}T23:59:59`);
        if (lote.fechaRealizacion > hasta) return false;
      }
      return true;
    });
  }, [lotes, filtros]);

  function actualizarFiltro(campo: keyof Filtros, valor: string) {
    setFiltros((prev) => ({ ...prev, [campo]: valor }));
  }

  return (
    <section className="flex flex-col gap-space-sm">
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="secondary"
          icon="filter_list"
          onClick={() => setMostrarFiltros((v) => !v)}
        >
          Filtros{filtrosActivos > 0 ? ` (${filtrosActivos})` : ""}
          <span className="material-symbols-outlined text-[18px]">
            {mostrarFiltros ? "expand_less" : "expand_more"}
          </span>
        </Button>
        {filtrosActivos > 0 && (
          <button
            type="button"
            onClick={() => setFiltros(FILTROS_VACIOS)}
            className="font-label-md text-label-md text-primary"
          >
            Limpiar
          </button>
        )}
      </div>

      {mostrarFiltros && (
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-card flex flex-col gap-space-sm">
          <Input
            label="Lote"
            placeholder="OP-2024-65"
            value={filtros.lote}
            onChange={(e) => actualizarFiltro("lote", e.target.value)}
          />
          <Input
            label="Empresa"
            placeholder="Nombre de empresa"
            value={filtros.empresa}
            onChange={(e) => actualizarFiltro("empresa", e.target.value)}
          />
          <div className="grid grid-cols-2 gap-space-sm">
            <Input
              label="Trabajadores mín."
              type="number"
              min={0}
              value={filtros.trabajadoresMin}
              onChange={(e) => actualizarFiltro("trabajadoresMin", e.target.value)}
            />
            <Input
              label="Trabajadores máx."
              type="number"
              min={0}
              value={filtros.trabajadoresMax}
              onChange={(e) => actualizarFiltro("trabajadoresMax", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-space-sm">
            <Input
              label="Realizado desde"
              type="date"
              value={filtros.fechaDesde}
              onChange={(e) => actualizarFiltro("fechaDesde", e.target.value)}
            />
            <Input
              label="Realizado hasta"
              type="date"
              value={filtros.fechaHasta}
              onChange={(e) => actualizarFiltro("fechaHasta", e.target.value)}
            />
          </div>
        </div>
      )}

      {lotes.length === 0 ? (
        <p className="font-body-md text-body-md text-on-surface-variant py-space-xl text-center">
          Todavía no hay exámenes finalizados para exportar.
        </p>
      ) : filtrados.length === 0 ? (
        <p className="font-body-md text-body-md text-on-surface-variant py-space-xl text-center">
          No encontramos exámenes con esos filtros.
        </p>
      ) : (
        <div className="bg-surface-container-lowest rounded-xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[380px] border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/40">
                  <th className="text-left font-label-sm text-label-sm text-on-surface-variant px-space-sm py-space-sm">
                    Lote
                  </th>
                  <th className="text-left font-label-sm text-label-sm text-on-surface-variant px-space-sm py-space-sm">
                    Empresa
                  </th>
                  <th className="text-right font-label-sm text-label-sm text-on-surface-variant px-space-sm py-space-sm">
                    Trab.
                  </th>
                  <th className="text-left font-label-sm text-label-sm text-on-surface-variant px-space-sm py-space-sm">
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((lote) => (
                  <tr
                    key={lote.loteId}
                    onClick={() => setSeleccionado(lote)}
                    className="border-b border-outline-variant/20 last:border-b-0 cursor-pointer hover:bg-surface-container-low transition-colors"
                  >
                    <td className="font-label-md text-label-md text-primary px-space-sm py-space-sm whitespace-nowrap">
                      {lote.loteCodigo}
                    </td>
                    <td className="font-body-md text-body-md text-on-surface px-space-sm py-space-sm max-w-[110px] truncate">
                      {lote.empresaNombre}
                    </td>
                    <td className="font-body-md text-body-md text-on-surface px-space-sm py-space-sm text-right">
                      {lote.cantidad}
                    </td>
                    <td className="font-body-md text-body-md text-on-surface-variant px-space-sm py-space-sm whitespace-nowrap">
                      {lote.fechaRealizacion
                        ? format(lote.fechaRealizacion, "dd/MM/yyyy", { locale: es })
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <RealizadosSheet lote={seleccionado} onClose={() => setSeleccionado(null)} />
    </section>
  );
}
