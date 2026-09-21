import { Badge } from "@/components/ui/Badge";
import { StubActionButton } from "@/components/ui/StubActionButton";
import { DICTAMEN_LABEL } from "@/lib/types";
import type { LoteRealizado } from "@/lib/queries/realizados";

const DICTAMEN_BADGE_CLASS: Record<string, string> = {
  APTO: "bg-success-container text-on-success-container",
  APTO_CON_PREEXISTENCIAS: "bg-warning-container text-on-warning-container",
  NO_APTO_TEMPORAL: "bg-error-container text-on-error-container",
};

export function RealizadosBatchCard({ lote }: { lote: LoteRealizado }) {
  return (
    <article className="flex flex-col bg-surface-container-lowest rounded-xl p-space-md shadow-card gap-space-sm">
      <div className="flex items-start justify-between gap-space-xs">
        <div className="min-w-0">
          <span className="font-label-sm text-label-sm text-primary uppercase font-semibold tracking-wider">
            Lote {lote.loteCodigo}
          </span>
          <h3 className="font-title text-title text-on-surface truncate">
            {lote.empresaNombre}
          </h3>
        </div>
        <Badge className="bg-success-container text-on-success-container" icon="check_circle">
          {lote.cantidad} {lote.cantidad === 1 ? "examen" : "exámenes"}
        </Badge>
      </div>

      <ul className="flex flex-col gap-1.5">
        {lote.registros.map((registro) => (
          <li
            key={registro.asignacionId}
            className="flex items-center justify-between gap-space-xs bg-surface-container-low rounded-lg px-space-sm py-space-xs"
          >
            <div className="min-w-0">
              <p className="font-body-md text-body-md text-on-surface truncate">
                {registro.trabajadorApellido}, {registro.trabajadorNombre}
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                DNI {registro.dni} • {registro.puesto}
              </p>
            </div>
            {registro.dictamen && (
              <span
                className={`shrink-0 px-2 py-0.5 rounded-full font-label-sm text-label-sm ${
                  DICTAMEN_BADGE_CLASS[registro.dictamen]
                }`}
              >
                {DICTAMEN_LABEL[registro.dictamen]}
              </span>
            )}
          </li>
        ))}
      </ul>

      <div className="grid grid-cols-2 gap-space-xs">
        <StubActionButton variant="secondary" icon="picture_as_pdf">
          PDF Consolidado
        </StubActionButton>
        <StubActionButton variant="secondary" icon="table_view">
          Excel / CSV
        </StubActionButton>
      </div>
      <StubActionButton variant="primary" icon="mark_email_read" className="w-full">
        Enviar por Correo a RRHH / ART
      </StubActionButton>
    </article>
  );
}
