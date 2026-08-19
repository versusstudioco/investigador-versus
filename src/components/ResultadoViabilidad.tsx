"use client";

import { useState } from "react";
import type { CasoRow, AntecedenteSIPI, Requerimiento } from "@/lib/models";
import { generarPDF } from "@/lib/pdf";
import { PROCESO_INFO, NICE_CLASSES } from "@/lib/nice";

function badgeEstado(e: string) {
  const m: Record<string, string> = { Registrada: "badge-reg", "En trámite": "badge-tram", Negada: "badge-red" };
  return <span className={`badge ${m[e] || "badge-blue"}`}>{e}</span>;
}

const cop = (n: number) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

export default function ResultadoViabilidad({ caso, puedeDescargar, puedeEditar = false }: { caso: CasoRow; puedeDescargar: boolean; puedeEditar?: boolean }) {
  const a = caso.analisis;
  const [gen, setGen] = useState(false);

  // Verificación SIPI (captura manual del abogado)
  const [antecedentes, setAntecedentes] = useState<AntecedenteSIPI[]>(caso.antecedentesSIPI || []);
  const [ant, setAnt] = useState({ marca: caso.nombre, clase: String(caso.clases[0] || ""), estado: "Registrada", expediente: "", titular: "" });
  const [guardando, setGuardando] = useState(false);

  // Requerimientos / seguimiento del expediente
  const [requerimientos, setRequerimientos] = useState<Requerimiento[]>(caso.requerimientos || []);
  const [req, setReq] = useState({ tipo: "Requerimiento de forma", expediente: "", fechaNotificacion: "", fechaLimite: "", descripcion: "", estado: "Pendiente" });
  const [guardandoReq, setGuardandoReq] = useState(false);

  const casoConAnt = { ...caso, antecedentesSIPI: antecedentes, requerimientos };

  async function guardarRequerimientos(lista: Requerimiento[]) {
    const res = await fetch(`/api/casos/${caso.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requerimientos: lista }),
    });
    return res.ok;
  }
  async function agregarReq() {
    if (!req.fechaLimite) return alert("Indica la fecha límite para responder.");
    const nuevo: Requerimiento = { ...req, registradoPor: caso.autor || "—" };
    const lista = [...requerimientos, nuevo];
    setGuardandoReq(true);
    const ok = await guardarRequerimientos(lista);
    setGuardandoReq(false);
    if (ok) { setRequerimientos(lista); setReq({ ...req, expediente: "", fechaNotificacion: "", fechaLimite: "", descripcion: "" }); }
    else alert("No se pudo guardar el requerimiento.");
  }
  async function quitarReq(i: number) {
    const lista = requerimientos.filter((_, idx) => idx !== i);
    if (await guardarRequerimientos(lista)) setRequerimientos(lista);
  }
  async function cambiarEstadoReq(i: number, estado: string) {
    const lista = requerimientos.map((r, idx) => (idx === i ? { ...r, estado } : r));
    if (await guardarRequerimientos(lista)) setRequerimientos(lista);
  }
  function diasRestantes(fechaLimite: string): number | null {
    if (!fechaLimite) return null;
    const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
    const lim = new Date(fechaLimite + "T00:00:00");
    return Math.round((lim.getTime() - hoy.getTime()) / 86400000);
  }

  async function descargar() {
    setGen(true);
    try { await generarPDF(casoConAnt); } finally { setGen(false); }
  }

  async function agregarAntecedente() {
    if (!ant.marca.trim() || !ant.clase) return alert("Marca y clase son obligatorias.");
    const nuevo: AntecedenteSIPI = {
      marca: ant.marca.trim(), clase: Number(ant.clase), estado: ant.estado,
      expediente: ant.expediente.trim(), titular: ant.titular.trim(),
      registradoPor: caso.autor || "—", fecha: new Date().toISOString(),
    };
    const lista = [...antecedentes, nuevo];
    setGuardando(true);
    const res = await fetch(`/api/casos/${caso.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ antecedentesSIPI: lista }),
    });
    setGuardando(false);
    if (res.ok) { setAntecedentes(lista); setAnt({ ...ant, expediente: "", titular: "" }); }
    else alert("No se pudo guardar el antecedente.");
  }

  async function quitarAntecedente(i: number) {
    const lista = antecedentes.filter((_, idx) => idx !== i);
    const res = await fetch(`/api/casos/${caso.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ antecedentesSIPI: lista }),
    });
    if (res.ok) setAntecedentes(lista);
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
              <thead><tr><th>Marca hallada</th><th>Clase</th><th>Similitud</th><th>Tipo</th><th>Estado</th><th>Titular</th><th>Expediente</th></tr></thead>
              <tbody>
                {a.coincidencias.map((m, i) => (
                  <tr key={i}>
                    <td><b>{m.marca}</b> {m.mismaClase && <span className="badge badge-red">misma clase</span>}</td>
                    <td>{m.clase}</td>
                    <td><b>{m.sim}%</b></td>
                    <td><span className={`badge ${m.tipo === "Idéntica" ? "badge-red" : m.tipo === "Fonética" ? "badge-tram" : "badge-blue"}`}>{m.tipo}</span></td>
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

      <div className="card">
        <div className="flex-between">
          <div>
            <h2>Verificación oficial de marcas (SIPI + OMPI)</h2>
            <div className="card-desc">Busca la marca en las fuentes oficiales y registra los antecedentes hallados. Entran al informe como dato verificado.</div>
          </div>
          <div className="row" style={{ alignItems: "center" }}>
            <a className="btn btn-primary btn-sm" href={`https://branddb.wipo.int/en/similarname?q=${encodeURIComponent(caso.nombre)}`} target="_blank" rel="noopener noreferrer">Buscar en OMPI ↗</a>
            <a className="btn btn-ghost btn-sm" href={PROCESO_INFO.portalOficial} target="_blank" rel="noopener noreferrer">Abrir SIPI ↗</a>
          </div>
        </div>

        <div className="note" style={{ marginTop: 0, marginBottom: 14 }}>
          <b>📋 Instructivo: cómo buscar y qué traer</b>
          <ol style={{ margin: "8px 0 0 18px", padding: 0, fontSize: 13, lineHeight: 1.7 }}>
            <li>Abre <b>OMPI</b> (recomendado: gratis, sin login, incluye Colombia y busca por similitud) o <b>SIPI</b> con los botones de arriba.</li>
            <li>En <b>OMPI</b>: filtra por país <b>Colombia (CO)</b> y busca por el nombre; usa la pestaña de <b>marcas similares</b> para las que se parecen.</li>
            <li>En <b>SIPI</b>: entra a <b>Signos Distintivos → Buscar</b> y revisa marcas iguales y parecidas en tu(s) clase(s).</li>
            <li>De cada marca igual o parecida, anota: <b>nombre, clase, estado</b> (registrada / en trámite / negada), <b>expediente</b> y <b>titular</b>.</li>
            <li>Regístrala abajo con <b>“Agregar antecedente verificado”</b>. Con eso el estudio queda completo y sale en el informe/PDF. ✅</li>
          </ol>
        </div>

        {antecedentes.length > 0 ? (
          <div style={{ overflowX: "auto" }}>
            <table>
              <thead><tr><th>Marca</th><th>Clase</th><th>Estado</th><th>Expediente</th><th>Titular</th><th>Registró</th>{puedeEditar && <th></th>}</tr></thead>
              <tbody>
                {antecedentes.map((x, i) => (
                  <tr key={i}>
                    <td><b>{x.marca}</b></td>
                    <td>{x.clase}</td>
                    <td>{badgeEstado(x.estado)}</td>
                    <td className="muted">{x.expediente || "—"}</td>
                    <td className="muted">{x.titular || "—"}</td>
                    <td className="muted">{x.registradoPor}</td>
                    {puedeEditar && <td><button className="btn btn-danger btn-sm" onClick={() => quitarAntecedente(i)}>✕</button></td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="muted">Aún no hay antecedentes verificados en SIPI para este caso.</p>
        )}

        {puedeEditar && (
          <div style={{ marginTop: 16, borderTop: "1px solid var(--gris-borde)", paddingTop: 16 }}>
            <div className="grid-2">
              <div className="field"><label>Marca hallada en SIPI</label>
                <input value={ant.marca} onChange={(e) => setAnt({ ...ant, marca: e.target.value })} /></div>
              <div className="field"><label>Clase</label>
                <select value={ant.clase} onChange={(e) => setAnt({ ...ant, clase: e.target.value })}>
                  <option value="">Clase…</option>
                  {NICE_CLASSES.map((n) => <option key={n.c} value={n.c}>Clase {n.c} — {n.t.slice(0, 40)}</option>)}
                </select></div>
            </div>
            <div className="grid-2">
              <div className="field"><label>Estado</label>
                <select value={ant.estado} onChange={(e) => setAnt({ ...ant, estado: e.target.value })}>
                  <option>Registrada</option><option>En trámite</option><option>Negada</option><option>Caducada</option>
                </select></div>
              <div className="field"><label>Expediente / radicado</label>
                <input value={ant.expediente} onChange={(e) => setAnt({ ...ant, expediente: e.target.value })} placeholder="Ej: SD2020/0044120" /></div>
            </div>
            <div className="field"><label>Titular</label>
              <input value={ant.titular} onChange={(e) => setAnt({ ...ant, titular: e.target.value })} placeholder="Titular de la marca hallada" /></div>
            <button className="btn btn-primary" onClick={agregarAntecedente} disabled={guardando}>
              {guardando ? "Guardando…" : "＋ Agregar antecedente verificado"}
            </button>
          </div>
        )}
        <div className="note note-warn">
          Ninguna fuente ofrece API automática de marcas. <b>OMPI</b> (gratis, incluye Colombia, búsqueda por similitud) y <b>SIPI</b> (oficial de la SIC) se consultan a mano; el abogado <b>registra aquí</b> lo hallado para dejarlo en el informe con validez.
        </div>
      </div>

      <div className="card">
        <h2>Requerimientos y seguimiento del expediente</h2>
        <div className="card-desc">Registra los requerimientos que la SIC publica en el expediente digital de SIPI (ej. <b>requerimiento de forma</b>) y controla los plazos para responder.</div>

        {requerimientos.length > 0 ? (
          <div style={{ overflowX: "auto" }}>
            <table>
              <thead><tr><th>Tipo</th><th>Expediente</th><th>Notificado</th><th>Fecha límite</th><th>Plazo</th><th>Estado</th>{puedeEditar && <th></th>}</tr></thead>
              <tbody>
                {requerimientos.map((r, i) => {
                  const d = diasRestantes(r.fechaLimite);
                  const resp = r.estado === "Respondido";
                  return (
                    <tr key={i}>
                      <td><b>{r.tipo}</b>{r.descripcion && <><br /><span className="muted">{r.descripcion}</span></>}</td>
                      <td className="muted">{r.expediente || "—"}</td>
                      <td className="muted">{r.fechaNotificacion || "—"}</td>
                      <td className="muted">{r.fechaLimite || "—"}</td>
                      <td>{resp ? <span className="badge badge-reg">—</span> : d === null ? "—" : d < 0 ? <span className="badge badge-red">Vencido</span> : <span className={`badge ${d <= 5 ? "badge-red" : d <= 15 ? "badge-tram" : "badge-blue"}`}>{d} día(s)</span>}</td>
                      <td>{resp ? <span className="badge badge-reg">Respondido</span> : (d !== null && d < 0) ? <span className="badge badge-red">Vencido</span> : <span className="badge badge-tram">Pendiente</span>}</td>
                      {puedeEditar && (
                        <td style={{ whiteSpace: "nowrap" }}>
                          {!resp && <button className="btn btn-outline btn-sm" onClick={() => cambiarEstadoReq(i, "Respondido")}>✓</button>}{" "}
                          <button className="btn btn-danger btn-sm" onClick={() => quitarReq(i)}>✕</button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="muted">Sin requerimientos registrados. Cuando la SIC publique uno en el expediente (SIPI), regístralo aquí para controlar el plazo.</p>
        )}

        {puedeEditar && (
          <div style={{ marginTop: 16, borderTop: "1px solid var(--gris-borde)", paddingTop: 16 }}>
            <div className="grid-2">
              <div className="field"><label>Tipo de requerimiento</label>
                <select value={req.tipo} onChange={(e) => setReq({ ...req, tipo: e.target.value })}>
                  <option>Requerimiento de forma</option><option>Requerimiento de fondo</option><option>Oposición de tercero</option><option>Otro</option>
                </select></div>
              <div className="field"><label>Expediente / radicado</label>
                <input value={req.expediente} onChange={(e) => setReq({ ...req, expediente: e.target.value })} placeholder="Ej: SD2024/0012345" /></div>
            </div>
            <div className="grid-2">
              <div className="field"><label>Fecha de notificación</label>
                <input type="date" value={req.fechaNotificacion} onChange={(e) => setReq({ ...req, fechaNotificacion: e.target.value })} /></div>
              <div className="field"><label>Fecha límite para responder</label>
                <input type="date" value={req.fechaLimite} onChange={(e) => setReq({ ...req, fechaLimite: e.target.value })} /></div>
            </div>
            <div className="field"><label>Descripción / qué solicita la SIC</label>
              <textarea rows={2} value={req.descripcion} onChange={(e) => setReq({ ...req, descripcion: e.target.value })} placeholder="Ej: aclarar la descripción de productos de la clase 25" /></div>
            <button className="btn btn-primary" onClick={agregarReq} disabled={guardandoReq}>{guardandoReq ? "Guardando…" : "＋ Registrar requerimiento"}</button>
          </div>
        )}
        <div className="note note-warn">
          El <b>requerimiento de forma</b> suele dar <b>60 días hábiles</b> para responder; si no se responde, la solicitud se declara abandonada. Confirma siempre la fecha exacta en el expediente de SIPI.
        </div>
      </div>

      <div className="card">
        <h2>Coincidencias en Cámara de Comercio</h2>
        <div className="card-desc">Empresas con razón social igual o parecida (Registro Mercantil).</div>
        {a.empresasRUES && a.empresasRUES.length > 0 ? (
          <div style={{ overflowX: "auto" }}>
            <table>
              <thead><tr><th>Razón social</th><th>NIT</th><th>Ubicación</th><th>Detalle</th><th>Fuente</th></tr></thead>
              <tbody>
                {a.empresasRUES.map((e, i) => (
                  <tr key={i}>
                    <td><b>{e.razon_social}</b></td>
                    <td className="muted">{e.nit}</td>
                    <td className="muted">{e.municipio}</td>
                    <td className="muted">{e.actividad}</td>
                    <td><span className="badge badge-blue">{e.fuente}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="muted">No aparece en los datos abiertos consultados. <b>Esto NO confirma que no exista</b> — la base gratuita es parcial. Verifica en RUES.</p>
        )}
        <div className="note note-warn">
          ⚠ Búsqueda <b>orientativa</b> sobre datos abiertos <b>parciales</b> (no incluyen todas las cámaras/empresas del país). No reemplaza la verificación oficial: confirma siempre en{" "}
          <a href="https://www.rues.org.co" target="_blank" rel="noopener noreferrer">RUES ↗</a> (Registro Único Empresarial y Social).
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
            <div><h2>Inversión para el registro de la marca</h2>
            <div className="card-desc">Incluye el estudio profesional de Versus Legal y la tasa oficial de la SIC ({a.cotizacion.numClases} clase{a.cotizacion.numClases > 1 ? "s" : ""}{a.cotizacion.mipyme ? " · tarifa MiPyme" : ""}).</div></div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: "var(--rojo)" }}>{cop(a.cotizacion.total)}</div>
              <div className="muted">valor total</div>
            </div>
          </div>

          <div className="note" style={{ marginTop: 0, marginBottom: 16 }}>
            <b>El estudio profesional incluye:</b>
            <ul style={{ margin: "6px 0 0 18px", padding: 0 }}>
              <li>Búsqueda y análisis de antecedentes marcarios</li>
              <li>Estudio de similitud fonética, gráfica y conceptual</li>
              <li>Clasificación de productos/servicios (Niza) y estrategia de clases</li>
              <li>Revisión de coincidencias en Cámara de Comercio</li>
              <li>Radicación y acompañamiento del trámite ante la SIC</li>
            </ul>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table>
              <thead><tr><th>Concepto</th><th style={{ textAlign: "right" }}>Valor</th></tr></thead>
              <tbody>
                <tr><td>Estudio, análisis de viabilidad y gestión del registro</td><td style={{ textAlign: "right" }}>{cop(a.cotizacion.honorarios)}</td></tr>
                <tr><td>Tasa oficial SIC — 1ª clase {a.cotizacion.mipyme ? "(MiPyme)" : ""}</td><td style={{ textAlign: "right" }}>{cop(a.cotizacion.tasaPrimera)}</td></tr>
                {a.cotizacion.numClases > 1 && (
                  <tr><td>Clases adicionales: {a.cotizacion.numClases - 1} × {cop(a.cotizacion.tasaAdicional)}</td><td style={{ textAlign: "right" }}>{cop(a.cotizacion.tasaAdicional * (a.cotizacion.numClases - 1))}</td></tr>
                )}
                <tr><td><b>Valor total</b></td><td style={{ textAlign: "right" }}><b>{cop(a.cotizacion.total)}</b></td></tr>
              </tbody>
            </table>
          </div>
          <div className="note">Valores en pesos colombianos (COP). La tasa oficial corresponde a la SIC (una por cada clase). Cotización de orientación, sujeta a confirmación del estudio.</div>
        </div>
      )}
    </>
  );
}
