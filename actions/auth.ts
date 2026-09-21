"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { normalizeCuit } from "@/lib/cuit";
import { verifyPassword } from "@/lib/auth/password";
import { createSessionCookie, clearSessionCookie } from "@/lib/auth/session";

export type LoginState = { error: string } | undefined;

export async function login(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const cuit = normalizeCuit(String(formData.get("cuit") ?? ""));
  const password = String(formData.get("password") ?? "");

  if (cuit.length !== 11 || !password) {
    return { error: "Ingresá un CUIT válido y tu contraseña." };
  }

  const evaluador = await prisma.evaluador.findUnique({ where: { cuit } });
  if (!evaluador) {
    return { error: "CUIT o contraseña incorrectos." };
  }

  const isValid = await verifyPassword(password, evaluador.passwordHash);
  if (!isValid) {
    return { error: "CUIT o contraseña incorrectos." };
  }

  await createSessionCookie(evaluador.id);
  redirect("/examenes");
}

export async function logout(): Promise<void> {
  await clearSessionCookie();
  redirect("/login");
}
