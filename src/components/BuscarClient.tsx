"use client";

import { useState } from "react";
import { NICE_CLASSES, PROCESO_INFO } from "@/lib/nice";
import type { CasoRow } from "@/lib/models";
import ResultadoViabilidad from "./ResultadoViabilidad";

export default function BuscarClient({ puedeDescargar }: { puedeDescargar: boolean }) {
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("Nominativa");
  const [titular, setTitular] = useState("");
  const [clases, setClases] = useState<number[]>([]);
  const [descripcion, setDescripcion] = useState("");
  const [mipyme, setMipyme] = useState(false);
  const [caso, setCaso] = useState<CasoRow | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function toggleClasesFromSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const vals = Array.from(e.target.selectedOptions).map((o) => Number(o.value));
    setClases(vals);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!nombre.trim() || clases.length === 0) {
      setError("Ingresa la marca y al menos una clase.");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/casos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, tipo, titular, clases, descripcion, mipyme }),
    });
    setLoading(false);
    if (res.ok) {
      const d = await res.json();
      setCaso(d.caso);
      setTimeout(() => document.getElementById("resultado")?.scrollIntoView({ behavior: "smooth" }), 50);
    } else {
      const d = await res.json().catch(() => ({}));
      setError(d.error || "No se pudo analizar.");
    }
  }

  return (
    <>
      <div className="card">
        <form onSubmit={onSubmit}>
          <div className="grid-2">
            <div className="field">
              <label>Marca / signo a consultar *</label>
              <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: LAS MANOS" required />
            </div>
            <div className="field">
              <label>Tipo de signo</label>
              <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                <option>Nominativa</option><option>Mixta</option><option>Figurativa</option>
                <option>Tridimensional</option><option>Sonora</option>
              </select>
            </div>
          </div>
          <div className="grid-2">
            <div className="field">
              <label>Titular / solicitante</label>
              <input value={titular} onChange={(e) => setTitular(e.target.value)} placeholder="Nombre del cliente o empresa" />
            </div>
            <div className="field">
              <label>Clase(s) de Niza * (Ctrl/Cmd para varias)</label>
              <select multiple size={5} onChange={toggleClasesFromSelect} required>
                {NICE_CLASSES.map((n) => (
                  <option key={n.c} value={n.c}>Clase {n.c} ({n.tipo}) — {n.t}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="field">
            <label>Descripción de productos / servicios</label>
            <textarea rows={2} value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Ej: prendas de vestir y calzado para dama" />
            <p className="muted" style={{ marginTop: 4 }}>Con la descripción, el sistema sugiere las clases de Niza que corresponden.</p>
          </div>
          <div className="field">
            <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
              <input type="checkbox" className="switch" checked={mipyme} onChange={(e) => setMipyme(e.target.checked)} />
              El titular es <b>MiPyme</b> (aplica tarifa reducida de la SIC)
            </label>
          </div>
          {error && <div className="login-error">{error}</div>}
          <div className="row">
            <button className="btn btn-primary" disabled={loading}>{loading ? "Analizando…" : "Analizar viabilidad"}</button>
            <a className="btn btn-ghost" href={PROCESO_INFO.portalOficial} target="_blank" rel="noopener noreferrer">Verificar en SIPI ↗</a>
          </div>
        </form>
      </div>

      {caso && (
        <div id="resultado" style={{ marginTop: 18 }}>
          <ResultadoViabilidad caso={caso} puedeDescargar={puedeDescargar} />
        </div>
      )}
    </>
  );
}
