import { scrypt as _scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const scrypt = promisify(_scrypt);
const COOKIE = "vl_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 días

export type Permisos = {
  buscar: boolean;
  revisar: boolean;
  descargar: boolean;
  admin: boolean;
};
export type SessionUser = {
  id: string;
  usuario: string;
  nombre: string;
  rol: string;
  permisos: Permisos;
};

/* ---------- Hash de contraseñas (scrypt) ---------- */
export async function hashPassword(password: string): Promise<{ hash: string; salt: string }> {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  return { hash: derived.toString("hex"), salt };
}
export async function verifyPassword(password: string, hash: string, salt: string): Promise<boolean> {
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  const stored = Buffer.from(hash, "hex");
  if (stored.length !== derived.length) return false;
  return timingSafeEqual(stored, derived);
}

/* ---------- Sesión (JWT en cookie httpOnly) ---------- */
function secret(): Uint8Array {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("Falta AUTH_SECRET en las variables de entorno.");
  return new TextEncoder().encode(s);
}

export async function createSession(user: SessionUser): Promise<void> {
  const token = await new SignJWT({ user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret());
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return (payload as { user: SessionUser }).user ?? null;
  } catch {
    return null;
  }
}

export async function requirePermission(perm: keyof Permisos): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) throw new AuthError("No autenticado", 401);
  if (!user.permisos[perm]) throw new AuthError("Sin permiso", 403);
  return user;
}

export class AuthError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}
