import { NextResponse } from "next/server";
import { getUsuarioByLogin } from "@/lib/models";
import { verifyPassword, createSession, type SessionUser } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { usuario, password } = await req.json().catch(() => ({}));
  if (!usuario || !password) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }
  const u = await getUsuarioByLogin(usuario);
  if (!u || !u.activo) {
    return NextResponse.json({ error: "Usuario o contraseña incorrectos." }, { status: 401 });
  }
  const ok = await verifyPassword(password, u.hash, u.salt);
  if (!ok) {
    return NextResponse.json({ error: "Usuario o contraseña incorrectos." }, { status: 401 });
  }
  const user: SessionUser = {
    id: u.id,
    usuario: u.usuario,
    nombre: u.nombre,
    rol: u.rol,
    permisos: u.permisos,
  };
  await createSession(user);
  return NextResponse.json({ ok: true, user });
}
