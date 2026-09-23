import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth/session";

/**
 * La cookie de sesión puede seguir siendo válida (firma JWT intacta) aunque
 * el evaluador ya no exista en la base (p. ej. después de un reseed). El
 * layout de (app) detecta ese caso pero, al ser un Server Component, no
 * puede borrar la cookie él mismo — por eso redirige acá, que sí puede.
 * Sin este paso, proxy.ts seguiría viendo la cookie como "autenticada" y
 * rebotaría entre /login y /examenes en un loop infinito.
 */
export async function GET(request: Request) {
  await clearSessionCookie();
  return NextResponse.redirect(new URL("/login", request.url));
}
