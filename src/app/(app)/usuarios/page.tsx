import { getCurrentUser } from "@/lib/auth";
import { listUsuarios } from "@/lib/models";
import UsuariosManager from "@/components/UsuariosManager";

export const dynamic = "force-dynamic";

export default async function UsuariosPage() {
  const user = (await getCurrentUser())!;
  if (!user.permisos.admin) {
    return (
      <>
        <div className="page-head"><h1>Acceso restringido</h1></div>
        <div className="card"><p className="muted">Solo el administrador puede gestionar usuarios.</p></div>
      </>
    );
  }
  const usuarios = await listUsuarios();
  return (
    <>
      <div className="page-head">
        <h1>Usuarios y permisos</h1>
        <p>Crea empleados (abogados) y define qué puede hacer cada uno.</p>
      </div>
      <UsuariosManager usuariosIniciales={usuarios} />
    </>
  );
}
