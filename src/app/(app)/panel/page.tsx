import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { listCasos } from "@/lib/models";
import { PROCESO_INFO } from "@/lib/nice";

export const dynamic = "force-dynamic";

export default async function PanelPage() {
  const user = (await getCurrentUser())!;
  const casos = await listCasos();
  const total = casos.length;
  const viables = casos.filter((c) => c.analisis.score >= 70).length;
  const riesgo = casos.filter((c) => c.analisis.score < 45).length;

  // Próximos vencimientos (requerimientos pendientes con fecha límite)
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const vencimientos = casos
    .flatMap((c) =>
      (c.requerimientos || [])
        .filter((r) => r.estado !== "Respondido" && r.fechaLimite)
        .map((r) => {
          const dias = Math.round((new Date(r.fechaLimite + "T00:00:00").getTime() - hoy.getTime()) / 86400000);
          return { casoId: c.id, marca: c.nombre, tipo: r.tipo, fechaLimite: r.fechaLimite, dias };
        })
    )
    .sort((a, b) => a.dias - b.dias);

  return (
    <>
      <div className="page-head">
        <h1>Panel de control</h1>
        <p>Hola, {user.nombre}. Resumen de la actividad marcaria del estudio.</p>
      </div>

      <div className="grid-3">
        <div className="kpi"><div className="n">{total}</div><div className="l">Búsquedas realizadas</div></div>
        <div className="kpi"><div className="n" style={{ color: "var(--verde)" }}>{viables}</div><div className="l">Marcas viables (≥70%)</div></div>
        <div className="kpi"><div className="n" style={{ color: "var(--rojo)" }}>{riesgo}</div><div className="l">Alto riesgo (&lt;45%)</div></div>
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <div className="flex-between">
          <div><h2>Acciones rápidas</h2><div className="card-desc">Inicia el flujo de trabajo marcario.</div></div>
          {user.permisos.buscar && <Link className="btn btn-primary" href="/buscar">＋ Nueva búsqueda</Link>}
        </div>
        <div className="chips" style={{ marginTop: 8 }}>
          <span className="chip">Autoridad: <b style={{ color: "var(--rojo)" }}>SIC</b></span>
          <span className="chip">Fundamento: <b style={{ color: "var(--rojo)" }}>Decisión 486 CAN</b></span>
          <span className="chip">Vigencia marca: <b style={{ color: "var(--rojo)" }}>10 años</b></span>
          <span className="chip">Portal oficial: <a href={PROCESO_INFO.portalOficial} target="_blank" rel="noopener noreferrer">SIPI ↗</a></span>
        </div>
      </div>

      {vencimientos.length > 0 && (
        <div className="card">
          <h2>⏰ Próximos vencimientos</h2>
          <div className="card-desc">Requerimientos pendientes con plazo para responder. Ordenados por urgencia.</div>
          <div style={{ overflowX: "auto" }}>
            <table>
              <thead><tr><th>Marca</th><th>Requerimiento</th><th>Fecha límite</th><th>Plazo</th><th></th></tr></thead>
              <tbody>
                {vencimientos.slice(0, 8).map((v, i) => (
                  <tr key={i}>
                    <td><b>{v.marca}</b></td>
                    <td className="muted">{v.tipo}</td>
                    <td className="muted">{v.fechaLimite}</td>
                    <td>{v.dias < 0
                      ? <span className="badge badge-red">Vencido hace {Math.abs(v.dias)} d</span>
                      : <span className={`badge ${v.dias <= 5 ? "badge-red" : v.dias <= 15 ? "badge-tram" : "badge-blue"}`}>{v.dias} día(s)</span>}</td>
                    <td><Link className="btn btn-outline btn-sm" href={`/casos/${v.casoId}`}>Ver</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="card">
        <h2>Últimos casos</h2>
        <div className="card-desc">Historial reciente de estudios de viabilidad.</div>
        {total === 0 ? (
          <p className="muted">Aún no hay búsquedas. Crea la primera desde “Nueva búsqueda”.</p>
        ) : (
          <table>
            <thead><tr><th>Marca</th><th>Clases</th><th>Viabilidad</th><th>Fecha</th><th></th></tr></thead>
            <tbody>
              {casos.slice(0, 6).map((c) => (
                <tr key={c.id}>
                  <td><b>{c.nombre}</b></td>
                  <td>{c.clases.join(", ")}</td>
                  <td><b style={{ color: c.analisis.color }}>{c.analisis.score}%</b></td>
                  <td className="muted">{new Date(c.fecha).toLocaleDateString("es-CO")}</td>
                  <td><Link className="btn btn-outline btn-sm" href={`/casos/${c.id}`}>Ver</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="note note-warn">
        <b>Nota legal:</b> El porcentaje de viabilidad es una herramienta de orientación basada en los datos ingresados y no reemplaza el concepto jurídico ni la verificación oficial en{" "}
        <a href={PROCESO_INFO.portalOficial} target="_blank" rel="noopener noreferrer">SIPI</a>. La decisión de registrabilidad corresponde a la SIC.
      </div>
    </>
  );
}
