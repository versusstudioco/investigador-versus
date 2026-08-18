"use client";

import { useState } from "react";
import type { CasoRow } from "@/lib/models";
import { generarPDF } from "@/lib/pdf";
import { PROCESO_INFO } from "@/lib/nice";

function badgeEstado(e: string) {
  const m: Record<string, string> = { Registrada: "badge-reg", "En trámite": "badge-tram", Negada: "badge-red" };
  return <span className={`badge ${m[e] || "badge-blue"}`}>{e}</span>;
}

export default function ResultadoViabilidad({ caso, puedeDescargar }: { caso: CasoRow; puedeDescargar: boolean }) {
  const a = caso.analisis;
  const [gen, setGen] = useState(false);

  async function descargar() {
    setGen(true);
    try { await generarPDF(caso); } finally { setGen(false); }
  }

  return (
    <>
      <div className="card">
        <div className="flex-between">
          <div>
            <h2>Resultado de viabilidad — {caso.nombre}</h2>
            <div className="card-desc">Clase(s): {caso.clases.join(", ")} · Tipo: {caso.tipo} · Titular: {caso.titular}</div>
          </div>
          {puedeDescargar && (
            <button className="btn btn-dark" onClick={descargar} disabled={gen}>
              {gen ? "Generando…" : "⬇ Descargar PDF"}
            </button>
          )}
        </div>
        <div className="gauge-wrap">
          <div className="gauge" style={{ background: `conic-gradient(${a.color} ${a.score}%, var(--gris-borde) 0)` }}>
            <div className="g-num" style={{ color: a.color }}>{a.score}%</div>
            <div className="g-sub">VIABILIDAD</div>
          </div>
          <div className="viab-txt" style={{ flex: 1, minWidth: 260 }}>
            <h3 style={{ color: a.color }}>{a.nivel}</h3>
            <p className="muted" style={{ margin: "6px 0 12px" }}>{a.recomendacion}</p>
            {a.factores.map((f, i) => (
              <div className="factor" key={i}>
                <div className="f-top"><span>{f.n}</span><b>{f.v}%</b></div>
                <div className="bar">
                  <i style={{ width: `${f.v}%`, background: f.v >= 70 ? "var(--verde)" : f.v >= 45 ? "var(--ambar)" : "var(--rojo)" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Antecedentes / coincidencias encontradas</h2>
        <div className="card-desc">Marcas iguales o similares en la base de referencia ({a.coincidencias.length}).</div>
        {a.coincidencias.length ? (
          <div style={{ overflowX: "auto" }}>
            <table>
              <thead><tr><th>Marca hallada</th><th>Clase</th><th>Similitud</th><th>Estado</th><th>Titular</th><th>Expediente</th></tr></thead>
              <tbody>
                {a.coincidencias.map((m, i) => (
                  <tr key={i}>
                    <td><b>{m.marca}</b> {m.mismaClase && <span className="badge badge-red">misma clase</span>}</td>
                    <td>{m.clase}</td>
                    <td><b>{m.sim}%</b></td>
                    <td>{badgeEstado(m.estado)}</td>
                    <td className="muted">{m.titular}</td>
                    <td className="muted">{m.expediente}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="muted">No se hallaron coincidencias relevantes en la base de referencia. <b>Confirmar siempre en SIPI.</b></p>
        )}
        <div className="note note-warn">
          Los antecedentes mostrados provienen de una base de <b>demostración</b>. La consulta con validez legal se realiza en{" "}
          <a href={PROCESO_INFO.portalOficial} target="_blank" rel="noopener noreferrer">SIPI de la SIC</a>.
        </div>
      </div>
    </>
  );
}
