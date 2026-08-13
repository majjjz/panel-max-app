# Deploy — Panel Max PWA

## A. Lado Google (una sola vez, ~5 min)

1. Abre el Sheet **Panel_Max_Comida** → **Extensiones → Apps Script**.
2. **＋ → Secuencia de comandos**, nómbralo `Api` y pega el contenido de `apps-script/Api.gs`. Guarda.
3. **Configuración del proyecto (⚙️) → Propiedades del script → Agregar propiedad**:
   - Propiedad: `API_TOKEN`
   - Valor: el token secreto (largo, aleatorio — no lo guardes en ningún archivo del repo).
4. **Implementar → Nueva implementación → Aplicación web**:
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier persona**  ← necesario para que la PWA pueda llamar por fetch; el token es el candado real.
5. Copia la **URL /exec** de esta implementación (es NUEVA, distinta a la de la app vieja).

> La app vieja sigue funcionando igual: `Api.gs` solo agrega `doPost`, no toca nada.

## B. Lado celular (una sola vez, ~1 min)

1. Abre en Chrome del cel:
   `https://<usuario>.github.io/panel-max-app/?api=<URL_EXEC>&token=<API_TOKEN>`
   (se autoconfigura y limpia la URL; también puedes capturarlo a mano con el ⚙️ de la pantalla Inicio).
2. Menú de Chrome → **Agregar a pantalla de inicio / Instalar app**.
3. Listo: icono propio, pantalla completa, sin barra del navegador.

## Actualizaciones

- **UI**: editar archivos → commit → push. GitHub Pages publica solo (1-2 min). El service worker toma la versión nueva al segundo arranque de la app.
- **API** (si cambian funciones del servidor): pegar cambios en Apps Script → **Implementar → Administrar implementaciones → ✎ → Versión: Nueva → Implementar** (misma URL).
- Si agregas una función de servidor nueva: agregarla a `API_ALLOW` en `Api.gs` **y** a `FNS` en el shim de `index.html`.
