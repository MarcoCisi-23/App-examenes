import { TabShell } from "@/components/layout/TabShell";
import { Avatar } from "@/components/ui/Avatar";
import { OfflineToggle } from "@/components/domain/OfflineToggle";
import { LogoutButton } from "@/components/domain/LogoutButton";
import { requireSessionEvaluador } from "@/lib/auth/session";
import { formatCuit } from "@/lib/cuit";

export default async function PerfilPage() {
  const evaluador = await requireSessionEvaluador();

  const detalle = [
    evaluador.centroMedico,
    evaluador.matriculaNacional,
    evaluador.matriculaProvincial,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <TabShell active="perfil">
      <section className="flex flex-col items-center text-center gap-1">
        <Avatar nombre={evaluador.nombre} apellido={evaluador.apellido} size="lg" />
        <h1 className="font-headline-sm text-headline-sm text-on-surface">
          Dra. {evaluador.nombre} {evaluador.apellido}
        </h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          {evaluador.especialidad}
        </p>
        {detalle && (
          <p className="font-label-sm text-label-sm text-outline">{detalle}</p>
        )}
      </section>

      <section className="bg-surface-container-lowest rounded-xl p-space-md shadow-card flex flex-col gap-space-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-body-md text-body-md text-on-surface">
              CUIT Profesional
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {evaluador.cuitProfesional
                ? formatCuit(evaluador.cuitProfesional)
                : "—"}
            </p>
          </div>
          <span className="material-symbols-outlined text-success text-[18px]">
            check_circle
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-body-md text-body-md text-on-surface">
              Modo sin conexión
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Sincronización automática de peritajes
            </p>
          </div>
          <OfflineToggle />
        </div>
      </section>

      <p className="font-label-sm text-label-sm text-outline text-center flex items-center justify-center gap-1">
        <span className="material-symbols-outlined text-[14px]">lock</span>
        Sesión asegurada bajo protocolo TLS 1.3 y Res. SRT 102/2021
      </p>

      <LogoutButton />
    </TabShell>
  );
}
