import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE_NAME = "art_session";
export const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7; // 7 días

function getSecretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("Falta la variable de entorno SESSION_SECRET");
  }
  return new TextEncoder().encode(secret);
}

export async function signSessionToken(evaluadorId: string): Promise<string> {
  return new SignJWT({ evaluadorId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey());
}

/** Corre en Edge (middleware) y en Node — no depende de next/headers ni de Prisma. */
export async function verifySessionToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    const evaluadorId = payload.evaluadorId;
    return typeof evaluadorId === "string" ? evaluadorId : null;
  } catch {
    return null;
  }
}
