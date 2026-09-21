"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

type ButtonProps = React.ComponentProps<typeof Button>;

/**
 * Botón para acciones aún no implementadas (exportar/enviar resultados).
 * No genera ni envía nada real: solo confirma que la interfaz está lista
 * para cuando se conecte la integración real (fuera del alcance de este MVP).
 */
export function StubActionButton({ children, ...props }: ButtonProps) {
  const [mostrarAviso, setMostrarAviso] = useState(false);

  return (
    <div className="flex flex-col gap-space-2xs">
      <Button
        {...props}
        onClick={() => setMostrarAviso(true)}
        type="button"
      >
        {children}
      </Button>
      {mostrarAviso && (
        <p className="font-label-sm text-label-sm text-on-surface-variant text-center">
          Función disponible próximamente.
        </p>
      )}
    </div>
  );
}
