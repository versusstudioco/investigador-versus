import { getDb } from "./db";
import { hashPassword } from "./auth";
import type { Analisis } from "./viability";
import type { Permisos } from "./auth";

/* ============================ USUARIOS ============================ */
export type UsuarioRow = {
  id: string;
  usuario: string;
  nombre: string;
  rol: string;
  permisos: Permisos;
  activo: boolean;
  creado_en: string;
};

/* Shape que necesita el login (incluye hash/salt) */
export type UsuarioAuth = UsuarioRow & { hash: string; salt: string };

type UserDoc = {
  usuario: string;
  usuario_lower: string;
  nombre: string;
  rol: string;
  hash: string;
  salt: string;
  permisos: Permisos;
  activo: boolean;
  creado_en: string;
};

function toPermisos(p: Partial<Permisos> | undefined): Permisos {
  return {
    buscar: !!p?.buscar,
    revisar: !!p?.revisar,
    descargar: !!p?.descargar,
    admin: !!p?.admin,
  };
}

export async function listUsuarios(): Promise<UsuarioRow[]> {
  const db = await getDb();
  const snap = await db.collection("users").orderBy("creado_en", "asc").get();
  return snap.docs.map((d) => {
    const u = d.data() as UserDoc;
    return { id: d.id, usuario: u.usuario, nombre: u.nombre, rol: u.rol, permisos: toPermisos(u.permisos), activo: !!u.activo, creado_en: u.creado_en };
  });
}

export async function getUsuarioByLogin(usuario: string): Promise<UsuarioAuth | null> {
  const db = await getDb();
  const snap = await db.collection("users").where("usuario_lower", "==", usuario.trim().toLowerCase()).limit(1).get();
  if (snap.empty) return null;
  const d = snap.docs[0];
  const u = d.data() as UserDoc;
  return { id: d.id, usuario: u.usuario, nombre: u.nombre, rol: u.rol, permisos: toPermisos(u.permisos), activo: !!u.activo, creado_en: u.creado_en, hash: u.hash, salt: u.salt };
}

export type UsuarioInput = {
  usuario: string;
  nombre: string;
  rol: string;
  password?: string;
  permisos: Permisos;
  activo: boolean;
};

export async function existsOtherWithLogin(usuario: string, exceptId: string): Promise<boolean> {
  const db = await getDb();
  const snap = await db.collection("users").where("usuario_lower", "==", usuario.trim().toLowerCase()).get();
  return snap.docs.some((d) => d.id !== exceptId);
}

export async function createUsuario(u: UsuarioInput): Promise<void> {
  const db = await getDb();
  if (!u.password) throw new Error("La contraseña es obligatoria.");
  const { hash, salt } = await hashPassword(u.password);
  await db.collection("users").doc(crypto.randomUUID()).set({
    usuario: u.usuario.trim(),
    usuario_lower: u.usuario.trim().toLowerCase(),
    nombre: u.nombre.trim(),
    rol: u.rol,
    hash,
    salt,
    permisos: toPermisos(u.permisos),
    activo: u.activo,
    creado_en: new Date().toISOString(),
  });
}

export async function updateUsuario(id: string, u: UsuarioInput): Promise<void> {
  const db = await getDb();
  const patch: Record<string, unknown> = {
    usuario: u.usuario.trim(),
    usuario_lower: u.usuario.trim().toLowerCase(),
    nombre: u.nombre.trim(),
    rol: u.rol,
    permisos: toPermisos(u.permisos),
    activo: u.activo,
  };
  if (u.password) {
    const { hash, salt } = await hashPassword(u.password);
    patch.hash = hash;
    patch.salt = salt;
  }
  await db.collection("users").doc(id).update(patch);
}

export async function deleteUsuario(id: string): Promise<void> {
  const db = await getDb();
  const ref = db.collection("users").doc(id);
  const doc = await ref.get();
  if (doc.exists && (doc.data() as UserDoc).usuario === "ADMIN") return; // protege al admin principal
  await ref.delete();
}

/* ============================ CASOS ============================ */
export type AntecedenteSIPI = {
  marca: string;
  clase: number;
  estado: string;
  expediente: string;
  titular: string;
  registradoPor: string;
  fecha: string;
};

