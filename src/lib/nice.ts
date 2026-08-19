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

/* Estados del expediente (pipeline del caso) */
export const ESTADOS_CASO = [
  "Estudio",
  "Radicado",
  "Publicado en Gaceta",
  "En oposición",
  "Examen de fondo",
  "Concedido",
  "Negado",
  "Renovación",
  "Archivado",
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
  { c: 1, kw: ["quimico", "quimicos", "fertilizante", "abono", "resina", "adhesivo industrial", "reactivo", "aditivo quimico"] },
  { c: 2, kw: ["pintura", "pinturas", "barniz", "laca", "esmalte", "tinta de impresion", "colorante", "pigmento", "anticorrosivo"] },
  { c: 3, kw: ["cosmetico", "cosmeticos", "perfume", "perfumeria", "fragancia", "maquillaje", "crema", "cremas", "jabon", "shampoo", "champu", "acondicionador", "belleza", "labial", "locion", "desodorante", "esmalte de uñas", "protector solar", "exfoliante", "mascarilla", "gel", "aceite esencial", "detergente"] },
  { c: 4, kw: ["aceite industrial", "grasa", "lubricante", "combustible", "gasolina", "vela", "velas", "cera"] },
  { c: 5, kw: ["farmaceutico", "medicamento", "medicamentos", "vitamina", "suplemento", "higienico", "medicinal", "droga", "pañal", "gel antibacterial", "desinfectante", "veterinario medicinal", "dietetico", "vendaje"] },
  { c: 6, kw: ["metal", "acero", "hierro", "aluminio", "ferreteria metalica", "cerradura", "tornillo", "clavo", "tuberia metalica", "candado"] },
  { c: 7, kw: ["maquina", "maquinaria", "motor industrial", "bomba", "herramienta electrica", "generador", "compresor", "maquina herramienta"] },
  { c: 8, kw: ["herramienta manual", "cuchilla", "tijera", "navaja", "cubierto", "afeitadora", "llave", "destornillador"] },
  { c: 9, kw: ["software", "app", "aplicacion", "aplicaciones", "plataforma digital", "sistema informatico", "programa", "electronico", "electronica", "celular", "computador", "hardware", "videojuego", "descargable", "audifonos", "bateria", "cargador", "camara", "sensor", "gafas", "lentes", "casco", "chaleco antibalas"] },
  { c: 10, kw: ["medico aparato", "quirurgico", "dental", "protesis", "ortopedico", "instrumento medico", "mascarilla medica", "guantes medicos"] },
  { c: 11, kw: ["alumbrado", "lampara", "bombillo", "calefaccion", "refrigeracion", "nevera", "aire acondicionado", "sanitario", "grifo", "ducha", "estufa", "horno"] },
  { c: 12, kw: ["vehiculo", "carro", "automovil", "moto", "motocicleta", "bicicleta", "llanta", "neumatico", "repuesto vehiculo", "camion", "barco"] },
  { c: 13, kw: ["arma", "municion", "explosivo", "polvora", "fuego artificial", "pistola"] },
  { c: 14, kw: ["joya", "joyeria", "joyas", "reloj", "relojes", "oro", "plata", "bisuteria", "anillo", "collar", "arete", "pulsera", "dije", "cadena", "piedra preciosa"] },
  { c: 15, kw: ["instrumento musical", "guitarra", "piano", "bateria musical", "violin", "cuerda musical"] },
  { c: 16, kw: ["papel", "papeleria", "imprenta", "revista", "libro", "libros", "cuaderno", "impreso", "material educativo", "afiche", "tarjeta", "sticker", "empaque de papel", "boligrafo", "lapiz", "agenda", "calendario"] },
  { c: 17, kw: ["caucho", "plastico semielaborado", "aislante", "manguera", "empaque de caucho", "espuma"] },
  { c: 18, kw: ["cuero", "bolso", "bolsos", "marroquineria", "maleta", "maletas", "cartera", "morral", "correa", "paraguas", "billetera", "mochila", "riñonera", "articulos de viaje"] },
  { c: 19, kw: ["material de construccion", "cemento", "ladrillo", "concreto", "baldosa", "ceramica construccion", "madera construccion", "vidrio construccion", "asfalto"] },
  { c: 20, kw: ["mueble", "muebles", "silla", "mesa", "cama", "colchon", "espejo", "madera", "escritorio", "estante", "sofa", "marco", "cojin"] },
  { c: 21, kw: ["utensilio", "cocina utensilio", "vajilla", "cristaleria", "recipiente", "termo", "vaso", "olla", "sarten", "plato", "taza", "cepillo", "botella"] },
  { c: 22, kw: ["cuerda", "red", "toldo", "carpa", "saco", "lona", "hilo grueso"] },
  { c: 23, kw: ["hilo textil", "hilos", "lana hilo", "hilo de coser"] },
  { c: 24, kw: ["textil", "textiles", "tejido", "sabana", "sabanas", "toalla", "cortina", "ropa de cama", "cobija", "manta", "mantel", "tela"] },
  { c: 25, kw: ["ropa", "vestir", "vestido", "camisa", "camiseta", "pantalon", "jean", "calzado", "zapato", "zapatos", "tenis", "sandalia", "bota", "moda", "prenda", "prendas", "chaqueta", "abrigo", "sombreria", "sombrero", "gorra", "medias", "ropa interior", "vestido de baño", "pijama", "confeccion", "confecciones", "buzo", "sudadera", "falda", "blusa"] },
  { c: 26, kw: ["encaje", "cinta", "boton", "cierre", "cremallera", "adorno cabello", "moño", "hebilla", "pasador"] },
  { c: 27, kw: ["alfombra", "tapete", "tapiz", "estera", "revestimiento de suelo", "cesped artificial"] },
  { c: 28, kw: ["juguete", "juguetes", "juego", "juego de mesa", "deporte", "deportivo", "gimnasia", "balon", "pelota", "muñeco", "peluche", "patineta", "raqueta", "articulo deportivo"] },
  { c: 29, kw: ["carne", "pollo", "pescado", "lacteo", "lacteos", "queso", "leche", "yogurt", "mantequilla", "aceite comestible", "conserva", "embutido", "huevo", "enlatado", "snack de fruta", "frutos secos"] },
  { c: 30, kw: ["cafe", "harina", "pan", "panaderia", "pasteleria", "postre", "chocolate", "salsa", "especia", "arroz", "pasta", "galleta", "dulce", "confiteria", "helado", "cereal", "azucar", "miel", "te aromatico", "infusion", "condimento"] },
  { c: 31, kw: ["agricola", "planta", "plantas", "semilla", "fruta fresca", "verdura", "hortaliza", "animal vivo", "mascota", "alimento para animales", "concentrado animal", "flores", "cesped natural", "grano"] },
  { c: 32, kw: ["cerveza", "agua", "agua embotellada", "jugo", "zumo", "refresco", "gaseosa", "soda", "bebida sin alcohol", "energizante", "bebida hidratante", "malta"] },
  { c: 33, kw: ["licor", "aguardiente", "ron", "vino", "whisky", "vodka", "ginebra", "bebida alcoholica", "tequila", "cerveza artesanal", "coctel", "champaña"] },
  { c: 34, kw: ["tabaco", "cigarrillo", "cigarro", "vapeador", "vaporizador", "vape", "encendedor", "pipa", "fumar"] },
  { c: 35, kw: ["publicidad", "marketing", "mercadeo", "agencia de marketing", "tienda", "comercio", "venta", "retail", "ecommerce", "comercializacion", "distribucion comercial", "importacion", "exportacion", "administracion de negocios", "gestion empresarial", "recursos humanos", "contabilidad servicio", "franquicia"] },
  { c: 36, kw: ["financiero", "finanzas", "seguro", "seguros", "inmobiliaria", "finca raiz", "banco", "credito", "prestamo", "inversion", "cambio de divisas", "cripto", "cobranza", "avaluo"] },
  { c: 37, kw: ["construccion", "constructora", "reparacion", "instalacion", "obra civil", "remodelacion", "mantenimiento", "plomeria", "electricidad servicio", "pintura servicio", "aseo servicio"] },
  { c: 38, kw: ["telecomunicaciones", "internet proveedor", "telefonia", "comunicaciones", "señal", "transmision", "streaming servicio", "operador movil"] },
  { c: 39, kw: ["transporte", "logistica", "envio", "domicilio", "mensajeria", "paqueteria", "almacenamiento", "bodegaje", "viaje", "turismo", "agencia de viajes", "distribucion", "flete", "taxi"] },
  { c: 40, kw: ["manufactura", "produccion", "fabricacion", "impresion", "maquila", "tratamiento de materiales", "reciclaje", "sublimacion", "bordado servicio", "confeccion a terceros", "purificacion"] },
  { c: 41, kw: ["educacion", "formacion", "capacitacion", "curso", "cursos", "taller", "entretenimiento", "academia", "colegio", "escuela", "universidad", "deportiva", "gimnasio servicio", "cultural", "evento", "eventos", "produccion audiovisual", "musica servicio", "editorial"] },
  { c: 42, kw: ["desarrollo de software", "diseño de software", "tecnologia", "programacion", "ingenieria", "cientifico", "diseño web", "diseño grafico", "saas", "hosting", "ciberseguridad", "arquitectura", "consultoria tecnologica", "inteligencia artificial", "app desarrollo"] },
  { c: 43, kw: ["restaurante", "restaurantes", "comida", "comida rapida", "hamburguesa", "pizza", "perro caliente", "arepa", "empanada", "sushi", "tacos", "asados", "parrilla", "alimentacion", "bar", "cafeteria", "cafe servicio", "hotel", "hospedaje", "hosteleria", "catering", "gastronomia", "cocina servicio", "heladeria", "food truck", "panaderia servicio"] },
  { c: 44, kw: ["medico servicio", "clinica", "consultorio", "salud servicio", "veterinario", "veterinaria", "estetica", "spa", "peluqueria", "barberia", "odontologia", "psicologia", "nutricion", "belleza servicio", "manicure", "tatuaje", "agricultura servicio", "jardineria"] },
  { c: 45, kw: ["juridico", "juridicos", "abogado", "legal", "asesoria legal", "seguridad", "vigilancia", "notaria", "servicios personales", "funeraria", "agencia matrimonial", "investigacion privada"] },
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

/* Normaliza y similitud (Levenshtein) locales para el filtro con cobertura total */
function _norm(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
}
function _sim(a: string, b: string): number {
  if (!a || !b) return 0;
  if (a === b) return 1;
  const m = a.length, n = b.length;
  const d: number[][] = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++) {
      const c = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + c);
    }
  return 1 - d[m][n] / Math.max(m, n);
}

