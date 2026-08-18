import { NextResponse } from "next/server";
import { getCurrentUser, requirePermission, AuthError } from "@/lib/auth";
import { listCasos, createCaso } from "@/lib/models";
import { analizarViabilidad } from "@/lib/viability";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    return NextResponse.json({ casos: await listCasos() });
  } catch (e) {
    const err = e as AuthError;
    return NextResponse.json({ error: err.message }, { status: err.status ?? 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await requirePermission("buscar");
    const body = await req.json();
    const nombre = String(body.nombre || "").trim();
    const clases: number[] = Array.isArray(body.clases) ? body.clases.map(Number) : [];
    if (!nombre || clases.length === 0)
      return NextResponse.json({ error: "Marca y al menos una clase son obligatorias." }, { status: 400 });

    const descripcion = String(body.descripcion || "").trim();
    const mipyme = !!body.mipyme;
    const analisis = analizarViabilidad(nombre, clases, { descripcion, mipyme });
    const caso = await createCaso({
      nombre,
      tipo: String(body.tipo || "Nominativa"),
      titular: String(body.titular || "").trim() || "—",
      clases,
      descripcion,
      analisis,
      autor: user.nombre,
      autorId: user.id,
    });
    return NextResponse.json({ ok: true, caso });
  } catch (e) {
    const err = e as AuthError;
    return NextResponse.json({ error: err.message }, { status: err.status ?? 500 });
  }
}
