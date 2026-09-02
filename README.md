# TaskGo — Proyecto guía del curso (Ionic 9 + Angular + Capacitor 8)

App de gestión de tareas construida **incrementalmente, clase a clase**. Cada clase
del curso vive en su propia rama de Git, encadenada sobre la anterior, para que los
alumnos vean el progreso paso a paso. Todas fueron **compiladas y probadas** en Docker.

## Cómo correr (con Docker, sin instalar nada)

```bash
docker compose up --build
```
- App: `http://localhost:8100`
- API (json-server): `http://localhost:3000/tasks`

Para frenar: `docker compose down`. (Sin Docker: `npm install`, luego `npm run api` y `ionic serve`.)

## Ver una clase en particular

```bash
git switch clase-03        # o clase-01, clase-02, ...
docker compose up --build
```

## Progresión de ramas

| Rama | Clase | Qué agrega | Verificado |
|---|---|---|---|
| `clase-01` | 1 | Proyecto base + página home "TaskGo" | Compila + render |
| `clase-02` | 2 | Lista de tareas maquetada + theming + dark mode | Compila + render + dark toggle |
| `clase-03` | 3 | Navegación: tabs + menú lateral (split-pane) | Compila + render |
| `clase-04` | 4 | Formulario reactivo con validaciones + FAB | Compila + validación en vivo |
| `clase-05` | 5 | TaskService + HttpClient + json-server (loading/error) | Compila + carga desde API |
| `clase-06` | 6 | Persistencia (Preferences) + offline network-first + chip | Compila + fallback offline probado |
| `clase-08` | 8 | Cámara (@capacitor/camera) + filesystem | Compila + render (cámara real = dispositivo) |
| `clase-09` | 9 | Geolocalización + notificaciones locales | Compila (nativo = dispositivo) |
| `clase-10` | 10 | Swipe (item-sliding) + pull-to-refresh + modal animado | Compila + modal probado |
| `clase-12` | 12 | Tests unitarios (servicio HTTP + formulario) | Specs typecheck (correr con `ng test` + Chrome) |
| `clase-15-auth` | 15 (opcional) | Login/registro con JWT, guard, interceptor, logout | **Probado end-to-end**: guard, login, Bearer, logout |
| `main` | — | App completa (equivale a `clase-12`) | — |

### Sobre la rama `clase-15-auth`

Agrega autenticación: `AuthService`, `authInterceptor`, `authGuard`, páginas de login y
registro, y logout en Perfil. La API usa un **servidor de auth mínimo** (`auth-server.js`,
solo `json-server`, sin dependencias extra) que expone `POST /register` y `POST /login`.

> **Por qué no `json-server-auth`:** el paquete `json-server-auth@2.1.0` que menciona el
> Módulo 15 tiene una **incompatibilidad real en Node 22** (su dependencia transitiva
> `router`/`path-to-regexp@8` rompe la ruta `/666/*` y ni siquiera instala limpio). Por eso
> esta rama usa `auth-server.js`, que es robusto, autocontenido y didáctico (se ve cómo un
> endpoint emite un token). El token es un JWT "de mentira" (payload base64, sin firma real):
> alcanza para practicar el flujo; en producción se usa un proveedor real + almacenamiento seguro.

Probar: `docker compose up --build`, ir a `http://localhost:8100` (redirige a `/login`),
crear una cuenta, y verás la lista. El interceptor adjunta `Authorization: Bearer` en cada pedido.

> No hay rama para la Clase 7 (examen intermedio; ver el repo `taskgo-lite`) ni para la
> Clase 11 (build nativo Android/iOS; ver el Anexo 16 del curso). La Clase 13 es la
> presentación del TP Final.

## Notas de verificación

- Las clases **1 a 6** y **10** son 100% probables en el navegador y se verificaron
  visualmente (lista, dark mode, tabs+menú, formulario+validación, API, offline, modal).
- Las clases **8 y 9** usan APIs nativas (cámara, GPS, notificaciones): compilan y las
  pantallas renderizan, pero el hardware real solo funciona en emulador/dispositivo.
- La clase **12** (tests) se verificó por *typecheck*; para ejecutarlos hace falta un
  navegador Chrome (`ng test` en la máquina del alumno).

## Requisitos

- Docker Desktop **o** Node.js 22+ con la CLI de Ionic (`npm install -g @ionic/cli`).
