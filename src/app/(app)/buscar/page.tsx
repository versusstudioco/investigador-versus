import { getCurrentUser } from "@/lib/auth";
import { PROCESO_INFO } from "@/lib/nice";
import BuscarClient from "@/components/BuscarClient";

export const dynamic = "force-dynamic";

export default async function BuscarPage() {
  const user = (await getCurrentUser())!;
  if (!user.permisos.buscar) {
    return (
      <>
        <div className="page-head"><h1>Acceso restringido</h1></div>
        <div className="card"><p className="muted">Tu usuario no tiene permiso para hacer búsquedas. Contacta al administrador.</p></div>
      </>
    );
  }
  return (
    <>
      <div className="page-head">
        <h1>Nueva búsqueda de marca</h1>
        <p>
          Estudio de viabilidad y antecedentes. Confirma siempre en{" "}
          <a href={PROCESO_INFO.portalOficial} target="_blank" rel="noopener noreferrer">SIPI (SIC) ↗</a>.
        </p>
      </div>
      <BuscarClient puedeDescargar={user.permisos.descargar} />
    </>
  );
}
