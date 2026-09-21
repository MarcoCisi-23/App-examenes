import "server-only";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import type { Evaluador } from "@/lib/generated/prisma/client";
import {
  SESSION_COOKIE_NAME,
  SESSION_DURATION_SECONDS,
  signSessionToken,
  verifySessionToken,
} from "@/lib/auth/token";

export async function createSessionCookie(evaluadorId: string): Promise<void> {
  const token = await signSessionToken(evaluadorId);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getSessionEvaluadorId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function getSessionEvaluador(): Promise<Evaluador | null> {
  const evaluadorId = await getSessionEvaluadorId();
  if (!evaluadorId) return null;
  return prisma.evaluador.findUnique({ where: { id: evaluadorId } });
}

/** Para Server Components/Actions que requieren estar autenticados. */
export async function requireSessionEvaluador(): Promise<Evaluador> {
  const evaluador = await getSessionEvaluador();
  if (!evaluador) {
    throw new Error("No hay sesión activa");
  }
  return evaluador;
}
