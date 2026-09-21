"use client";

import { Button } from "@/components/ui/Button";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center gap-space-md bg-surface px-margin-screen text-center">
      <span className="material-symbols-outlined text-error text-[40px]">
        error
      </span>
      <div>
        <h1 className="font-headline-sm text-headline-sm text-on-surface mb-1">
          Ocurrió un error
        </h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          {error.message || "No pudimos completar la acción. Probá de nuevo."}
        </p>
      </div>
      <Button variant="primary" onClick={reset}>
        Reintentar
      </Button>
    </div>
  );
}
