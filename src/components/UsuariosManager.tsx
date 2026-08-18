"use client";

import { useState } from "react";
import type { UsuarioRow } from "@/lib/models";

type Draft = {
  id: string | null;
  usuario: string;
  nombre: string;
  rol: string;
  password: string;
  permisos: { buscar: boolean; revisar: boolean; descargar: boolean; admin: boolean };
  activo: boolean;
};

const PERMS: [keyof Draft["permisos"], string][] = [
  ["buscar", "Hacer búsquedas"],
  ["revisar", "Revisar resultados"],
  ["descargar", "Descargar PDF"],
  ["admin", "Administrar usuarios"],
];

function chips(p: UsuarioRow["permisos"]) {
  const labels: [keyof typeof p, string][] = [["buscar", "Buscar"], ["revisar", "Revisar"], ["descargar", "Descargar"], ["admin", "Admin"]];
  const active = labels.filter(([k]) => p[k]);
  return (
    <div className="chips">
      {active.length ? active.map(([, l]) => <span className="chip" key={l}>{l}</span>) : <span className="muted">—</span>}
    </div>
  );
}

export default function UsuariosManager({ usuariosIniciales }: { usuariosIniciales: UsuarioRow[] }) {
  const [usuarios, setUsuarios] = useState(usuariosIniciales);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function nuevo() {
    setError("");
    setDraft({ id: null, usuario: "", nombre: "", rol: "Abogado", password: "", permisos: { buscar: true, revisar: true, descargar: true, admin: false }, activo: true });
  }
  function editar(u: UsuarioRow) {
    setError("");
    setDraft({ id: u.id, usuario: u.usuario, nombre: u.nombre, rol: u.rol, password: "", permisos: { ...u.permisos }, activo: u.activo });
  }

  async function refrescar() {
    const res = await fetch("/api/usuarios");
    if (res.ok) setUsuarios((await res.json()).usuarios);
  }

  async function guardar() {
    if (!draft) return;
    setError("");
    if (!draft.usuario.trim() || !draft.nombre.trim()) { setError("Usuario y nombre son obligatorios."); return; }
    if (!draft.id && !draft.password) { setError("La contraseña es obligatoria para un usuario nuevo."); return; }
    setSaving(true);
    const url = draft.id ? `/api/usuarios/${draft.id}` : "/api/usuarios";
    const res = await fetch(url, {
      method: draft.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    setSaving(false);
    if (res.ok) { setDraft(null); await refrescar(); }
    else { const d = await res.json().catch(() => ({})); setError(d.error || "No se pudo guardar."); }
  }

  async function eliminar(u: UsuarioRow) {
    if (u.usuario === "ADMIN") { alert("No se puede eliminar el administrador principal."); return; }
    if (!confirm("¿Eliminar este usuario?")) return;
    const res = await fetch(`/api/usuarios/${u.id}`, { method: "DELETE" });
    if (res.ok) await refrescar();
    else alert("No se pudo eliminar.");
  }

  return (
    <div className="card">
      <div className="flex-between">
        <div><h2>Equipo del estudio</h2><div className="card-desc">{usuarios.length} usuario(s) registrado(s).</div></div>
        <button className="btn btn-primary" onClick={nuevo}>＋ Crear usuario</button>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table>
          <thead><tr><th>Usuario</th><th>Nombre</th><th>Rol</th><th>Permisos</th><th>Estado</th><th></th></tr></thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td><b>{u.usuario}</b></td>
                <td>{u.nombre}</td>
                <td><span className="badge badge-blue">{u.rol}</span></td>
                <td>{chips(u.permisos)}</td>
                <td>{u.activo ? <span className="badge badge-reg">Activo</span> : <span className="badge badge-red">Inactivo</span>}</td>
                <td style={{ whiteSpace: "nowrap" }}>
                  <button className="btn btn-outline btn-sm" onClick={() => editar(u)}>Editar</button>{" "}
                  {u.usuario !== "ADMIN" && <button className="btn btn-danger btn-sm" onClick={() => eliminar(u)}>✕</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="note">La contraseña se almacena cifrada (hash scrypt). Nunca se guarda en texto plano ni se envía al navegador.</div>

      {draft && (
        <div className="modal-bg" onClick={(e) => { if (e.target === e.currentTarget) setDraft(null); }}>
          <div className="modal">
            <h2>{draft.id ? "Editar usuario" : "Crear usuario"}</h2>
            <div className="field"><label>Usuario (para ingreso)</label>
              <input value={draft.usuario} readOnly={draft.usuario === "ADMIN"} onChange={(e) => setDraft({ ...draft, usuario: e.target.value })} />
            </div>
            <div className="field"><label>Nombre completo</label>
              <input value={draft.nombre} onChange={(e) => setDraft({ ...draft, nombre: e.target.value })} />
            </div>
            <div className="field"><label>Rol</label>
              <select value={draft.rol} onChange={(e) => setDraft({ ...draft, rol: e.target.value })}>
                <option>Abogado</option><option>Administrador</option><option>Asistente</option>
              </select>
            </div>
            <div className="field"><label>{draft.id ? "Nueva contraseña (vacío = no cambiar)" : "Contraseña"}</label>
              <input type="text" value={draft.password} placeholder={draft.id ? "••••••" : "contraseña"} onChange={(e) => setDraft({ ...draft, password: e.target.value })} />
            </div>
            <div className="field"><label>Permisos</label>
              <div className="chips" style={{ gap: 14 }}>
                {PERMS.map(([k, l]) => (
                  <label key={k} style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 13, fontWeight: 600 }}>
                    <input type="checkbox" checked={draft.permisos[k]} style={{ width: 16, height: 16, accentColor: "var(--rojo)" }}
                      onChange={(e) => setDraft({ ...draft, permisos: { ...draft.permisos, [k]: e.target.checked } })} /> {l}
                  </label>
                ))}
              </div>
            </div>
            <div className="field">
              <label style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 13, fontWeight: 600 }}>
                <input type="checkbox" checked={draft.activo} style={{ width: 16, height: 16, accentColor: "var(--rojo)" }}
                  onChange={(e) => setDraft({ ...draft, activo: e.target.checked })} /> Usuario activo
              </label>
            </div>
            {error && <div className="login-error">{error}</div>}
            <div className="row" style={{ justifyContent: "flex-end", marginTop: 8 }}>
              <button className="btn btn-outline" onClick={() => setDraft(null)}>Cancelar</button>
              <button className="btn btn-primary" onClick={guardar} disabled={saving}>{saving ? "Guardando…" : "Guardar"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
