import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Avatar } from "@/components/ui/Avatar";
import type { AsignacionDetalle } from "@/lib/queries/trabajadores";

const SEXO_LABEL: Record<string, string> = { M: "M", F: "F", X: "X" };

export function WorkerInfoCard({
  trabajador,
}: {
  trabajador: AsignacionDetalle["trabajador"];
}) {
  return (
    <section className="bg-surface-container-lowest rounded-xl p-space-md shadow-card">
      <div className="flex items-center gap-space-sm mb-space-sm">
        <Avatar nombre={trabajador.nombre} apellido={trabajador.apellido} size="lg" />
        <div className="min-w-0">
          <h2 className="font-headline-sm text-headline-sm text-on-surface truncate">
            {trabajador.apellido}, {trabajador.nombre}
          </h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
            {trabajador.puesto}
          </p>
          <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
            Empresa: {trabajador.empresaNombre} • Antigüedad: {trabajador.antiguedadAnios}{" "}
            años
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-space-xs bg-surface-container-low rounded-lg p-space-sm text-center mb-space-sm">
        <div className="flex flex-col items-center justify-center">
          <span className="font-label-md text-label-md text-on-surface">
            {trabajador.dni}
          </span>
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            DNI
          </span>
        </div>
        <div className="flex flex-col items-center justify-center">
          <span className="font-label-md text-label-md text-on-surface">
            {trabajador.edad}a ({SEXO_LABEL[trabajador.sexo] ?? trabajador.sexo})
          </span>
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            Edad/Sexo
          </span>
        </div>
        <div className="flex flex-col items-center justify-center">
          <span className="font-label-md text-label-md text-on-surface">
            {format(trabajador.fechaNacimiento, "dd/MM/yyyy", { locale: es })}
          </span>
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            Nacimiento
          </span>
        </div>
      </div>

      {trabajador.factoresRiesgo.length > 0 && (
        <div>
          <p className="font-label-md text-label-md text-on-surface-variant flex items-center gap-1 mb-space-xs">
            <span className="material-symbols-outlined text-[16px] text-warning">
              warning
            </span>
            Factores de Riesgo ART Declarados
          </p>
          <div className="flex flex-wrap gap-space-2xs">
            {trabajador.factoresRiesgo.map((factor) => (
              <span
                key={factor}
                className="inline-flex items-center px-2.5 py-1 rounded-full bg-warning-container text-on-warning-container font-label-sm text-label-sm"
              >
                {factor}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
