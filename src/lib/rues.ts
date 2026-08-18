/* ============================================================
   Búsqueda REAL de empresas en Cámara de Comercio
   Fuente: Datos Abiertos Colombia (dataset "Empresas registradas")
   API pública Socrata. Sin credenciales para bajo volumen.
   ============================================================ */

export type EmpresaRUES = {
  razon_social: string;
  nit: string;
  municipio: string;
  actividad: string;
};

const DATASET = "https://www.datos.gov.co/resource/y69t-3r2t.json";

type SocrataRow = { razon_social?: string; nit?: string; muncomercial?: string; ciiu1?: string };

function mapRow(r: SocrataRow): EmpresaRUES {
  return {
    razon_social: r.razon_social ?? "",
    nit: r.nit ?? "",
    municipio: r.muncomercial ?? "",
    actividad: (r.ciiu1 ?? "").replace(/\s*\*\*\s*/g, " · ").trim(),
  };
}

const up = (s: string) => s.toUpperCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

async function query(term: string, limit = 20): Promise<EmpresaRUES[]> {
  const safe = term.replace(/[^A-Za-z0-9ñÑ ]/g, "").trim().toUpperCase();
  if (!safe) return [];
  const where = encodeURIComponent(`upper(razon_social) like '%${safe}%'`);
  const url = `${DATASET}?$where=${where}&$limit=${limit}`;
  try {
    const res = await fetch(url, { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(6500) });
    if (!res.ok) return [];
    const rows = (await res.json()) as SocrataRow[];
    // Filtra a coincidencias por palabra completa (evita "MANOS" dentro de "HERMANOS")
    const re = new RegExp(`(^|[^A-Z0-9])${up(safe).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^A-Z0-9]|$)`);
    return rows.map(mapRow).filter((e) => re.test(up(e.razon_social))).slice(0, 8);
  } catch {
    return [];
  }
}

/** Busca empresas cuya razón social coincida con el nombre de la marca. */
export async function buscarEmpresasRUES(nombre: string): Promise<EmpresaRUES[]> {
  const term = nombre.trim();
  if (!term) return [];
  let out = await query(term);
  // Si no hay resultados con el nombre completo, intenta con la palabra más significativa
  if (out.length === 0) {
    const palabras = term.split(/\s+/).filter((w) => w.length >= 4).sort((a, b) => b.length - a.length);
    if (palabras[0]) out = await query(palabras[0]);
  }
  // Deduplicar por NIT
  const seen = new Set<string>();
  return out.filter((e) => {
    const k = e.nit || e.razon_social;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}
