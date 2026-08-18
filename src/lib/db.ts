import { initializeApp, getApps, cert, applicationDefault } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { hashPassword } from "./auth";

/* ============================================================
   Firebase Firestore (Admin SDK).
   Credenciales por variables de entorno (en Vercel):
     - FIREBASE_PROJECT_ID
     - FIREBASE_CLIENT_EMAIL
     - FIREBASE_PRIVATE_KEY   (con saltos de línea escapados \n)
   En local puede usarse el emulador: FIRESTORE_EMULATOR_HOST=localhost:8080
   La siembra del admin se ejecuta una sola vez (idempotente).
   ============================================================ */

let _db: Firestore | null = null;
let _ready: Promise<void> | null = null;

function initDb(): Firestore {
  if (_db) return _db;
  if (!getApps().length) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

    if (projectId && clientEmail && privateKey) {
      initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
    } else if (process.env.FIRESTORE_EMULATOR_HOST) {
      initializeApp({ projectId: projectId || "demo-versus-legal" });
    } else {
      // Último recurso: credenciales por defecto (GOOGLE_APPLICATION_CREDENTIALS)
      initializeApp({ credential: applicationDefault(), projectId });
    }
  }
  _db = getFirestore();
  return _db;
}

async function ensureSeed(db: Firestore): Promise<void> {
  const snap = await db.collection("users").limit(1).get();
  if (!snap.empty) return;

  const now = new Date().toISOString();
  const adminUser = process.env.ADMIN_USER || "ADMIN";
  const adminPass = process.env.ADMIN_PASSWORD || "123456";

  const a = await hashPassword(adminPass);
  await db.collection("users").doc(crypto.randomUUID()).set({
    usuario: adminUser,
    usuario_lower: adminUser.toLowerCase(),
    nombre: "Administrador Versus Legal",
    rol: "Administrador",
    hash: a.hash,
    salt: a.salt,
    permisos: { buscar: true, revisar: true, descargar: true, admin: true },
    activo: true,
    creado_en: now,
  });

  const b = await hashPassword("abogado1");
  await db.collection("users").doc(crypto.randomUUID()).set({
    usuario: "Abogado 1",
    usuario_lower: "abogado 1",
    nombre: "Abogado 1",
    rol: "Abogado",
    hash: b.hash,
    salt: b.salt,
    permisos: { buscar: true, revisar: true, descargar: true, admin: false },
    activo: true,
    creado_en: now,
  });
}

export async function getDb(): Promise<Firestore> {
  const db = initDb();
  if (!_ready) _ready = ensureSeed(db);
  await _ready;
  return db;
}
