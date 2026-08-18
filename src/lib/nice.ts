/* Clasificación de Niza, checklist de registro e info del proceso */

export type NiceClass = { c: number; tipo: "Producto" | "Servicio"; t: string };

export const NICE_CLASSES: NiceClass[] = [
  { c: 1, tipo: "Producto", t: "Productos químicos para industria, ciencia, agricultura" },
  { c: 2, tipo: "Producto", t: "Pinturas, barnices, lacas, colorantes, tintas" },
  { c: 3, tipo: "Producto", t: "Cosméticos, perfumería, productos de limpieza no medicinales" },
  { c: 4, tipo: "Producto", t: "Aceites y grasas industriales, combustibles, velas" },
  { c: 5, tipo: "Producto", t: "Productos farmacéuticos, veterinarios e higiénicos" },
  { c: 6, tipo: "Producto", t: "Metales comunes y sus aleaciones, ferretería metálica" },
  { c: 7, tipo: "Producto", t: "Máquinas, máquinas herramienta, motores (no vehículos)" },
  { c: 8, tipo: "Producto", t: "Herramientas e instrumentos de mano accionados manualmente" },
  { c: 9, tipo: "Producto", t: "Software, aparatos electrónicos, científicos y tecnológicos" },
  { c: 10, tipo: "Producto", t: "Aparatos e instrumentos médicos, quirúrgicos y dentales" },
  { c: 11, tipo: "Producto", t: "Aparatos de alumbrado, calefacción, refrigeración, sanitarios" },
  { c: 12, tipo: "Producto", t: "Vehículos, aparatos de locomoción terrestre, aérea o acuática" },
  { c: 13, tipo: "Producto", t: "Armas de fuego, municiones, explosivos, fuegos artificiales" },
  { c: 14, tipo: "Producto", t: "Metales preciosos, joyería, bisutería, relojería" },
  { c: 15, tipo: "Producto", t: "Instrumentos musicales" },
  { c: 16, tipo: "Producto", t: "Papel, cartón, productos de imprenta, papelería, material educativo" },
  { c: 17, tipo: "Producto", t: "Caucho, plásticos semielaborados, materiales de aislamiento" },
  { c: 18, tipo: "Producto", t: "Cuero y marroquinería, bolsos, paraguas, artículos de viaje" },
  { c: 19, tipo: "Producto", t: "Materiales de construcción no metálicos" },
  { c: 20, tipo: "Producto", t: "Muebles, espejos, marcos, artículos de madera/plástico" },
  { c: 21, tipo: "Producto", t: "Utensilios y recipientes para el hogar y la cocina, cristalería" },
  { c: 22, tipo: "Producto", t: "Cuerdas, redes, toldos, sacos, materiales de acolchado" },
  { c: 23, tipo: "Producto", t: "Hilos para uso textil" },
  { c: 24, tipo: "Producto", t: "Tejidos, ropa de casa, textiles" },
  { c: 25, tipo: "Producto", t: "Prendas de vestir, calzado, artículos de sombrerería" },
  { c: 26, tipo: "Producto", t: "Encajes, cintas, botones, adornos para el cabello" },
  { c: 27, tipo: "Producto", t: "Alfombras, tapices, esteras, revestimientos de suelos" },
  { c: 28, tipo: "Producto", t: "Juegos, juguetes, artículos de gimnasia y deporte" },
  { c: 29, tipo: "Producto", t: "Carne, pescado, lácteos, aceites comestibles, conservas" },
  { c: 30, tipo: "Producto", t: "Café, té, harinas, pan, pastelería, salsas, especias" },
  { c: 31, tipo: "Producto", t: "Productos agrícolas frescos, plantas, animales vivos" },
  { c: 32, tipo: "Producto", t: "Cervezas, aguas, refrescos, jugos y bebidas sin alcohol" },
  { c: 33, tipo: "Producto", t: "Bebidas alcohólicas (excepto cervezas)" },
  { c: 34, tipo: "Producto", t: "Tabaco, artículos para fumadores, cigarrillos electrónicos" },
  { c: 35, tipo: "Servicio", t: "Publicidad, gestión y administración de negocios, comercio/retail" },
  { c: 36, tipo: "Servicio", t: "Servicios financieros, seguros, inmobiliarios, monetarios" },
  { c: 37, tipo: "Servicio", t: "Construcción, reparación, servicios de instalación" },
  { c: 38, tipo: "Servicio", t: "Telecomunicaciones" },
  { c: 39, tipo: "Servicio", t: "Transporte, embalaje, almacenamiento, viajes" },
  { c: 40, tipo: "Servicio", t: "Tratamiento y transformación de materiales, producción" },
  { c: 41, tipo: "Servicio", t: "Educación, formación, entretenimiento, actividades deportivas y culturales" },
  { c: 42, tipo: "Servicio", t: "Servicios científicos y tecnológicos, diseño y desarrollo de software" },
  { c: 43, tipo: "Servicio", t: "Restauración (alimentación), hospedaje temporal" },
  { c: 44, tipo: "Servicio", t: "Servicios médicos, veterinarios, de belleza, agricultura" },
  { c: 45, tipo: "Servicio", t: "Servicios jurídicos, de seguridad, personales y sociales" },
];

