# Versus Legal — Rastreador de Marcas (Colombia)

Aplicación web para el estudio jurídico **Versus Legal**: consulta de antecedentes,
análisis de **viabilidad en %** de una marca ante la **SIC**, guía/checklist del proceso
de registro y generación de **informe PDF** para el cliente. Con **login seguro del lado
servidor**, **roles y permisos**, y **datos compartidos** entre todo el equipo.

Stack: **Next.js 15 + React 19 + TypeScript** · Base de datos **libSQL/Turso** · Deploy en **Vercel**.

---

## 1. Ejecutar en local (desarrollo)

```bash
npm install
cp .env.example .env.local     # ya viene uno listo con BD de archivo
npm run dev
```

Abre **http://localhost:3000** · Acceso inicial: usuario **ADMIN** / contraseña **123456**.

En local, la base de datos es un archivo `dev.db` (se crea sola en el primer arranque,
junto con el usuario ADMIN y un “Abogado 1”).

---

## 2. Roles y permisos

| Usuario     | Contraseña | Rol           | Permisos                                  |
|-------------|------------|---------------|-------------------------------------------|
| `ADMIN`     | `123456`   | Administrador | Todo + crear usuarios y asignar permisos  |
| `Abogado 1` | `abogado1` | Abogado       | Buscar, revisar y descargar               |

Permisos configurables por usuario: **Buscar**, **Revisar**, **Descargar**, **Administrar usuarios**.
Se validan **en el servidor** en cada petición (no solo en pantalla). Las contraseñas se
guardan con **hash scrypt** (nunca en texto plano ni se envían al navegador).

> Cambia la contraseña de ADMIN después del primer ingreso (edítalo desde *Usuarios y permisos*).

---

## 3. Desplegar en GitHub + Vercel

### Paso 1 — Subir a GitHub
Ya está inicializado el repositorio git. Crea un repo vacío en GitHub y:

```bash
git remote add origin https://github.com/TU_USUARIO/versus-legal-marcas.git
git branch -M main
git push -u origin main
```

> El `.gitignore` ya excluye `.env*.local`, `node_modules`, `dev.db` y `/legacy-static`.
> **Nunca subas secretos a GitHub.**

### Paso 2 — Crear la base de datos (Turso, gratis)
1. Entra a **https://turso.tech** y crea una cuenta.
2. Crea una base de datos → copia su **URL** (`libsql://....turso.io`) y genera un **token**.
   (Con el CLI: `turso db create versus-legal` y `turso db tokens create versus-legal`.)

### Paso 3 — Importar el proyecto en Vercel
1. Entra a **https://vercel.com** → *Add New… → Project* → importa tu repo de GitHub.
2. En **Environment Variables** agrega:

   | Variable                | Valor                                             |
   |-------------------------|---------------------------------------------------|
   | `DATABASE_URL`          | `libsql://....turso.io` (tu URL de Turso)         |
   | `DATABASE_AUTH_TOKEN`   | (el token de Turso)                               |
   | `AUTH_SECRET`           | una cadena larga aleatoria (`openssl rand -base64 32`) |
   | `ADMIN_USER`            | `ADMIN`                                            |
   | `ADMIN_PASSWORD`        | la contraseña inicial del admin                   |

3. **Deploy**. En el primer acceso se crean las tablas y el usuario ADMIN automáticamente.

Cada vez que hagas `git push`, Vercel vuelve a desplegar solo.

---

## 4. Qué hace cada sección

- **Panel:** KPIs de búsquedas, marcas viables y de alto riesgo.
- **Nueva búsqueda:** marca, tipo de signo, titular y clase(s) de Niza → **viabilidad %** + coincidencias. Enlace directo a SIPI.
- **Casos e informes:** historial compartido; descarga de **PDF** por caso.
- **Guía de registro:** checklist paso a paso ante la SIC, con avance guardado por caso.
- **Usuarios y permisos:** gestión del equipo (solo Admin).

### Cómo se calcula la viabilidad
Puntaje ponderado: **Disponibilidad 55%** (marcas iguales/similares en la misma clase),
**Distintividad 25%** (penaliza palabras genéricas y signos muy cortos),
**Bajo riesgo de oposición 20%**. Semáforo: ≥70% viable · 45–69% media · <45% alto riesgo.

---

## 5. IMPORTANTE — Datos reales vs. demostración

La SIC **no ofrece una API pública gratuita**. La app incluye una **base de referencia de
demostración** (con el ejemplo “LAS MANOS”) y enlaza a la consulta oficial
**SIPI → https://sipi.sic.gov.co** para la verificación con validez legal.

**Sobre la credencial de la SIC:** no se automatiza el login en SIPI (va contra los términos
del portal y este suele bloquear accesos automatizados). El abogado inicia sesión
**manualmente** en SIPI y registra los antecedentes verificados. Si en el futuro se contrata
una integración autorizada, la credencial iría **cifrada en variables de entorno de Vercel**
(`SIC_USERNAME` / `SIC_PASSWORD`), nunca en el código.

---

## 6. Estructura

```
src/
├─ app/
│  ├─ login/                 # inicio de sesión
│  ├─ (app)/                 # área autenticada (panel, buscar, casos, guia, usuarios)
│  └─ api/                   # rutas seguras (auth, casos, usuarios)
├─ components/               # UI (formularios, tablas, modales, PDF)
└─ lib/                      # db, auth, viabilidad, datos de Niza, modelos
public/                      # logos Versus
```

---

## 7. Aviso legal

El porcentaje de viabilidad es una **herramienta de orientación**; no reemplaza el concepto
jurídico ni la verificación oficial en SIPI. La decisión de registrabilidad corresponde a la
**SIC** (Decisión 486 de la CAN).
