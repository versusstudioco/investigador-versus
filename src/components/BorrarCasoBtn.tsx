"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BorrarCasoBtn({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function borrar() {
    if (!confirm("¿Eliminar esta búsqueda/caso? Esta acción no se puede deshacer.")) return;
    setBusy(true);
    const res = await fetch(`/api/casos/${id}`, { method: "DELETE" });
    if (res.ok) { router.replace("/casos"); router.refresh(); }
    else { setBusy(false); alert("No se pudo eliminar."); }
  }

  return (
    <button className="btn btn-danger btn-sm" onClick={borrar} disabled={busy}>
      {busy ? "Eliminando…" : "Eliminar caso"}
    </button>
  );
}
