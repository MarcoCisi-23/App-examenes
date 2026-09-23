"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { guardarExamen } from "@/actions/examenes";
import { StudyFormSection } from "@/components/domain/StudyFormSection";
import { DictamenSelector } from "@/components/domain/DictamenSelector";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { ESTUDIOS_REGISTRY } from "@/lib/estudios/registry";
import type { AsignacionDetalle } from "@/lib/queries/trabajadores";

function FooterButtons() {
  const { pending } = useFormStatus();
  return (
    <>
      <Button
        type="submit"
        name="intent"
        value="finalizar"
        variant="primary"
        icon="check_circle"
        disabled={pending}
        className="w-full"
      >
        Guardar y Finalizar Examen
      </Button>
      <Button
        type="submit"
        name="intent"
        value="borrador"
        variant="secondary"
        icon="save"
        disabled={pending}
        className="w-full"
      >
        Guardar Borrador Parcial
      </Button>
    </>
  );
}

export function ExamFormClient({
  loteId,
  trabajadorId,
  asignacion,
}: {
  loteId: string;
  trabajadorId: string;
  asignacion: AsignacionDetalle;
}) {
  const guardarConIds = guardarExamen.bind(
    null,
    loteId,
    trabajadorId,
    asignacion.asignacionId,
  );
  const [state, formAction] = useActionState(guardarConIds, undefined);

  const cargados = asignacion.estudios.filter((e) => e.estado === "CARGADO").length;

  return (
    <form action={formAction} className="flex flex-col gap-space-md">
      <section className="flex flex-col gap-space-xs">
        <div className="flex items-center justify-between">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">
            Estudios Médicos Requeridos
          </h2>
          <span className="font-label-md text-label-md text-on-surface-variant">
            {cargados} de {asignacion.estudios.length} cargados
          </span>
        </div>
      </section>

      {asignacion.estudios.map((estudio) => (
        <StudyFormSection
          key={estudio.estudioRequeridoId}
          definicion={ESTUDIOS_REGISTRY[estudio.tipo]}
          datos={estudio.datos}
          cargado={estudio.estado === "CARGADO"}
        />
      ))}

      <details className="group bg-surface-container-lowest rounded-xl shadow-card">
        <summary className="flex items-center justify-between p-space-md cursor-pointer list-none [&::-webkit-details-marker]:hidden">
          <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">
              gavel
            </span>
            Dictamen Preliminar
          </h2>
          <span className="material-symbols-outlined text-on-surface-variant text-[20px] transition-transform group-open:rotate-180">
            expand_more
          </span>
        </summary>
        <div className="flex flex-col gap-space-sm px-space-md pb-space-md">
          <DictamenSelector defaultValue={asignacion.dictamen} />
          <Textarea
            name="observaciones"
            label="Observaciones Médicas y Recomendaciones"
            placeholder="Notas clínicas para uso profesional..."
            defaultValue={asignacion.observacionesMedicas ?? ""}
          />
        </div>
      </details>

      {state?.error && (
        <p
          role="alert"
          className="bg-error-container text-on-error-container rounded-lg px-space-md py-space-sm font-body-sm text-body-sm"
        >
          {state.error}
        </p>
      )}
      {state?.success && (
        <p
          role="status"
          className="bg-success-container text-on-success-container rounded-lg px-space-md py-space-sm font-body-sm text-body-sm flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          {state.success}
        </p>
      )}

      <div className="sticky bottom-0 -mx-margin-screen px-margin-screen py-space-sm bg-surface/95 backdrop-blur border-t border-outline-variant/40 flex flex-col gap-space-xs">
        <FooterButtons />
      </div>
    </form>
  );
}
