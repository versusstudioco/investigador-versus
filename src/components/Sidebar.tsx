"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import type { SessionUser } from "@/lib/auth";

const NAV = [
  { href: "/panel", ico: "▦", label: "Panel", perm: null },
  { href: "/buscar", ico: "🔎", label: "Nueva búsqueda", perm: "buscar" as const },
  { href: "/casos", ico: "🗂", label: "Casos e informes", perm: null },
  { href: "/guia", ico: "✓", label: "Guía de registro", perm: null },
  { href: "/usuarios", ico: "👥", label: "Usuarios y permisos", perm: "admin" as const },
];

export default function Sidebar({ user }: { user: SessionUser }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <aside className="sidebar">
      <div className="brand">
        <Image className="brand-logo" src="/versus-blanco.png" alt="Versus" width={44} height={44} />
        <div>
          <div className="brand-name">Versus Legal</div>
          <div className="brand-sub">Marcas · SIC</div>
        </div>
      </div>
      <nav className="nav">
        {NAV.filter((n) => !n.perm || user.permisos[n.perm]).map((n) => (
          <Link key={n.href} href={n.href} className={pathname === n.href ? "active" : ""}>
            <span className="ico">{n.ico}</span> {n.label}
          </Link>
        ))}
      </nav>
      <div className="side-user">
        <div className="u-name">{user.nombre}</div>
        <div className="u-rol">{user.rol}</div>
        <button className="btn btn-outline btn-sm" style={{ width: "100%", justifyContent: "center" }} onClick={logout}>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
