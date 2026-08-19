import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getCaso } from "@/lib/models";
import ResultadoViabilidad from "@/components/ResultadoViabilidad";
import BorrarCasoBtn from "@/components/BorrarCasoBtn";

export const dynamic = "force-dynamic";

export default async function CasoDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const user = (await getCurrentUser())!;
  const { id } = await params;
  const caso = await getCaso(id);
  if (!caso) notFound();

  return (
    <>
      <div className="page-head">
        <div className="flex-between">
          <div>
            <h1>Detalle del caso</h1>
            <p>Estudio de viabilidad de “{caso.nombre}”.</p>
          </div>
          <div className="row" style={{ alignItems: "center" }}>
            <Link className="btn btn-outline btn-sm" href="/casos">← Volver</Link>
            {user.permisos.revisar && <BorrarCasoBtn id={caso.id} />}
          </div>
        </div>
      </div>
      <ResultadoViabilidad caso={caso} puedeDescargar={user.permisos.descargar} puedeEditar={user.permisos.revisar} />
    </>
  );
}
