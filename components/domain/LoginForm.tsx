"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { login } from "@/actions/auth";
import { formatCuit, isCompleteCuit } from "@/lib/cuit";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full h-[50px] mt-space-xs rounded-xl bg-primary-container text-on-primary font-headline-sm text-headline-sm flex items-center justify-center gap-2 shadow-md active:bg-primary active:scale-[0.99] transition-all disabled:opacity-70"
    >
      {pending ? (
        <>
          <span className="material-symbols-outlined animate-spin text-[20px]">
            sync
          </span>
          <span>Verificando credencial...</span>
        </>
      ) : (
        <>
          <span>Iniciar Sesión</span>
          <span className="material-symbols-outlined text-[20px]">
            arrow_forward
          </span>
        </>
      )}
    </button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState(login, undefined);
  const [cuit, setCuit] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full rounded-xl bg-surface-container-lowest shadow-md p-space-lg mb-space-md">
      <form action={formAction} className="flex flex-col gap-space-md">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label
              className="font-label-lg text-label-lg text-on-surface flex items-center gap-1.5"
              htmlFor="cuit-input"
            >
              <span className="material-symbols-outlined text-primary text-[18px]">
                badge
              </span>
              CUIT
            </label>
            {isCompleteCuit(cuit) && (
              <span className="items-center gap-1 font-label-sm text-label-sm text-secondary inline-flex">
                <span className="material-symbols-outlined text-[14px]">
                  check_circle
                </span>
                Válido
              </span>
            )}
          </div>
          <input
            id="cuit-input"
            name="cuit"
            inputMode="numeric"
            maxLength={13}
            placeholder="20-34589123-9"
            value={cuit}
            onChange={(e) => setCuit(formatCuit(e.target.value))}
            className="w-full h-[48px] px-space-md rounded-lg bg-surface-container-low text-on-surface font-body-lg text-body-lg placeholder:text-outline-variant focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            className="font-label-lg text-label-lg text-on-surface flex items-center gap-1.5"
            htmlFor="password-input"
          >
            <span className="material-symbols-outlined text-primary text-[18px]">
              lock
            </span>
            Contraseña
          </label>
          <div className="relative flex items-center">
            <input
              id="password-input"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••••"
              className="w-full h-[48px] pl-space-md pr-12 rounded-lg bg-surface-container-low text-on-surface font-body-lg text-body-lg placeholder:text-outline-variant focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
            />
            <button
              aria-label={
                showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
              }
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-1 w-[44px] h-[44px] flex items-center justify-center text-outline hover:text-primary active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[20px]">
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
        </div>

        {state?.error && (
          <p className="font-body-sm text-body-sm text-error" role="alert">
            {state.error}
          </p>
        )}

        <div className="flex items-center justify-end">
          <a
            className="font-label-md text-label-md text-primary hover:underline"
            href="#recuperar"
          >
            ¿Olvidó su clave?
          </a>
        </div>

        <SubmitButton />
      </form>
    </div>
  );
}