export function claseTitulo(c: number): string {
  return NICE_CLASSES.find((n) => n.c === Number(c))?.t ?? "";
}

export type CheckPhase = { fase: string; items: { id: string; t: string }[] };

export const CHECKLIST: CheckPhase[] = [
  {
    fase: "1. Estudio previo (antecedentes)",
    items: [
      { id: "p1", t: "Definir el signo a proteger (nominativa, figurativa, mixta, tridimensional, sonora)" },
      { id: "p2", t: "Determinar la(s) clase(s) de Niza según productos/servicios" },
      { id: "p3", t: "Realizar búsqueda de antecedentes marcarios en SIPI (sipi.sic.gov.co)" },
      { id: "p4", t: "Analizar viabilidad: identidad, similitud fonética/gráfica/conceptual, descriptividad" },
      { id: "p5", t: "Entregar concepto de viabilidad al cliente (informe PDF)" },
    ],
  },
  {
    fase: "2. Documentos del solicitante",
    items: [
      { id: "d1", t: "Persona natural: cédula del titular · Persona jurídica: NIT" },
      { id: "d2", t: "Certificado de existencia y representación legal (Cámara de Comercio) si es empresa" },
      { id: "d3", t: "Poder debidamente otorgado si actúa apoderado (abogado)" },
      { id: "d4", t: "Representación gráfica de la marca en JPG (si es figurativa o mixta)" },
      { id: "d5", t: "Descripción detallada de productos/servicios por clase" },
      { id: "d6", t: "Datos de contacto y notificación del solicitante" },
    ],
  },
  {
    fase: "3. Tasas y radicación",
    items: [
      { id: "t1", t: "Verificar tasa oficial vigente de la SIC por cada clase solicitada" },
      { id: "t2", t: "Realizar el pago de la tasa (una tasa por cada clase de Niza)" },
      { id: "t3", t: "Radicar la solicitud en línea a través del portal SIPI" },
      { id: "t4", t: "Guardar radicado / número de expediente asignado" },
    ],
  },
  {
    fase: "4. Trámite ante la SIC",
    items: [
      { id: "s1", t: "Examen de forma por la SIC (revisión de requisitos formales)" },
      { id: "s2", t: "Atender requerimientos de la SIC si los hay (plazo para subsanar)" },
      { id: "s3", t: "Publicación en la Gaceta de la Propiedad Industrial" },
      { id: "s4", t: "Periodo de oposiciones de terceros (30 días hábiles)" },
      { id: "s5", t: "Contestar oposiciones si se presentan" },
      { id: "s6", t: "Examen de fondo (registrabilidad / distintividad) por la SIC" },
    ],
  },
  {
    fase: "5. Resolución y post-registro",
    items: [
      { id: "r1", t: "Recepción de la resolución (concede o niega)" },
      { id: "r2", t: "Interponer recursos si se niega (reposición y/o apelación)" },
      { id: "r3", t: "Obtener el certificado de registro (vigencia 10 años)" },
      { id: "r4", t: "Agendar renovación (dentro de los 6 meses previos al vencimiento)" },
      { id: "r5", t: "Entregar al cliente certificado y recomendaciones de uso de la marca" },
    ],
  },
];

