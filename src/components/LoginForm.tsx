"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginForm() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, password }),
    });
    setLoading(false);
    if (res.ok) {
      router.replace("/panel");
      router.refresh();
    } else {
      const d = await res.json().catch(() => ({}));
      setError(d.error || "No se pudo iniciar sesión.");
    }
  }

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-brand">
          <Image className="login-logo" src="/versus-negro.png" alt="Versus" width={72} height={72} priority />
          <div className="brand-name-lg">VERSUS LEGAL</div>
        </div>

        <form onSubmit={onSubmit}>
          <div className="field">
            <label>Usuario</label>
            <input value={usuario} onChange={(e) => setUsuario(e.target.value)} placeholder="ADMIN" autoComplete="username" required />
          </div>
          <div className="field">
            <label>Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" autoComplete="current-password" required />
          </div>
          <div className="login-error">{error}</div>
          <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} disabled={loading}>
            {loading ? "Ingresando…" : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
