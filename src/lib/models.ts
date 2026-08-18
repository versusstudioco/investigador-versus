import { getDb } from "./db";
import { hashPassword } from "./auth";
import type { Analisis } from "./viability";

/* ============================ USUARIOS ============================ */
export type UsuarioRow = {
  id: string;
  usuario: string;
  nombre: string;
  rol: string;
  permisos: { buscar: boolean; revisar: boolean; descargar: boolean; admin: boolean };
  activo: boolean;
  creado_en: string;
};

function mapUser(r: Record<string, unknown>): UsuarioRow {
  return {
    id: String(r.id),
    usuario: String(r.usuario),
    nombre: String(r.nombre),
    rol: String(r.rol),
    permisos: {
      buscar: !!Number(r.perm_buscar),
      revisar: !!Number(r.perm_revisar),
      descargar: !!Number(r.perm_descargar),
      admin: !!Number(r.perm_admin),
    },
    activo: !!Number(r.activo),
    creado_en: String(r.creado_en),
  };
}

export async function listUsuarios(): Promise<UsuarioRow[]> {
  const db = await getDb();
  const res = await db.execute("SELECT * FROM users ORDER BY creado_en ASC");
  return res.rows.map((r) => mapUser(r as Record<string, unknown>));
}

export async function getUsuarioByLogin(usuario: string) {
  const db = await getDb();
  const res = await db.execute({
    sql: "SELECT * FROM users WHERE lower(usuario) = lower(?) LIMIT 1",
    args: [usuario.trim()],
  });
  return res.rows[0] as Record<string, unknown> | undefined;
}

export type UsuarioInput = {
  usuario: string;
  nombre: string;
  rol: string;
  password?: string;
  permisos: { buscar: boolean; revisar: boolean; descargar: boolean; admin: boolean };
  activo: boolean;
};

export async function createUsuario(u: UsuarioInput): Promise<void> {
  const db = await getDb();
  if (!u.password) throw new Error("La contraseña es obligatoria.");
  const { hash, salt } = await hashPassword(u.password);
  await db.execute({
    sql: `INSERT INTO users
      (id, usuario, nombre, rol, hash, salt, perm_buscar, perm_revisar, perm_descargar, perm_admin, activo, creado_en)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      crypto.randomUUID(), u.usuario.trim(), u.nombre.trim(), u.rol, hash, salt,
      u.permisos.buscar ? 1 : 0, u.permisos.revisar ? 1 : 0, u.permisos.descargar ? 1 : 0,
      u.permisos.admin ? 1 : 0, u.activo ? 1 : 0, new Date().toISOString(),
    ],
  });
}

export async function updateUsuario(id: string, u: UsuarioInput): Promise<void> {
  const db = await getDb();
  await db.execute({
    sql: `UPDATE users SET usuario=?, nombre=?, rol=?, perm_buscar=?, perm_revisar=?, perm_descargar=?, perm_admin=?, activo=? WHERE id=?`,
    args: [
      u.usuario.trim(), u.nombre.trim(), u.rol,
      u.permisos.buscar ? 1 : 0, u.permisos.revisar ? 1 : 0, u.permisos.descargar ? 1 : 0,
      u.permisos.admin ? 1 : 0, u.activo ? 1 : 0, id,
    ],
  });
  if (u.password) {
    const { hash, salt } = await hashPassword(u.password);
    await db.execute({ sql: "UPDATE users SET hash=?, salt=? WHERE id=?", args: [hash, salt, id] });
  }
}

export async function deleteUsuario(id: string): Promise<void> {
  const db = await getDb();
  await db.execute({ sql: "DELETE FROM users WHERE id=? AND usuario <> 'ADMIN'", args: [id] });
}

export async function existsOtherWithLogin(usuario: string, exceptId: string): Promise<boolean> {
  const db = await getDb();
  const res = await db.execute({
    sql: "SELECT id FROM users WHERE lower(usuario)=lower(?) AND id <> ? LIMIT 1",
    args: [usuario.trim(), exceptId],
  });
  return res.rows.length > 0;
}

/* ============================ CASOS ============================ */
export type CasoRow = {
  id: string;
  nombre: string;
  tipo: string;
  titular: string;
  clases: number[];
  descripcion: string;
  analisis: Analisis;
  checklist: Record<string, boolean>;
  autor: string;
  autorId: string;
  fecha: string;
};

function mapCaso(r: Record<string, unknown>): CasoRow {
  return {
    id: String(r.id),
    nombre: String(r.nombre),
    tipo: String(r.tipo),
    titular: String(r.titular ?? ""),
    clases: JSON.parse(String(r.clases || "[]")),
    descripcion: String(r.descripcion ?? ""),
    analisis: JSON.parse(String(r.analisis)),
    checklist: JSON.parse(String(r.checklist || "{}")),
    autor: String(r.autor ?? ""),
    autorId: String(r.autor_id ?? ""),
    fecha: String(r.creado_en),
  };
}

export async function listCasos(): Promise<CasoRow[]> {
  const db = await getDb();
  const res = await db.execute("SELECT * FROM casos ORDER BY creado_en DESC");
  return res.rows.map((r) => mapCaso(r as Record<string, unknown>));
}

export async function getCaso(id: string): Promise<CasoRow | null> {
  const db = await getDb();
  const res = await db.execute({ sql: "SELECT * FROM casos WHERE id=? LIMIT 1", args: [id] });
  const row = res.rows[0] as Record<string, unknown> | undefined;
  return row ? mapCaso(row) : null;
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
  const now = new Date().toISOString();
  await db.execute({
    sql: `INSERT INTO casos
      (id, nombre, tipo, titular, clases, descripcion, score, nivel, color, analisis, checklist, autor, autor_id, creado_en)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '{}', ?, ?, ?)`,
    args: [
      id, c.nombre, c.tipo, c.titular, JSON.stringify(c.clases), c.descripcion,
      c.analisis.score, c.analisis.nivel, c.analisis.color, JSON.stringify(c.analisis),
      c.autor, c.autorId, now,
    ],
  });
  return (await getCaso(id))!;
}

export async function updateChecklist(id: string, checklist: Record<string, boolean>): Promise<void> {
  const db = await getDb();
  await db.execute({ sql: "UPDATE casos SET checklist=? WHERE id=?", args: [JSON.stringify(checklist), id] });
}

export async function deleteCaso(id: string): Promise<void> {
  const db = await getDb();
  await db.execute({ sql: "DELETE FROM casos WHERE id=?", args: [id] });
}
