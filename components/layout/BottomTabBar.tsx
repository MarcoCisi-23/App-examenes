import Link from "next/link";
import { clsx } from "clsx";

const TABS = [
  { key: "examenes", href: "/examenes", label: "Exámenes", icon: "assignment" },
  { key: "realizados", href: "/realizados", label: "Realizados", icon: "task_alt" },
  { key: "perfil", href: "/perfil", label: "Mi Perfil", icon: "manage_accounts" },
] as const;

export function BottomTabBar({ active }: { active: (typeof TABS)[number]["key"] }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 pb-safe bg-surface-container-lowest/90 backdrop-blur border-t border-outline-variant/40">
      <div className="grid grid-cols-3">
        {TABS.map((tab) => {
          const isActive = tab.key === active;
          return (
            <Link
              key={tab.key}
              href={tab.href}
              aria-current={isActive ? "page" : undefined}
              className={clsx(
                "flex flex-col items-center justify-center gap-0.5 py-space-xs min-h-touch-target-min",
                isActive ? "text-primary-container" : "text-on-surface-variant",
              )}
            >
              <span
                className="material-symbols-outlined text-[22px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {tab.icon}
              </span>
              <span
                className={clsx(
                  "font-label-sm text-label-sm",
                  isActive && "font-medium",
                )}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
