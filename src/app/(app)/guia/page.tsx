import { getCurrentUser } from "@/lib/auth";
import { listCasos } from "@/lib/models";
import { PROCESO_INFO } from "@/lib/nice";
import ChecklistClient from "@/components/ChecklistClient";

export const dynamic = "force-dynamic";

export default async function GuiaPage() {
  const user = (await getCurrentUser())!;
  const casos = await listCasos();
  const lite = casos.map((c) => ({ id: c.id, nombre: c.nombre, clases: c.clases, checklist: c.checklist }));
  return (
    <>
      <div className="page-head">
        <h1>Guía de registro de marca en Colombia</h1>
        <p>Checklist paso a paso ante la SIC. {PROCESO_INFO.duracion}</p>
      </div>
      <ChecklistClient casos={lite} puedeEditar={user.permisos.revisar} />
    </>
  );
}
