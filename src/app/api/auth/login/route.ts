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
  const row = await getUsuarioByLogin(usuario);
  if (!row || !Number(row.activo)) {
    return NextResponse.json({ error: "Usuario o contraseña incorrectos." }, { status: 401 });
  }
  const ok = await verifyPassword(password, String(row.hash), String(row.salt));
  if (!ok) {
    return NextResponse.json({ error: "Usuario o contraseña incorrectos." }, { status: 401 });
  }
  const user: SessionUser = {
    id: String(row.id),
    usuario: String(row.usuario),
    nombre: String(row.nombre),
    rol: String(row.rol),
    permisos: {
      buscar: !!Number(row.perm_buscar),
      revisar: !!Number(row.perm_revisar),
      descargar: !!Number(row.perm_descargar),
      admin: !!Number(row.perm_admin),
    },
  };
  await createSession(user);
  return NextResponse.json({ ok: true, user });
}
