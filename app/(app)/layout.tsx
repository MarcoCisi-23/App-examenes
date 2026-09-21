import { redirect } from "next/navigation";
import { getSessionEvaluador } from "@/lib/auth/session";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const evaluador = await getSessionEvaluador();
  if (!evaluador) {
    redirect("/login");
  }
  return children;
}
