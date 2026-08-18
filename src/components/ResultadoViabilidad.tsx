"use client";

import { useState } from "react";
import type { CasoRow } from "@/lib/models";
import { generarPDF } from "@/lib/pdf";
import { PROCESO_INFO } from "@/lib/nice";

function badgeEstado(e: string) {
  const m: Record<string, string> = { Registrada: "badge-reg", "En trámite": "badge-tram", Negada: "badge-red" };
  return <span className={`badge ${m[e] || "badge-blue"}`}>{e}</span>;
}

const cop = (n: number) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

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

      {a.clasesSugeridas && a.clasesSugeridas.length > 0 && (
        <div className="card">
          <h2>Clases sugeridas según la descripción</h2>
          <div className="card-desc">Según los productos/servicios descritos, estas son las clases de Niza que corresponderían.</div>
          <div style={{ overflowX: "auto" }}>
            <table>
              <thead><tr><th>Clase</th><th>Cobertura</th><th>Por qué</th><th>¿Ya registrada esta marca ahí?</th></tr></thead>
              <tbody>
                {a.clasesSugeridas.map((s) => (
                  <tr key={s.c}>
                    <td><b>Clase {s.c}</b> {s.seleccionada && <span className="badge badge-blue">seleccionada</span>}</td>
                    <td>{s.titulo}</td>
                    <td className="muted">{s.motivo}</td>
                    <td>{s.yaRegistrada ? <span className="badge badge-red">Sí, hay registro</span> : <span className="badge badge-reg">Sin registro idéntico</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="note">Sugerencia automática a partir de palabras clave. El abogado debe confirmar la clasificación final según el alcance real de la marca.</div>
        </div>
      )}

      {a.cotizacion && (
        <div className="card">
          <div className="flex-between">
            <div><h2>Cotización estimada para el cliente</h2>
            <div className="card-desc">Según la complejidad ({a.cotizacion.complejidad}) y {a.cotizacion.numClases} clase(s){a.cotizacion.mipyme ? " · tarifa MiPyme" : ""}.</div></div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: "var(--rojo)" }}>{cop(a.cotizacion.total)}</div>
              <div className="muted">total estimado</div>
            </div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table>
              <thead><tr><th>Concepto</th><th style={{ textAlign: "right" }}>Valor</th></tr></thead>
              <tbody>
                <tr><td>Honorarios profesionales (complejidad {a.cotizacion.complejidad})</td><td style={{ textAlign: "right" }}>{cop(a.cotizacion.honorarios)}</td></tr>
                <tr><td>Tasa oficial SIC — 1ª clase {a.cotizacion.mipyme ? "(MiPyme)" : ""}</td><td style={{ textAlign: "right" }}>{cop(a.cotizacion.tasaPrimera)}</td></tr>
                {a.cotizacion.numClases > 1 && (
                  <tr><td>Clases adicionales: {a.cotizacion.numClases - 1} × {cop(a.cotizacion.tasaAdicional)}</td><td style={{ textAlign: "right" }}>{cop(a.cotizacion.tasaAdicional * (a.cotizacion.numClases - 1))}</td></tr>
                )}
                <tr><td><b>Total estimado</b></td><td style={{ textAlign: "right" }}><b>{cop(a.cotizacion.total)}</b></td></tr>
              </tbody>
            </table>
          </div>
          <div className="note">Valores en pesos colombianos (COP). Los honorarios son estimados según la complejidad; la tasa oficial corresponde a la SIC (una por cada clase). Cotización de orientación, sujeta a confirmación del estudio.</div>
        </div>
      )}
    </>
  );
}
