import { TabShell } from "@/components/layout/TabShell";
import { RealizadosTable } from "@/components/domain/RealizadosTable";
import { getExamenesRealizados } from "@/lib/queries/realizados";

export default async function RealizadosPage() {
  const { totalListos, lotes } = await getExamenesRealizados();

  return (
    <TabShell active="realizados">
      <section className="flex flex-col items-center gap-1 text-center">
        <h1 className="font-headline-lg text-headline-lg text-on-surface">
          Exámenes Realizados
        </h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          {totalListos} {totalListos === 1 ? "examen listo" : "exámenes listos"} para
          exportar
        </p>
      </section>

      <RealizadosTable lotes={lotes} />
    </TabShell>
  );
}
