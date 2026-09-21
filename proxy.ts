import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/token";

const PUBLIC_PATHS = ["/login"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const evaluadorId = token ? await verifySessionToken(token) : null;
  const isAuthenticated = evaluadorId !== null;

  if (!isAuthenticated && !isPublicPath) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthenticated && isPublicPath) {
    const examenesUrl = new URL("/examenes", request.url);
    return NextResponse.redirect(examenesUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.\\w+$).*)"],
};
