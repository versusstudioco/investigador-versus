import { NextResponse } from "next/server";
import { getCurrentUser, requirePermission, AuthError } from "@/lib/auth";
import { getCaso, deleteCaso, updateChecklist } from "@/lib/models";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  const { id } = await params;
  const caso = await getCaso(id);
  if (!caso) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json({ caso });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requirePermission("revisar");
    const { id } = await params;
    const body = await req.json();
    await updateChecklist(id, body.checklist || {});
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
    await deleteCaso(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const err = e as AuthError;
    return NextResponse.json({ error: err.message }, { status: err.status ?? 500 });
  }
}