export const PROCESO_INFO = {
  duracion: "6 a 8 meses aprox. (si no hay oposiciones ni requerimientos).",
  vigencia: "10 años, renovables indefinidamente por periodos iguales.",
  fundamento: "Decisión 486 de 2000 de la CAN y Código de Comercio · Autoridad: Superintendencia de Industria y Comercio (SIC).",
  portalOficial: "https://sipi.sic.gov.co",
};

/* ------------------------------------------------------------
   PRECIOS / COTIZACIÓN (COP)
   Honorarios varían por complejidad (editables por el estudio).
   Tasa oficial de la SIC por clase (normal vs. MiPyme).
------------------------------------------------------------ */
export const PRECIOS = {
  honorarios: { baja: 1_300_000, media: 1_900_000, alta: 2_600_000 },
  tasaNormal: { primera: 1_347_000, adicional: 673_000 },
  tasaMipyme: { primera: 970_000, adicional: 485_000 },
};

/* ------------------------------------------------------------
   Diccionario de palabras clave → clase de Niza
   (para sugerir clases a partir de la descripción)
------------------------------------------------------------ */
export const KEYWORDS_CLASE: { c: number; kw: string[] }[] = [
  { c: 3, kw: ["cosmetico", "cosmeticos", "perfume", "perfumeria", "maquillaje", "crema", "cremas", "jabon", "shampoo", "belleza", "labial", "loción", "locion", "desodorante"] },
  { c: 5, kw: ["farmaceutico", "medicamento", "medicamentos", "vitamina", "suplemento", "higienico", "medicinal", "droga", "salud"] },
  { c: 9, kw: ["software", "app", "aplicacion", "aplicaciones", "plataforma", "sistema", "programa", "electronico", "electronica", "celular", "computador", "hardware", "videojuego", "descargable"] },
  { c: 14, kw: ["joya", "joyeria", "joyas", "reloj", "relojes", "oro", "plata", "bisuteria", "anillo", "collar", "arete"] },
  { c: 16, kw: ["papel", "papeleria", "imprenta", "revista", "libro", "libros", "cuaderno", "impreso", "material educativo"] },
  { c: 18, kw: ["cuero", "bolso", "bolsos", "marroquineria", "maleta", "maletas", "cartera", "morral", "correa", "paraguas"] },
  { c: 20, kw: ["mueble", "muebles", "silla", "mesa", "cama", "colchon", "espejo", "madera"] },
  { c: 21, kw: ["utensilio", "cocina", "vajilla", "cristaleria", "recipiente", "termo", "vaso"] },
  { c: 24, kw: ["textil", "textiles", "tejido", "sabana", "sabanas", "toalla", "cortina", "ropa de cama"] },
  { c: 25, kw: ["ropa", "vestir", "vestido", "camisa", "camiseta", "pantalon", "calzado", "zapato", "zapatos", "tenis", "moda", "prenda", "prendas", "chaqueta", "sombreria", "gorra", "medias", "ropa interior", "confeccion", "confecciones"] },
  { c: 28, kw: ["juguete", "juguetes", "juego", "deporte", "deportivo", "gimnasia", "balon"] },
  { c: 29, kw: ["carne", "pescado", "lacteo", "lacteos", "queso", "leche", "aceite comestible", "conserva", "embutido", "huevo"] },
  { c: 30, kw: ["cafe", "harina", "pan", "panaderia", "pasteleria", "postre", "chocolate", "salsa", "especia", "arroz", "galleta", "dulce", "te aromatico", "infusion"] },
  { c: 31, kw: ["agricola", "planta", "plantas", "semilla", "fruta", "verdura", "animal vivo", "mascota", "alimento para animales", "flores"] },
  { c: 32, kw: ["cerveza", "agua", "jugo", "refresco", "gaseosa", "bebida sin alcohol", "energizante"] },
  { c: 33, kw: ["licor", "aguardiente", "ron", "vino", "whisky", "vodka", "bebida alcoholica", "tequila", "cerveza artesanal"] },
  { c: 34, kw: ["tabaco", "cigarrillo", "cigarro", "vapeador", "vaporizador", "fumar"] },
  { c: 35, kw: ["publicidad", "marketing", "mercadeo", "tienda", "comercio", "venta", "retail", "ecommerce", "comercializacion", "administracion de negocios", "gestion empresarial"] },
  { c: 36, kw: ["financiero", "finanzas", "seguro", "seguros", "inmobiliaria", "banco", "credito", "inversion"] },
  { c: 37, kw: ["construccion", "reparacion", "instalacion", "obra", "remodelacion", "mantenimiento"] },
  { c: 38, kw: ["telecomunicaciones", "internet", "telefonia", "comunicaciones", "señal"] },
  { c: 39, kw: ["transporte", "logistica", "envio", "domicilio", "mensajeria", "almacenamiento", "viaje", "turismo"] },
  { c: 40, kw: ["manufactura", "produccion", "fabricacion", "impresion", "maquila", "tratamiento de materiales"] },
  { c: 41, kw: ["educacion", "formacion", "capacitacion", "curso", "cursos", "entretenimiento", "academia", "colegio", "escuela", "deportiva", "cultural", "evento", "eventos"] },
  { c: 42, kw: ["desarrollo de software", "diseño de software", "tecnologia", "programacion", "ingenieria", "cientifico", "diseño web", "saas", "hosting", "ciberseguridad"] },
  { c: 43, kw: ["restaurante", "restaurantes", "comida", "alimentacion", "bar", "cafeteria", "cafe servicio", "hotel", "hospedaje", "hosteleria", "catering", "gastronomia", "cocina servicio"] },
  { c: 44, kw: ["medico", "clinica", "salud servicio", "veterinario", "veterinaria", "estetica", "spa", "peluqueria", "barberia", "odontologia", "belleza servicio", "agricultura servicio"] },
  { c: 45, kw: ["juridico", "juridicos", "abogado", "legal", "seguridad", "vigilancia", "notaria", "servicios personales"] },
];

