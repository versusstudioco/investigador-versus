"use client";

import { useMemo, useState } from "react";
import { NICE_CLASSES, PROCESO_INFO, claseTitulo, sugerirClasesDesc, buscarClasesPorTermino } from "@/lib/nice";
import type { CasoRow } from "@/lib/models";
import ResultadoViabilidad from "./ResultadoViabilidad";

export default function BuscarClient({ puedeDescargar, puedeEditar = false }: { puedeDescargar: boolean; puedeEditar?: boolean }) {
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("Nominativa");
  const [titular, setTitular] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [clases, setClases] = useState<number[]>([]);
  const [mipyme, setMipyme] = useState(false);
  const [manual, setManual] = useState("");
  const [filtro, setFiltro] = useState("");
  const resultadosFiltro = useMemo(() => buscarClasesPorTermino(filtro), [filtro]);
  const [caso, setCaso] = useState<CasoRow | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Sugerencias en vivo según la descripción
  const sugerencias = useMemo(() => sugerirClasesDesc(descripcion), [descripcion]);

  function toggleClase(c: number) {
    setClases((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  }
  function agregarManual() {
    const c = Number(manual);
    if (c && !clases.includes(c)) setClases((prev) => [...prev, c]);
    setManual("");
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!nombre.trim()) return setError("Escribe el nombre de la marca.");
    if (clases.length === 0) return setError("Selecciona al menos una clase (usa las sugerencias o agrégala manualmente).");
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
          {/* Paso 1: identidad de la marca */}
          <div className="grid-2">
            <div className="field">
              <label>1. Marca / signo a consultar *</label>
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
          <div className="field">
            <label>Titular / solicitante</label>
            <input value={titular} onChange={(e) => setTitular(e.target.value)} placeholder="Nombre del cliente o empresa" />
          </div>

          {/* Paso 2: describir la marca → sugerencias */}
          <div className="field">
            <label>2. ¿Qué vende o hace la marca? (describe para sugerirte las clases) *</label>
            <textarea rows={3} value={descripcion} onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Ej: fabricamos y vendemos ropa y calzado para dama, también tenemos tienda online y hacemos publicidad de moda" />
          </div>

          {/* Paso 3: clases sugeridas seleccionables */}
          <div className="field">
            <label>3. Selecciona las clases de Niza que apliquen *</label>
            {descripcion.trim() === "" ? (
              <p className="muted">Escribe la descripción arriba y aquí aparecerán las clases sugeridas para seleccionar.</p>
            ) : sugerencias.length === 0 ? (
              <p className="muted">No detectamos clases automáticamente. Agrégalas manualmente abajo. 👇</p>
            ) : (
              <div className="sugerencias">
                {sugerencias.map((s) => {
                  const on = clases.includes(s.c);
                  return (
                    <button type="button" key={s.c} onClick={() => toggleClase(s.c)}
                      className={`sug-item ${on ? "on" : ""}`}>
                      <span className="sug-check">{on ? "✓" : "+"}</span>
                      <span>
                        <b>Clase {s.c}</b> — {s.titulo}
                        <span className="sug-motivo">coincide con: {s.motivo}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Filtro: buscar la clase por producto/servicio específico */}
          <div className="field">
            <label>🔎 ¿No sabes la clase? Busca por producto o servicio específico</label>
            <input value={filtro} onChange={(e) => setFiltro(e.target.value)} placeholder="Ej: zapatos, restaurante, software, joyas, cerveza…" />
            {filtro.trim().length >= 2 && (
              resultadosFiltro.length > 0 ? (
                <div className="sugerencias" style={{ marginTop: 10 }}>
                  {resultadosFiltro.map((r) => {
                    const on = clases.includes(r.c);
                    return (
                      <button type="button" key={r.c} onClick={() => toggleClase(r.c)} className={`sug-item ${on ? "on" : ""}`}>
                        <span className="sug-check">{on ? "✓" : "+"}</span>
                        <span><b>Clase {r.c}</b> — {r.titulo}<span className="sug-motivo">{r.parecido ? "parecido a" : "coincide con"}: {r.termino}</span></span>
                      </button>
                    );
                  })}
                </div>
              ) : <p className="muted" style={{ marginTop: 8 }}>Sin coincidencias. Prueba otra palabra o usa la lista completa abajo.</p>
            )}
          </div>

          {/* Lista completa (opcional) */}
          <div className="field">
            <label>O elige de la lista completa (opcional)</label>
            <div className="row" style={{ alignItems: "center" }}>
              <select value={manual} onChange={(e) => setManual(e.target.value)} style={{ maxWidth: 520 }}>
                <option value="">Elegir una clase…</option>
                {NICE_CLASSES.map((n) => (
                  <option key={n.c} value={n.c}>Clase {n.c} ({n.tipo}) — {n.t}</option>
                ))}
              </select>
              <button type="button" className="btn btn-outline btn-sm" onClick={agregarManual} disabled={!manual}>Agregar</button>
            </div>
          </div>

          {/* Clases seleccionadas */}
          {clases.length > 0 && (
            <div className="field">
              <label>Clases seleccionadas ({clases.length})</label>
              <div className="chips">
                {clases.map((c) => (
                  <span className="chip" key={c}>
                    <b>Clase {c}</b> — {claseTitulo(c).slice(0, 30)}
                    <button type="button" onClick={() => toggleClase(c)} className="chip-x" aria-label="Quitar">✕</button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* MiPyme */}
          <div className="field">
            <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
              <input type="checkbox" className="switch" checked={mipyme} onChange={(e) => setMipyme(e.target.checked)} />
              El titular es <b>MiPyme</b> (aplica tarifa reducida de la SIC)
            </label>
          </div>

          <div className="note" style={{ marginTop: 4 }}>
            <b>📋 Cómo consultar en la SIC (SIPI) y en OMPI — paso a paso</b>
            <ol style={{ margin: "8px 0 0 18px", padding: 0, fontSize: 13, lineHeight: 1.7 }}>
              <li>Escribe la marca y su descripción, y dale <b>“Analizar viabilidad”</b> (te da el % y las clases).</li>
              <li><b>OMPI</b> (recomendado, gratis, incluye Colombia): abre <b>“Buscar en OMPI”</b>, filtra por país <b>Colombia (CO)</b> y revisa marcas iguales y <b>similares</b>.</li>
              <li><b>SIPI de la SIC</b>: abre <b>“Verificar en SIPI”</b> → módulo <b>Signos Distintivos → Buscar</b> → busca en tu(s) clase(s).</li>
              <li>De cada marca parecida anota: <b>nombre, clase, estado, expediente y titular</b>.</li>
              <li>En el resultado, sección <b>“Verificación oficial de marcas”</b>, regístralas → quedan en el informe/PDF. ✅</li>
            </ol>
          </div>

          {error && <div className="login-error">{error}</div>}
          <div className="row">
            <button className="btn btn-primary" disabled={loading}>{loading ? "Analizando…" : "Analizar viabilidad"}</button>
            <a className="btn btn-ghost" href={nombre.trim() ? `https://branddb.wipo.int/en/similarname?q=${encodeURIComponent(nombre)}` : "https://branddb.wipo.int"} target="_blank" rel="noopener noreferrer">Buscar en OMPI ↗</a>
            <a className="btn btn-ghost" href={PROCESO_INFO.portalOficial} target="_blank" rel="noopener noreferrer">Verificar en SIPI ↗</a>
          </div>
        </form>
      </div>

      {caso && (
        <div id="resultado" style={{ marginTop: 18 }}>
          <ResultadoViabilidad caso={caso} puedeDescargar={puedeDescargar} puedeEditar={puedeEditar} />
        </div>
      )}
    </>
  );
}