/* Filtro por producto/servicio específico → clase (sub-clases).
   SIEMPRE devuelve resultados: coincidencia exacta o, si no hay, las clases MÁS PARECIDAS. */
export function buscarClasesPorTermino(q: string): { c: number; titulo: string; termino: string; parecido?: boolean }[] {
  const nq = _norm(q);
  if (nq.length < 2) return [];
  type Row = { c: number; titulo: string; termino: string; score: number; exacta: boolean };
  const rows: Row[] = [];

  for (const n of NICE_CLASSES) {
    const terminos = [n.t, ...(KEYWORDS_CLASE.find((k) => k.c === n.c)?.kw ?? [])];
    let best = 0, bestTerm = n.t, exacta = false;
    for (const t of terminos) {
      const nt = _norm(t);
      let s: number;
      if (nt.includes(nq) || nq.includes(nt)) { s = 0.97; }
      else {
        s = _sim(nq, nt);
        for (const w of nt.split(/\s+/)) {
          const sw = w.includes(nq) || nq.includes(w) ? 0.92 : _sim(nq, w);
          if (sw > s) s = sw;
        }
      }
      if (s > best) { best = s; bestTerm = t; exacta = s >= 0.92; }
    }
    rows.push({ c: n.c, titulo: n.t, termino: bestTerm, score: best, exacta });
  }

  rows.sort((a, b) => b.score - a.score);
  const exactas = rows.filter((r) => r.exacta);
  const base = exactas.length ? exactas : rows.filter((r) => r.score >= 0.45);
  const lista = (base.length ? base : rows).slice(0, 8);
  return lista.map((r) => ({ c: r.c, titulo: r.titulo, termino: r.termino, parecido: !r.exacta }));
}

export const PALABRAS_DEBILES = [
  "premium", "original", "natural", "express", "digital", "global", "colombia", "nacional",
  "super", "mega", "pro", "plus", "gold", "oro", "el", "la", "los", "las", "de", "del", "y",
  "tienda", "empresa", "servicios", "soluciones", "grupo", "compania",
];
