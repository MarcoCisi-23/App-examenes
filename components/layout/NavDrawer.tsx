"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { clsx } from "clsx";

const NAV_ITEMS = [
  { key: "examenes", href: "/examenes", label: "Exámenes", icon: "assignment" },
  { key: "realizados", href: "/realizados", label: "Realizados", icon: "task_alt" },
  { key: "perfil", href: "/perfil", label: "Mi Perfil", icon: "manage_accounts" },
] as const;

function subscribeNoop() {
  return () => {};
}

/** true solo despues de hidratar en el cliente; false en el servidor. */
function useMounted(): boolean {
  return useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
}

export function NavDrawer({
  active,
}: {
  active: (typeof NAV_ITEMS)[number]["key"];
}) {
  const [open, setOpen] = useState(false);

  // El overlay se porta al final de <body>: el botón vive dentro del
  // <header>, que tiene backdrop-blur, y ese backdrop-filter convierte al
  // header en el "containing block" de cualquier hijo position:fixed —
  // el panel quedaba encerrado en los 64px del header en vez de ocupar
  // toda la pantalla. Portalizar lo saca de esa jerarquía.
  const mounted = useMounted();

  const overlay = (
    <div
      className={clsx(
        "fixed inset-0 z-40 transition-opacity",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      )}
      aria-hidden={!open}
    >
      <div
        className="absolute inset-0 bg-inverse-surface/40"
        onClick={() => setOpen(false)}
      />
      <nav
        className={clsx(
          "absolute top-0 right-0 bottom-0 w-64 max-w-[80%] bg-surface-container-lowest shadow-modal pt-safe pb-safe flex flex-col transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="h-16 px-space-md flex items-center justify-between border-b border-outline-variant/40 shrink-0">
          <span className="font-title text-title text-on-surface">Menú</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Cerrar menú"
            className="w-9 h-9 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-low"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
        <div className="flex flex-col p-space-sm gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = item.key === active;
            return (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={isActive ? "page" : undefined}
                className={clsx(
                  "flex items-center gap-space-sm px-space-md py-space-sm rounded-xl font-label-lg text-label-lg transition-colors",
                  isActive
                    ? "bg-primary-container text-on-primary"
                    : "text-on-surface hover:bg-surface-container-low",
                )}
              >
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Abrir menú"
        className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full text-on-surface hover:bg-surface-container-low transition-colors"
      >
        <span className="material-symbols-outlined text-[24px]">menu</span>
      </button>
      {mounted && createPortal(overlay, document.body)}
    </>
  );
}