export type Requerimiento = {
  tipo: string;            // Requerimiento de forma / de fondo / Oposición / Otro
  expediente: string;      // radicado del expediente
  fechaNotificacion: string;
  fechaLimite: string;     // fecha límite para responder
  descripcion: string;
  estado: string;          // Pendiente / Respondido / Vencido
  registradoPor: string;
};

export type CasoRow = {
  id: string;
  nombre: string;
  tipo: string;
  titular: string;
  clases: number[];
  descripcion: string;
  analisis: Analisis;
  checklist: Record<string, boolean>;
  antecedentesSIPI: AntecedenteSIPI[];
  requerimientos: Requerimiento[];
  estado: string;
  autor: string;
  autorId: string;
  fecha: string;
};

type CasoDoc = {
  nombre: string;
  tipo: string;
  titular: string;
  clases: number[];
  descripcion: string;
  analisis: Analisis;
  checklist: Record<string, boolean>;
  antecedentes_sipi?: AntecedenteSIPI[];
  requerimientos?: Requerimiento[];
  estado?: string;
  autor: string;
  autor_id: string;
  creado_en: string;
};

function mapCaso(id: string, c: CasoDoc): CasoRow {
  return {
    id,
    nombre: c.nombre,
    tipo: c.tipo,
    titular: c.titular ?? "",
    clases: c.clases ?? [],
    descripcion: c.descripcion ?? "",
    analisis: c.analisis,
    checklist: c.checklist ?? {},
    antecedentesSIPI: c.antecedentes_sipi ?? [],
    requerimientos: c.requerimientos ?? [],
    estado: c.estado ?? "Estudio",
    autor: c.autor ?? "",
    autorId: c.autor_id ?? "",
    fecha: c.creado_en,
  };
}

export async function listCasos(): Promise<CasoRow[]> {
  const db = await getDb();
  const snap = await db.collection("casos").orderBy("creado_en", "desc").get();
  return snap.docs.map((d) => mapCaso(d.id, d.data() as CasoDoc));
}

export async function getCaso(id: string): Promise<CasoRow | null> {
  const db = await getDb();
  const doc = await db.collection("casos").doc(id).get();
  return doc.exists ? mapCaso(doc.id, doc.data() as CasoDoc) : null;
}

export type CasoInput = {
  nombre: string;
  tipo: string;
  titular: string;
  clases: number[];
  descripcion: string;
  analisis: Analisis;
  autor: string;
  autorId: string;
};

export async function createCaso(c: CasoInput): Promise<CasoRow> {
  const db = await getDb();
  const id = crypto.randomUUID();
  const doc: CasoDoc = {
    nombre: c.nombre,
    tipo: c.tipo,
    titular: c.titular,
    clases: c.clases,
    descripcion: c.descripcion,
    analisis: c.analisis,
    checklist: {},
    antecedentes_sipi: [],
    requerimientos: [],
    estado: "Estudio",
    autor: c.autor,
    autor_id: c.autorId,
    creado_en: new Date().toISOString(),
  };
  await db.collection("casos").doc(id).set(doc);
  return mapCaso(id, doc);
}

export async function updateChecklist(id: string, checklist: Record<string, boolean>): Promise<void> {
  const db = await getDb();
  await db.collection("casos").doc(id).update({ checklist });
}

export async function updateAntecedentesSIPI(id: string, antecedentes: AntecedenteSIPI[]): Promise<void> {
  const db = await getDb();
  await db.collection("casos").doc(id).update({ antecedentes_sipi: antecedentes });
}

export async function updateRequerimientos(id: string, requerimientos: Requerimiento[]): Promise<void> {
  const db = await getDb();
  await db.collection("casos").doc(id).update({ requerimientos });
}

export async function updateEstado(id: string, estado: string): Promise<void> {
  const db = await getDb();
  await db.collection("casos").doc(id).update({ estado });
}

export async function deleteCaso(id: string): Promise<void> {
  const db = await getDb();
  await db.collection("casos").doc(id).delete();
}
