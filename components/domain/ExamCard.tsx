import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/Badge";
import { loteBadgeInfo } from "@/lib/estadoUi";
import { PERIODICIDAD_LOTE_LABEL } from "@/lib/types";
import type { LoteConProgreso } from "@/lib/queries/lotes";

export function ExamCard({ lote }: { lote: LoteConProgreso }) {
  const badge = loteBadgeInfo(lote.estado);

  return (
    <article className="flex flex-col gap-space-xs bg-surface-container-lowest rounded-xl p-space-md shadow-card">
      <div className="flex items-start justify-between gap-space-xs">
        <div className="flex flex-col min-w-0">
          <h3 className="font-title text-title text-on-surface leading-tight truncate">
            {lote.empresaNombre}
          </h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Lote {lote.codigo} · {PERIODICIDAD_LOTE_LABEL[lote.periodicidad]}
          </p>
        </div>
        <Badge icon={badge.icon} className={badge.className}>
          {badge.label}
        </Badge>
      </div>

      <div className="flex items-center justify-between font-body-sm text-body-sm text-on-surface-variant">
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px]">event</span>
          {format(lote.fechaLimite, "dd/MM/yyyy", { locale: es })}
        </span>
        <span className="font-label-sm text-label-sm text-primary">
          {lote.progresoPct}% completado
        </span>
      </div>

      <Link
        href={`/examenes/${lote.id}/nomina`}
        className="w-full min-h-touch-target-min px-space-md bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-xl flex items-center justify-between font-label-lg text-label-lg active:scale-[0.99] transition-transform"
      >
        <span className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">
            info
          </span>
          Ver Detalle
        </span>
        <span className="material-symbols-outlined text-on-surface-variant">
          chevron_right
        </span>
      </Link>
    </article>
  );
}
