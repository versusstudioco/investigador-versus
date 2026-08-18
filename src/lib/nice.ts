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

export const PALABRAS_DEBILES = [
  "premium", "original", "natural", "express", "digital", "global", "colombia", "nacional",
  "super", "mega", "pro", "plus", "gold", "oro", "el", "la", "los", "las", "de", "del", "y",
  "tienda", "empresa", "servicios", "soluciones", "grupo", "compania",
];
