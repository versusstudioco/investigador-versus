"use client";

import { useState } from "react";
import Link from "next/link";
import type { CasoRow } from "@/lib/models";
import { generarPDF } from "@/lib/pdf";
import { ESTADOS_CASO } from "@/lib/nice";

export default function CasosList({
  casosIniciales,
  puedeDescargar,
  puedeEliminar,
  puedeEditar,
}: {
  casosIniciales: CasoRow[];
  puedeDescargar: boolean;
  puedeEliminar: boolean;
  puedeEditar?: boolean;
}) {
  const [casos, setCasos] = useState(casosIniciales);
  const [busy, setBusy] = useState<string | null>(null);

  async function cambiarEstado(id: string, estado: string) {
    setCasos((cs) => cs.map((c) => (c.id === id ? { ...c, estado } : c)));
    await fetch(`/api/casos/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado }),
    }).catch(() => {});
  }

  async function eliminar(id: string) {
    if (!confirm("¿Eliminar este caso?")) return;
    setBusy(id);
    const res = await fetch(`/api/casos/${id}`, { method: "DELETE" });
    setBusy(null);
    if (res.ok) setCasos((cs) => cs.filter((c) => c.id !== id));
    else alert("No se pudo eliminar.");
  }

  if (casos.length === 0) return <p className="muted">No hay casos guardados todavía.</p>;

  return (
    <div style={{ overflowX: "auto" }}>
      <table>
        <thead>
          <tr><th>Marca</th><th>Titular</th><th>Clases</th><th>Viabilidad</th><th>Estado</th><th>Autor</th><th>Fecha</th><th></th></tr>
        </thead>
        <tbody>
          {casos.map((c) => (
            <tr key={c.id}>
              <td><b>{c.nombre}</b><br /><span className="tag-tipo">{c.tipo}</span></td>
              <td className="muted">{c.titular}</td>
              <td>{c.clases.join(", ")}</td>
              <td><b style={{ color: c.analisis.color }}>{c.analisis.score}%</b></td>
              <td>
                {puedeEditar ? (
                  <select value={c.estado || "Estudio"} onChange={(e) => cambiarEstado(c.id, e.target.value)} style={{ padding: "6px 8px", fontSize: 12, borderRadius: 8, maxWidth: 160 }}>
                    {ESTADOS_CASO.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                ) : <span className="badge badge-blue">{c.estado || "Estudio"}</span>}
              </td>
              <td className="muted">{c.autor || "—"}</td>
              <td className="muted">{new Date(c.fecha).toLocaleDateString("es-CO")}</td>
              <td style={{ whiteSpace: "nowrap" }}>
                <Link className="btn btn-outline btn-sm" href={`/casos/${c.id}`}>Ver</Link>{" "}
                {puedeDescargar && <button className="btn btn-ghost btn-sm" onClick={() => generarPDF(c)}>PDF</button>}{" "}
                {puedeEliminar && <button className="btn btn-danger btn-sm" disabled={busy === c.id} onClick={() => eliminar(c.id)}>✕</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
