"use client";

import { useMemo, useState } from "react";
import { SearchBar } from "@/components/domain/SearchBar";
import { RealizadosRow } from "@/components/domain/RealizadosRow";
import { RealizadosSheet } from "@/components/domain/RealizadosSheet";
import type { LoteRealizado } from "@/lib/queries/realizados";

function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

export function RealizadosInteractive({ lotes }: { lotes: LoteRealizado[] }) {
  const [busqueda, setBusqueda] = useState("");
  const [seleccionado, setSeleccionado] = useState<LoteRealizado | null>(null);

  const filtrados = useMemo(() => {
    const consulta = normalizar(busqueda.trim());
    if (!consulta) return lotes;
    return lotes.filter((lote) =>
      normalizar(`${lote.empresaNombre} ${lote.loteCodigo}`).includes(consulta),
    );
  }, [lotes, busqueda]);

  return (
    <section className="flex flex-col gap-space-sm">
      {lotes.length > 0 && (
        <SearchBar
          value={busqueda}
          onChange={setBusqueda}
          placeholder="Buscar por empresa o número de lote..."
        />
      )}

      {lotes.length === 0 ? (
        <p className="font-body-md text-body-md text-on-surface-variant py-space-xl text-center">
          Todavía no hay exámenes finalizados para exportar.
        </p>
      ) : filtrados.length === 0 ? (
        <p className="font-body-md text-body-md text-on-surface-variant py-space-xl text-center">
          No encontramos lotes con ese criterio.
        </p>
      ) : (
        <div className="flex flex-col gap-space-xs">
          {filtrados.map((lote) => (
            <RealizadosRow
              key={lote.loteId}
              lote={lote}
              onSelect={() => setSeleccionado(lote)}
            />
          ))}
        </div>
      )}

      <RealizadosSheet lote={seleccionado} onClose={() => setSeleccionado(null)} />
    </section>
  );
}
