import { LoginForm } from "@/components/domain/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex-1 flex flex-col justify-center items-center min-h-dvh bg-surface px-margin-screen py-space-2xl">
      <div className="w-full max-w-sm flex flex-col items-center">
        <div className="mb-space-xl flex flex-col items-center gap-space-xs text-center">
          <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center mb-space-xs shadow-md">
            <span className="material-symbols-outlined text-on-primary text-[32px]">
              health_and_safety
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">
            Iniciar Sesión
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Ingresá con tu CUIT y contraseña
          </p>
        </div>

        <LoginForm />

        <div className="flex flex-col items-center justify-center text-center gap-1.5 px-space-md py-space-xs">
          <p className="font-label-sm text-label-sm text-outline flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">
              lock
            </span>
            Sistema seguro ART • Res. SRT
          </p>
        </div>
      </div>
    </main>
  );
}
