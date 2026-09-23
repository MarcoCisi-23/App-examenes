import { redirect } from "next/navigation";
import { getSessionEvaluador } from "@/lib/auth/session";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const evaluador = await getSessionEvaluador();
  if (!evaluador) {
    // No usar redirect("/login") acá: si la cookie tiene una firma válida
    // pero apunta a un evaluador que ya no existe, proxy.ts la seguiría
    // viendo como "autenticada" y nos mandaría de vuelta a /examenes,
    // generando un loop de redirecciones. /session-expired limpia la
    // cookie antes de mandar a /login.
    redirect("/session-expired");
  }
  return children;
}
