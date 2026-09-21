"use client";

import { logout } from "@/actions/auth";
import { Button } from "@/components/ui/Button";

export function LogoutButton() {
  return (
    <Button
      type="button"
      variant="destructive"
      icon="logout"
      className="w-full"
      onClick={() => {
        if (
          confirm(
            "¿Está seguro de que desea cerrar la sesión segura? Se sincronizarán los registros pendientes antes de salir.",
          )
        ) {
          logout();
        }
      }}
    >
      Cerrar Sesión Segura
    </Button>
  );
}
