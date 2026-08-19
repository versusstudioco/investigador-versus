import { getCurrentUser } from "@/lib/auth";
import { listCasos } from "@/lib/models";
import CasosList from "@/components/CasosList";

export const dynamic = "force-dynamic";

export default async function CasosPage() {
  const user = (await getCurrentUser())!;
  const casos = await listCasos();
  return (
    <>
      <div className="page-head">
        <h1>Casos e informes</h1>
        <p>Historial de estudios de viabilidad del estudio.</p>
      </div>
      <div className="card">
        <CasosList casosIniciales={casos} puedeDescargar={user.permisos.descargar} puedeEliminar={user.permisos.admin} puedeEditar={user.permisos.revisar} />
      </div>
    </>
  );
}
