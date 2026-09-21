import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { loteBadgeInfo } from "@/lib/estadoUi";
import type { LoteConProgreso } from "@/lib/queries/lotes";

export function ExamCard({ lote }: { lote: LoteConProgreso }) {
  const badge = loteBadgeInfo(lote.estado);
  const finalizado = lote.estado === "FINALIZADO";

  return (
    <article className="flex flex-col bg-surface-container-lowest rounded-xl p-space-md shadow-card">
      <div className="flex items-start justify-between gap-space-xs mb-space-xs">
        <div className="flex flex-col min-w-0">
          <span className="font-label-sm text-label-sm text-primary uppercase font-semibold tracking-wider">
            Lote {lote.codigo}
          </span>
          <h3 className="font-title text-title text-on-surface leading-tight mt-0.5 truncate">
            {lote.empresaNombre}
          </h3>
        </div>
        <Badge icon={badge.icon} className={badge.className}>
          {badge.label}
        </Badge>
      </div>

      <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm flex items-center gap-1.5">
        <span className="material-symbols-outlined text-[18px] text-tertiary">
          science
        </span>
        {lote.tipoExamen}
      </p>

      <div className="grid grid-cols-2 gap-space-xs bg-surface-container-low rounded-lg p-space-sm mb-space-sm text-body-sm">
        <div className="flex items-center gap-1.5 text-on-surface-variant">
          <span className="material-symbols-outlined text-[18px]">event</span>
          <span>
            Límite:{" "}
            <strong className="text-on-surface">
              {format(lote.fechaLimite, "d MMM", { locale: es })}
            </strong>
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-on-surface-variant truncate">
          <span className="material-symbols-outlined text-[18px]">location_on</span>
          <span className="truncate">{lote.ubicacion}</span>
        </div>
      </div>

      <div className="flex flex-col gap-1 mb-space-md">
        <div className="flex justify-between items-center text-label-sm font-label-sm">
          <span className="text-on-surface-variant">
            Completados:{" "}
            <strong className="text-on-surface">
              {lote.completados} de {lote.total}
            </strong>
          </span>
          <span className="text-primary font-semibold">{lote.progresoPct}%</span>
        </div>
        <ProgressBar pct={lote.progresoPct} />
      </div>

      <Link
        href={`/examenes/${lote.id}/nomina`}
        className="w-full min-h-touch-target-min px-space-md bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-xl flex items-center justify-between font-label-lg text-label-lg active:scale-[0.99] transition-transform"
      >
        <span className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">
            group
          </span>
          {finalizado ? "Ver Historial de Nómina" : "Ver Nómina de Trabajadores"}
        </span>
        <span className="material-symbols-outlined text-on-surface-variant">
          chevron_right
        </span>
      </Link>
    </article>
  );
}
