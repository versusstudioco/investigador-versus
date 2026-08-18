"use client";

import { useMemo, useState } from "react";
import { CHECKLIST, PROCESO_INFO } from "@/lib/nice";
import type { CasoRow } from "@/lib/models";

type CasoLite = { id: string; nombre: string; clases: number[]; checklist: Record<string, boolean> };

export default function ChecklistClient({ casos, puedeEditar }: { casos: CasoLite[]; puedeEditar: boolean }) {
  const [casoId, setCasoId] = useState<string>(casos[0]?.id || "");
  const [estados, setEstados] = useState<Record<string, Record<string, boolean>>>(
    Object.fromEntries(casos.map((c) => [c.id, c.checklist || {}]))
  );
  const [general, setGeneral] = useState<Record<string, boolean>>({});

  const estado = casoId ? estados[casoId] || {} : general;
  const totalItems = useMemo(() => CHECKLIST.reduce((s, f) => s + f.items.length, 0), []);
  const hechos = Object.values(estado).filter(Boolean).length;
  const pct = Math.round((hechos / totalItems) * 100);

  async function toggle(itemId: string, checked: boolean) {
    if (casoId) {
      const nuevo = { ...(estados[casoId] || {}), [itemId]: checked };
      setEstados((s) => ({ ...s, [casoId]: nuevo }));
      if (puedeEditar) {
        await fetch(`/api/casos/${casoId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ checklist: nuevo }),
        }).catch(() => {});
      }
    } else {
      setGeneral((g) => ({ ...g, [itemId]: checked }));
    }
  }

  return (
    <div className="card">
      <div className="row" style={{ alignItems: "center", justifyContent: "space-between" }}>
        <div className="field" style={{ margin: 0, minWidth: 280 }}>
          <label>Aplicar checklist a un caso</label>
          <select value={casoId} onChange={(e) => setCasoId(e.target.value)}>
            <option value="">— Checklist general (sin caso) —</option>
            {casos.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre} (clases {c.clases.join(", ")})</option>
            ))}
          </select>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 26, fontWeight: 800, color: "var(--verde)" }}>{pct}%</div>
          <div className="muted">completado</div>
        </div>
      </div>
      <div className="progress-line"><i style={{ width: `${pct}%` }} /></div>

      {CHECKLIST.map((f) => (
        <div className="check-phase" key={f.fase}>
          <h3>{f.fase}</h3>
          {f.items.map((it) => (
            <div className={`check-item ${estado[it.id] ? "done" : ""}`} key={it.id}>
              <input type="checkbox" checked={!!estado[it.id]} onChange={(e) => toggle(it.id, e.target.checked)} />
              <label>{it.t}</label>
            </div>
          ))}
        </div>
      ))}

      <div className="note">
        <b>Vigencia:</b> {PROCESO_INFO.vigencia}
        <br />
        <b>Marco:</b> {PROCESO_INFO.fundamento}
      </div>
    </div>
  );
}

export type { CasoRow };
