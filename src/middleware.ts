import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE = "vl_session";

export async function middleware(req: NextRequest) {
  const secret = process.env.AUTH_SECRET;
  // Fail-open si no hay secreto configurado (evita bucles de login por mala config)
  if (!secret) return NextResponse.next();

  const { pathname } = req.nextUrl;
  const isPublic = pathname === "/login" || pathname.startsWith("/api/auth/");
  if (isPublic) return NextResponse.next();

  const token = req.cookies.get(COOKIE)?.value;
  let valid = false;
  if (token) {
    try {
      await jwtVerify(token, new TextEncoder().encode(secret));
      valid = true;
    } catch {
      valid = false;
    }
  }

  if (!valid) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  // Protege todo excepto estáticos y los logos públicos
  matcher: ["/((?!_next/static|_next/image|favicon.ico|versus-blanco.png|versus-negro.png|versus-rojo.png).*)"],
};
