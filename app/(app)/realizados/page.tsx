import { TabShell } from "@/components/layout/TabShell";
import { RealizadosInteractive } from "@/components/domain/RealizadosInteractive";
import { StubActionButton } from "@/components/ui/StubActionButton";
import { getExamenesRealizados } from "@/lib/queries/realizados";

export default async function RealizadosPage() {
  const { totalListos, lotes } = await getExamenesRealizados();

  return (
    <TabShell active="realizados">
      <section className="flex flex-col bg-surface-container-lowest rounded-xl p-space-md shadow-card gap-space-sm">
        <span className="font-label-sm text-label-sm text-primary uppercase font-semibold tracking-wider">
          Despacho Digital SRT
        </span>
        <h1 className="font-headline-md text-headline-md text-on-surface">
          Exámenes Realizados &amp; Envío de Resultados
        </h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Dictámenes cerrados con firma médica, listos para consolidar y enviar.
        </p>

        <div className="grid grid-cols-3 gap-space-xs bg-surface-container-low rounded-lg p-space-sm text-center mt-space-xs">
          <div className="flex flex-col items-center">
            <span className="font-headline-sm text-headline-sm text-primary">
              {totalListos}
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Listos
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-headline-sm text-headline-sm text-on-surface">
              {lotes.length}
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Lotes
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-headline-sm text-headline-sm text-success">0</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Sin errores
            </span>
          </div>
        </div>
      </section>

      <RealizadosInteractive lotes={lotes} />

      <section className="flex items-center gap-space-sm bg-surface-container-low rounded-xl p-space-md">
        <span className="material-symbols-outlined text-primary text-[24px]">
          fingerprint
        </span>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Firma Digital Homologada: los informes incluyen token criptográfico de la
          Superintendencia.
        </p>
      </section>

      <StubActionButton variant="primary" icon="file_download" className="w-full">
        Exportar Todos ({totalListos} listos)
      </StubActionButton>
    </TabShell>
  );
}
