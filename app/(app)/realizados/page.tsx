import { TabShell } from "@/components/layout/TabShell";
import { RealizadosInteractive } from "@/components/domain/RealizadosInteractive";
import { StubActionButton } from "@/components/ui/StubActionButton";
import { getExamenesRealizados } from "@/lib/queries/realizados";

export default async function RealizadosPage() {
  const { totalListos, lotes } = await getExamenesRealizados();

  return (
    <TabShell active="realizados">
      <section className="flex flex-col gap-1">
        <h1 className="font-headline-md text-headline-md text-on-surface">
          Exámenes Realizados
        </h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          {totalListos} {totalListos === 1 ? "examen listo" : "exámenes listos"} para
          exportar
        </p>
      </section>

      <RealizadosInteractive lotes={lotes} />

      <StubActionButton variant="primary" icon="file_download" className="w-full">
        Exportar Todos ({totalListos})
      </StubActionButton>
    </TabShell>
  );
}
