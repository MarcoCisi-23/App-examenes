import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import type { DefinicionEstudio } from "@/lib/estudios/registry";

export function StudyFormSection({
  definicion,
  datos,
  cargado,
}: {
  definicion: DefinicionEstudio;
  datos: Record<string, unknown> | null;
  cargado: boolean;
}) {
  const valorDe = (campo: string): string => {
    const valor = datos?.[campo];
    return valor === undefined || valor === null ? "" : String(valor);
  };

  return (
    <section className="bg-surface-container-lowest rounded-xl p-space-md shadow-card">
      <div className="flex items-center justify-between mb-space-sm">
        <div className="flex items-center gap-space-xs min-w-0">
          <span className="material-symbols-outlined text-primary text-[22px] shrink-0">
            {definicion.icon}
          </span>
          <div className="min-w-0">
            <h3 className="font-title text-title text-on-surface">
              {definicion.label}
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {definicion.descripcion}
            </p>
          </div>
        </div>
        <span
          className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-label-sm text-label-sm ${
            cargado
              ? "bg-success-container text-on-success-container"
              : "bg-surface-variant text-on-surface-variant"
          }`}
        >
          <span className="material-symbols-outlined text-[14px]">
            {cargado ? "check_circle" : "edit"}
          </span>
          {cargado ? "Cargado" : "Listo para cargar"}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
        {definicion.campos.map((campo) => {
          const name = `${definicion.tipo}.${campo.name}`;
          const fullWidth = campo.type === "textarea" || campo.type === "select";

          if (campo.type === "select") {
            return (
              <div key={campo.name} className={fullWidth ? "sm:col-span-2" : undefined}>
                <Select
                  name={name}
                  label={campo.label}
                  options={campo.options ?? []}
                  defaultValue={valorDe(campo.name)}
                />
              </div>
            );
          }

          if (campo.type === "textarea") {
            return (
              <div key={campo.name} className="sm:col-span-2">
                <Textarea
                  name={name}
                  label={campo.label}
                  defaultValue={valorDe(campo.name)}
                  rows={2}
                />
              </div>
            );
          }

          if (campo.type === "file") {
            return (
              <Input
                key={campo.name}
                name={name}
                label={campo.label}
                placeholder="nombre_archivo.pdf"
                defaultValue={valorDe(campo.name)}
              />
            );
          }

          return (
            <Input
              key={campo.name}
              name={name}
              type={campo.type === "number" ? "number" : "text"}
              step={campo.type === "number" ? "any" : undefined}
              label={campo.label}
              unit={campo.unit}
              placeholder={campo.placeholder}
              defaultValue={valorDe(campo.name)}
            />
          );
        })}
      </div>
    </section>
  );
}
