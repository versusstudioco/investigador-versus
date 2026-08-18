/* ============================================================
   Búsqueda REAL de empresas en Cámara de Comercio (multi-fuente)
   Fuentes: Datos Abiertos Colombia (API pública Socrata).
   - c82u-588k : RUES sincronizado (varias cámaras, actualización mensual)
   - wf53-j577 : C.C. de Bucaramanga (Santander)
   - y69t-3r2t : C.C. de Sincelejo (Sucre)
   No hay UNA API nacional única; se combinan varias para ampliar cobertura.
   ============================================================ */

export type EmpresaRUES = {
  razon_social: string;
  nit: string;
  municipio: string;
  actividad: string;
  fuente: string;
};

type Row = Record<string, string | undefined>;
type Fuente = { id: string; nombre: string; map: (r: Row) => EmpresaRUES };

const FUENTES: Fuente[] = [
  {
    id: "c82u-588k",
    nombre: "RUES",
    map: (r) => ({
      razon_social: r.razon_social ?? "",
      nit: r.numero_identificacion ?? "",
      municipio: r.camara_comercio ?? "",
      actividad: r.estado_matricula ? `Matrícula: ${r.estado_matricula}` : "",
      fuente: "RUES",
    }),
  },
  {
    id: "wf53-j577",
    nombre: "C.C. Bucaramanga",
    map: (r) => ({
      razon_social: r.razon_social ?? "",
      nit: r.nit ?? "",
      municipio: [r.ciudad, r.departamento].filter(Boolean).join(", "),
      actividad: r.desc_ciiu1 ?? r.estado ?? "",
      fuente: "C.C. Bucaramanga",
    }),
  },
  {
    id: "y69t-3r2t",
    nombre: "C.C. Sincelejo",
    map: (r) => ({
      razon_social: r.razon_social ?? "",
      nit: r.nit ?? "",
      municipio: r.muncomercial ?? "",
      actividad: (r.ciiu1 ?? "").replace(/\s*\*\*\s*/g, " · ").trim(),
      fuente: "C.C. Sincelejo",
    }),
  },
];

const up = (s: string) => s.toUpperCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

async function queryFuente(f: Fuente, term: string): Promise<EmpresaRUES[]> {
  const safe = term.replace(/[^A-Za-z0-9ñÑ ]/g, "").trim().toUpperCase();
  if (!safe) return [];
  const where = encodeURIComponent(`upper(razon_social) like '%${safe}%'`);
  const url = `https://www.datos.gov.co/resource/${f.id}.json?$where=${where}&$limit=15`;
  try {
    const res = await fetch(url, { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(6500) });
    if (!res.ok) return [];
    const rows = (await res.json()) as Row[];
    const re = new RegExp(`(^|[^A-Z0-9])${up(safe).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^A-Z0-9]|$)`);
    return rows.map(f.map).filter((e) => e.razon_social && re.test(up(e.razon_social)));
  } catch {
    return [];
  }
}

async function buscarTodas(term: string): Promise<EmpresaRUES[]> {
  const results = await Promise.allSettled(FUENTES.map((f) => queryFuente(f, term)));
  const all: EmpresaRUES[] = [];
  for (const r of results) if (r.status === "fulfilled") all.push(...r.value);
  return all;
}

/** Busca empresas cuya razón social coincida con el nombre de la marca (varias cámaras). */
export async function buscarEmpresasRUES(nombre: string): Promise<EmpresaRUES[]> {
  const term = nombre.trim();
  if (!term) return [];
  let all = await buscarTodas(term);
  if (all.length === 0) {
    const palabra = term.split(/\s+/).filter((w) => w.length >= 4).sort((a, b) => b.length - a.length)[0];
    if (palabra) all = await buscarTodas(palabra);
  }
  // Deduplicar por NIT o razón social
  const seen = new Set<string>();
  const out: EmpresaRUES[] = [];
  for (const e of all) {
    const k = (e.nit || e.razon_social).replace(/\s|-/g, "");
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(e);
  }
  return out.slice(0, 12);
}
