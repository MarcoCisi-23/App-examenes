import { TabShell } from "@/components/layout/TabShell";
import { Avatar } from "@/components/ui/Avatar";
import { OfflineToggle } from "@/components/domain/OfflineToggle";
import { LogoutButton } from "@/components/domain/LogoutButton";
import { requireSessionEvaluador } from "@/lib/auth/session";
import { getAuditadosEsteMes } from "@/lib/queries/evaluador";
import { formatCuit } from "@/lib/cuit";

export default async function PerfilPage() {
  const evaluador = await requireSessionEvaluador();
  const auditadosEsteMes = await getAuditadosEsteMes(evaluador.id);

  return (
    <TabShell active="perfil">
      <section className="flex flex-col items-center text-center bg-surface-container-lowest rounded-xl p-space-lg shadow-card gap-space-xs">
        <Avatar nombre={evaluador.nombre} apellido={evaluador.apellido} size="lg" />
        <h1 className="font-headline-sm text-headline-sm text-on-surface">
          Dra. {evaluador.nombre} {evaluador.apellido}
        </h1>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success-container text-on-success-container font-label-sm text-label-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-success" />
          Activa
        </span>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          {evaluador.especialidad}
        </p>
        <div className="flex gap-space-xs flex-wrap justify-center">
          {evaluador.matriculaNacional && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-[14px]">badge</span>
              {evaluador.matriculaNacional}
            </span>
          )}
          {evaluador.matriculaProvincial && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-[14px]">
                local_hospital
              </span>
              {evaluador.matriculaProvincial}
            </span>
          )}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-space-sm">
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-card">
          <p className="font-label-md text-label-md text-on-surface-variant mb-1">
            Auditados este mes
          </p>
          <p className="font-headline-md text-headline-md text-on-surface">
            {auditadosEsteMes} exámenes
          </p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-card">
          <p className="font-label-md text-label-md text-on-surface-variant mb-1">
            Centro Médico
          </p>
          <p className="font-title text-title text-on-surface">
            {evaluador.centroMedico ?? "Sin asignar"}
          </p>
        </div>
      </section>

      <section className="bg-surface-container-lowest rounded-xl p-space-md shadow-card flex flex-col gap-space-sm">
        <div className="flex items-center gap-space-xs">
          <span className="material-symbols-outlined text-primary text-[20px]">
            verified_user
          </span>
          <h2 className="font-title text-title text-on-surface">
            Credenciales Oficiales
          </h2>
        </div>

        <div className="flex items-center justify-between py-space-xs border-b border-outline-variant/40">
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

        <div className="flex items-center justify-between py-space-xs">
          <div>
            <p className="font-body-md text-body-md text-on-surface">
              Firma Digital Registrada
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Token criptográfico activo
            </p>
          </div>
          <span className="material-symbols-outlined text-outline text-[18px]">
            lock
          </span>
        </div>
      </section>

      <section className="bg-surface-container-lowest rounded-xl p-space-md shadow-card flex flex-col gap-space-sm">
        <h2 className="font-title text-title text-on-surface">
          Configuración y Herramientas
        </h2>
        <div className="flex items-center justify-between py-space-xs">
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
