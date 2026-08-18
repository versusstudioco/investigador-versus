# Versus Legal — Rastreador de Marcas (Colombia)

Aplicación web para el estudio jurídico **Versus Legal**: consulta de antecedentes,
análisis de **viabilidad en %** de una marca ante la **SIC**, guía/checklist del proceso
de registro y generación de **informe PDF** para el cliente. Con **login seguro del lado
servidor**, **roles y permisos**, y **datos compartidos** entre todo el equipo.

Stack: **Next.js 15 + React 19 + TypeScript** · Base de datos **Firebase (Firestore)** · Deploy en **Vercel**.

---

## 1. Ejecutar en local (desarrollo)

```bash
npm install
cp .env.example .env.local     # y completa las variables de Firebase (ver sección 3, Paso 2)
npm run dev
```

Abre **http://localhost:3000** · Acceso inicial: usuario **ADMIN** / contraseña **123456**.

En el primer arranque, si no hay usuarios en Firestore, se crean solos el **ADMIN** y un
**“Abogado 1”**. En local necesitas la credencial de Firebase en `.env.local` (o el emulador
de Firestore con `FIRESTORE_EMULATOR_HOST`).

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

> El `.gitignore` ya excluye `.env*.local`, `node_modules`, credenciales de Firebase y `/legacy-static`.
> **Nunca subas secretos a GitHub.**

### Paso 2 — Configurar Firebase (Firestore)
1. En **console.firebase.google.com** entra a tu proyecto.
2. **Build → Firestore Database → Crear base de datos** (modo *production*, elige región).
3. **⚙ Configuración del proyecto → Cuentas de servicio → Generar nueva clave privada**.
   Se descarga un archivo JSON. De ese archivo saldrán 3 valores:
   - `project_id`      → `FIREBASE_PROJECT_ID`
   - `client_email`    → `FIREBASE_CLIENT_EMAIL`
   - `private_key`     → `FIREBASE_PRIVATE_KEY` (cópialo completo, con los `\n`)

> ⚠ Ese archivo JSON es un **secreto**: no lo subas a GitHub. Solo se usa para sacar las 3 variables.

### Paso 3 — Importar el proyecto en Vercel
1. Entra a **https://vercel.com** → *Add New… → Project* → importa tu repo de GitHub.
2. En **Environment Variables** agrega:

   | Variable                | Valor                                                  |
   |-------------------------|--------------------------------------------------------|
   | `FIREBASE_PROJECT_ID`   | el `project_id` del JSON                               |
   | `FIREBASE_CLIENT_EMAIL` | el `client_email` del JSON                             |
   | `FIREBASE_PRIVATE_KEY`  | el `private_key` del JSON (completo, entre comillas)   |
   | `AUTH_SECRET`           | una cadena larga aleatoria (`openssl rand -base64 32`) |
   | `ADMIN_USER`            | `ADMIN`                                                |
   | `ADMIN_PASSWORD`        | la contraseña inicial del admin                        |

3. **Deploy**. En el primer acceso se crea automáticamente el usuario ADMIN en Firestore.

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
