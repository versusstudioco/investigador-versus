import { NextResponse } from "next/server";
import { requirePermission, AuthError } from "@/lib/auth";
import { updateUsuario, deleteUsuario, existsOtherWithLogin, type UsuarioInput } from "@/lib/models";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requirePermission("admin");
    const { id } = await params;
    const body = (await req.json()) as UsuarioInput;
    if (!body.usuario?.trim() || !body.nombre?.trim())
      return NextResponse.json({ error: "Usuario y nombre son obligatorios." }, { status: 400 });
    if (await existsOtherWithLogin(body.usuario, id))
      return NextResponse.json({ error: "Ya existe un usuario con ese nombre de ingreso." }, { status: 409 });
    await updateUsuario(id, body);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const err = e as AuthError;
    return NextResponse.json({ error: err.message }, { status: err.status ?? 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requirePermission("admin");
    const { id } = await params;
    await deleteUsuario(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const err = e as AuthError;
    return NextResponse.json({ error: err.message }, { status: err.status ?? 500 });
  }
}
