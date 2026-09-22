import type { LoteRealizado } from "@/lib/queries/realizados";

export function RealizadosRow({
  lote,
  onSelect,
}: {
  lote: LoteRealizado;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="w-full flex items-center gap-space-sm bg-surface-container-lowest rounded-xl px-space-md py-space-sm shadow-card text-left transition-transform active:scale-[0.99]"
    >
      <div className="shrink-0 w-11 h-11 rounded-full bg-success-container flex items-center justify-center">
        <span className="material-symbols-outlined text-on-success-container text-[22px]">
          folder_zip
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-title text-title text-on-surface truncate">
          {lote.empresaNombre}
        </p>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Lote {lote.loteCodigo} • {lote.cantidad}{" "}
          {lote.cantidad === 1 ? "examen" : "exámenes"}
        </p>
      </div>
      <span className="material-symbols-outlined text-on-surface-variant shrink-0">
        chevron_right
      </span>
    </button>
  );
}
