import { PALABRAS_DEBILES, PRECIOS, KEYWORDS_CLASE, claseTitulo } from "./nice";
import { EXAMPLE_REGISTRY, type RegistroMarca } from "./registry";

export type Coincidencia = RegistroMarca & { sim: number; mismaClase: boolean };
export type Factor = { n: string; v: number };
export type ClaseSugerida = { c: number; titulo: string; motivo: string; yaRegistrada: boolean; seleccionada: boolean };
export type Cotizacion = {
  complejidad: "baja" | "media" | "alta";
  honorarios: number;
  mipyme: boolean;
  numClases: number;
  tasaPrimera: number;
  tasaAdicional: number;
  tasaTotal: number;
  total: number;
};
export type Analisis = {
  score: number;
  nivel: string;
  color: string;
  recomendacion: string;
  factores: Factor[];
  coincidencias: Coincidencia[];
  clasesSugeridas: ClaseSugerida[];
  cotizacion: Cotizacion;
};

/* Sugiere clases de Niza a partir de la descripción de productos/servicios */
export function sugerirClases(descripcion: string, registro: RegistroMarca[], nombre: string, clasesSel: number[]): ClaseSugerida[] {
  const d = norm(descripcion);
  const out: { c: number; hits: string[] }[] = [];
  if (d) {
    for (const { c, kw } of KEYWORDS_CLASE) {
      const hits = kw.filter((k) => d.includes(norm(k)));
      if (hits.length) out.push({ c, hits });
    }
    out.sort((a, b) => b.hits.length - a.hits.length);
  }
  return out.slice(0, 5).map(({ c, hits }) => ({
    c,
    titulo: claseTitulo(c),
    motivo: `Coincide con: ${hits.slice(0, 4).join(", ")}`,
    yaRegistrada: registro.some((r) => Number(r.clase) === c && similitud(nombre, r.marca) >= 0.85),
    seleccionada: clasesSel.includes(c),
  }));
}

export function norm(s = ""): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/* Similitud por distancia de Levenshtein (0..1) */
export function similitud(a: string, b: string): number {
  a = norm(a);
  b = norm(b);
  if (!a || !b) return 0;
  if (a === b) return 1;
  const m = a.length,
    n = b.length;
  const d: number[][] = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
    }
  return 1 - d[m][n] / Math.max(m, n);
}

export function analizarViabilidad(
  nombre: string,
  clases: number[],
  opts: { descripcion?: string; mipyme?: boolean; registroExtra?: RegistroMarca[] } = {}
): Analisis {
  const { descripcion = "", mipyme = false, registroExtra = [] } = opts;
  const registro = [...EXAMPLE_REGISTRY, ...registroExtra];
  const nNombre = norm(nombre);
  const palabras = nNombre.split(" ").filter(Boolean);

  const coincidencias: Coincidencia[] = [];
  let identicaMismaClase = false,
    similarMismaClase = 0,
    identicaOtraClase = false;

  registro.forEach((r) => {
    const sim = similitud(nombre, r.marca);
    const mismaClase = clases.includes(Number(r.clase));
    if (sim >= 0.55) {
      coincidencias.push({ ...r, sim: Math.round(sim * 100), mismaClase });
      if (sim >= 0.92 && mismaClase) identicaMismaClase = true;
      else if (sim >= 0.92) identicaOtraClase = true;
      else if (sim >= 0.7 && mismaClase) similarMismaClase++;
    }
  });
  coincidencias.sort((a, b) => Number(b.mismaClase) - Number(a.mismaClase) || b.sim - a.sim);

  const debiles = palabras.filter((p) => PALABRAS_DEBILES.includes(p)).length;
  const ratioDebil = palabras.length ? debiles / palabras.length : 0;
  const corta = nNombre.replace(/\s/g, "").length <= 3;

  let fDisponibilidad = 100;
  if (identicaMismaClase) fDisponibilidad = 8;
  else if (similarMismaClase >= 2) fDisponibilidad = 30;
  else if (similarMismaClase === 1) fDisponibilidad = 55;
  else if (identicaOtraClase) fDisponibilidad = 78;
  const conflictosCercanos = coincidencias.filter((c) => c.mismaClase && c.sim >= 70).length;
  fDisponibilidad = Math.max(5, fDisponibilidad - conflictosCercanos * 6);

  let fDistintividad = 100 - Math.round(ratioDebil * 70) - (corta ? 20 : 0);
  fDistintividad = Math.max(10, fDistintividad);

  let fRiesgoOposicion = 100 - coincidencias.length * 10 - (identicaMismaClase ? 60 : 0) - similarMismaClase * 15;
  fRiesgoOposicion = Math.max(10, Math.min(100, fRiesgoOposicion));

  const score = Math.round(fDisponibilidad * 0.55 + fDistintividad * 0.25 + fRiesgoOposicion * 0.2);

  let nivel: string, color: string, recomendacion: string;
  if (score >= 70) {
    nivel = "VIABLE — Baja complejidad";
    color = "#12924b";
    recomendacion =
      "El signo presenta buena disponibilidad y distintividad. Se recomienda proceder con la radicación, confirmando previamente los antecedentes en SIPI.";
  } else if (score >= 45) {
    nivel = "VIABILIDAD MEDIA — Complejidad moderada";
    color = "#d98200";
    recomendacion =
      "Existen coincidencias o debilidades que aumentan el riesgo. Se sugiere ajustar el signo (agregar elemento distintivo), acotar la descripción de productos/servicios, o evaluar registro como marca mixta.";
  } else {
    nivel = "ALTO RIESGO — Complejidad alta";
    color = "#F90000";
    recomendacion =
      "Se detectan marcas idénticas o muy similares en la(s) clase(s) solicitada(s). Registrar tal cual implica alto riesgo de negación u oposición. Se recomienda replantear el signo o la estrategia de clases.";
  }

  /* Complejidad → honorarios */
  const complejidad: Cotizacion["complejidad"] = score >= 70 ? "baja" : score >= 45 ? "media" : "alta";
  const honorarios = PRECIOS.honorarios[complejidad];
  const tasa = mipyme ? PRECIOS.tasaMipyme : PRECIOS.tasaNormal;
  const numClases = Math.max(1, clases.length);
  const tasaTotal = tasa.primera + (numClases - 1) * tasa.adicional;
  const cotizacion: Cotizacion = {
    complejidad,
    honorarios,
    mipyme,
    numClases,
    tasaPrimera: tasa.primera,
    tasaAdicional: tasa.adicional,
    tasaTotal,
    total: honorarios + tasaTotal,
  };

  const clasesSugeridas = sugerirClases(descripcion, registro, nombre, clases);

  return {
    score,
    nivel,
    color,
    recomendacion,
    factores: [
      { n: "Disponibilidad (marcas iguales/similares)", v: fDisponibilidad },
      { n: "Distintividad del signo", v: fDistintividad },
      { n: "Bajo riesgo de oposición", v: fRiesgoOposicion },
    ],
    coincidencias,
    clasesSugeridas,
    cotizacion,
  };
}
