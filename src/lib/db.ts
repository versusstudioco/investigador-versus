import { createClient, type Client } from "@libsql/client";
import { hashPassword } from "./auth";

/* ============================================================
   Cliente libSQL (Turso).
   - Local:      DATABASE_URL="file:./dev.db"
   - Producción: DATABASE_URL="libsql://...."  + DATABASE_AUTH_TOKEN
   La migración y la siembra del admin se ejecutan una sola vez
   de forma perezosa (idempotente).
   ============================================================ */

let _client: Client | null = null;
let _ready: Promise<void> | null = null;

function rawClient(): Client {
  if (_client) return _client;
  const url = process.env.DATABASE_URL || "file:./dev.db";
  const authToken = process.env.DATABASE_AUTH_TOKEN || undefined;
  _client = createClient({ url, authToken });
  return _client;
}

async function migrateAndSeed(client: Client): Promise<void> {
  await client.batch(
    [
      `CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        usuario TEXT UNIQUE NOT NULL,
        nombre TEXT NOT NULL,
        rol TEXT NOT NULL,
        hash TEXT NOT NULL,
        salt TEXT NOT NULL,
        perm_buscar INTEGER NOT NULL DEFAULT 1,
        perm_revisar INTEGER NOT NULL DEFAULT 1,
        perm_descargar INTEGER NOT NULL DEFAULT 1,
        perm_admin INTEGER NOT NULL DEFAULT 0,
        activo INTEGER NOT NULL DEFAULT 1,
        creado_en TEXT NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS casos (
        id TEXT PRIMARY KEY,
        nombre TEXT NOT NULL,
        tipo TEXT NOT NULL,
        titular TEXT,
        clases TEXT NOT NULL,
        descripcion TEXT,
        score INTEGER NOT NULL,
        nivel TEXT NOT NULL,
        color TEXT NOT NULL,
        analisis TEXT NOT NULL,
        checklist TEXT NOT NULL DEFAULT '{}',
        autor TEXT,
        autor_id TEXT,
        creado_en TEXT NOT NULL
      )`,
    ],
    "write"
  );

  // Sembrar administrador si no hay usuarios
  const count = await client.execute("SELECT COUNT(*) AS n FROM users");
  const n = Number(count.rows[0]?.n ?? 0);
  if (n === 0) {
    const adminUser = process.env.ADMIN_USER || "ADMIN";
    const adminPass = process.env.ADMIN_PASSWORD || "123456";
    const { hash, salt } = await hashPassword(adminPass);
    const now = new Date().toISOString();
    await client.execute({
      sql: `INSERT INTO users
        (id, usuario, nombre, rol, hash, salt, perm_buscar, perm_revisar, perm_descargar, perm_admin, activo, creado_en)
        VALUES (?, ?, ?, ?, ?, ?, 1, 1, 1, 1, 1, ?)`,
      args: [crypto.randomUUID(), adminUser, "Administrador Versus Legal", "Administrador", hash, salt, now],
    });
    // Abogado de ejemplo
    const { hash: h2, salt: s2 } = await hashPassword("abogado1");
    await client.execute({
      sql: `INSERT INTO users
        (id, usuario, nombre, rol, hash, salt, perm_buscar, perm_revisar, perm_descargar, perm_admin, activo, creado_en)
        VALUES (?, ?, ?, ?, ?, ?, 1, 1, 1, 0, 1, ?)`,
      args: [crypto.randomUUID(), "Abogado 1", "Abogado 1", "Abogado", h2, s2, now],
    });
  }
}

export async function getDb(): Promise<Client> {
  const client = rawClient();
  if (!_ready) _ready = migrateAndSeed(client);
  await _ready;
  return client;
}
