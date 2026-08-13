# Panel Max — PWA

App de seguimiento del Plan 30K (dieta, entrenos, peso, agua, agenda) instalable en el celular como PWA.

**Versión:** 1.0.0

## Arquitectura

```
Celular (PWA en GitHub Pages)
   │  fetch() POST JSON {token, fn, args}
   ▼
Google Apps Script (API JSON, container-bound al Sheet)
   ▼
Google Sheet "Panel_Max_Comida"  ◄── bot Garmin (GitHub Actions, repo panel-max-bot)
```

- `index.html` — UI completa (Beige&Noir). Un *shim* emula `google.script.run` y redirige cada llamada a la API por `fetch()`, así la lógica original quedó intacta.
- `sw.js` — service worker: shell offline (red primero, caché de respaldo). Los datos de `getInit`/`getPanel` se cachean en localStorage → la app muestra lo último aunque no haya señal.
- `manifest.json` — instalable: pantalla completa, icono propio, tema oscuro.
- `apps-script/Api.gs` — archivo para pegar en el proyecto Apps Script del Sheet: agrega `doPost` (API JSON con token). No modifica la app vieja.

## Seguridad

- El repo es público (requisito de GitHub Pages free): **aquí no vive ningún secreto**.
- La URL de la API y el token se guardan solo en `localStorage` del celular (pantalla ⚙️ o parámetros `?api=...&token=...` una sola vez).
- La API valida `API_TOKEN` (Propiedades del script) en cada llamada.
- La key de Gemini nunca sale de Apps Script.

## Deploy

Ver [DEPLOY.md](DEPLOY.md).

## Changelog

- **1.0.0** (2026-08-13) — Port inicial desde Apps Script HTMLService a PWA: shim `google.script.run`→fetch, manifest + service worker + iconos, modal de conexión, caché offline de datos.
