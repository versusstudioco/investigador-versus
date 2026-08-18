import { NextResponse } from "next/server";
import { requirePermission, AuthError } from "@/lib/auth";
import { listUsuarios, createUsuario, existsOtherWithLogin, type UsuarioInput } from "@/lib/models";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requirePermission("admin");
    return NextResponse.json({ usuarios: await listUsuarios() });
  } catch (e) {
    const err = e as AuthError;
    return NextResponse.json({ error: err.message }, { status: err.status ?? 500 });
  }
}

export async function POST(req: Request) {
  try {
    await requirePermission("admin");
    const body = (await req.json()) as UsuarioInput;
    if (!body.usuario?.trim() || !body.nombre?.trim())
      return NextResponse.json({ error: "Usuario y nombre son obligatorios." }, { status: 400 });
    if (!body.password) return NextResponse.json({ error: "La contraseña es obligatoria." }, { status: 400 });
    if (await existsOtherWithLogin(body.usuario, ""))
      return NextResponse.json({ error: "Ya existe un usuario con ese nombre de ingreso." }, { status: 409 });
    await createUsuario(body);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const err = e as AuthError;
    return NextResponse.json({ error: err.message }, { status: err.status ?? 500 });
  }
}