/* Sugerencia de clases a partir de la descripción (uso en cliente y servidor) */
/* Coincidencia por palabra/frase completa (evita falsos positivos como "te" dentro de "tenemos") */
export function matchKeyword(textoNorm: string, keyword: string): boolean {
  const k = keyword.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^a-z0-9])${k}([^a-z0-9]|$)`).test(textoNorm);
}

export function sugerirClasesDesc(descripcion: string): { c: number; titulo: string; motivo: string }[] {
  const d = descripcion.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  if (!d.trim()) return [];
  const out: { c: number; titulo: string; motivo: string; hits: number }[] = [];
  for (const { c, kw } of KEYWORDS_CLASE) {
    const matched = kw.filter((k) => matchKeyword(d, k));
    if (matched.length) out.push({ c, titulo: claseTitulo(c), motivo: matched.slice(0, 4).join(", "), hits: matched.length });
  }
  out.sort((a, b) => b.hits - a.hits);
  return out.slice(0, 8).map(({ c, titulo, motivo }) => ({ c, titulo, motivo }));
}

/* Filtro por producto/servicio específico → clase (sub-clases).
   Busca en el diccionario de términos y en los títulos de las clases. */
export function buscarClasesPorTermino(q: string): { c: number; titulo: string; termino: string }[] {
  const nq = q.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
  if (nq.length < 2) return [];
  const res: { c: number; titulo: string; termino: string }[] = [];
  const seen = new Set<number>();
  // 1) términos específicos del diccionario
  for (const { c, kw } of KEYWORDS_CLASE) {
    const hit = kw.find((k) => k.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").includes(nq));
    if (hit && !seen.has(c)) { res.push({ c, titulo: claseTitulo(c), termino: hit }); seen.add(c); }
  }
  // 2) coincidencia en el título de la clase
  for (const n of NICE_CLASSES) {
    const t = n.t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    if (t.includes(nq) && !seen.has(n.c)) { res.push({ c: n.c, titulo: n.t, termino: n.t }); seen.add(n.c); }
  }
  return res.slice(0, 10);
}

export const PALABRAS_DEBILES = [
  "premium", "original", "natural", "express", "digital", "global", "colombia", "nacional",
  "super", "mega", "pro", "plus", "gold", "oro", "el", "la", "los", "las", "de", "del", "y",
  "tienda", "empresa", "servicios", "soluciones", "grupo", "compania",
];
