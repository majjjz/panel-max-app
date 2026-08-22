/*** Panel Max — API JSON para la PWA (v1.1.0)
 * PEGAR COMO ARCHIVO NUEVO "Api.gs" en el proyecto Apps Script del Sheet Panel_Max_Comida.
 * NO toca Code.gs: doGet sigue sirviendo la app vieja tal cual.
 *
 * Requisitos:
 * 1. Propiedades del script → API_TOKEN (secreto largo) y GH_TOKEN (PAT de GitHub
 *    con scopes repo+workflow, para el botón 🔄 que dispara el bot Garmin).
 * 2. Implementar → Nueva implementación → Aplicación web:
 *    Ejecutar como: YO · Quién tiene acceso: CUALQUIER PERSONA
 *    (el token es lo que protege; sin token válido no responde nada)
 ***/

var API_ALLOW = ['getInit', 'getDay', 'addFood', 'addScanned', 'logPlanMeal', 'copyDay',
  'deleteFood', 'moveFood', 'updateGrams', 'togglePlan', 'addWeight', 'addWater',
  'logByText', 'logByPhoto', 'weeklyReport', 'getPanel', 'refreshGarmin'];

/* Dispara el workflow del bot Garmin (majjjz/panel-max-bot, daily-garmin.yml id 332129251).
 * El bot tarda ~1-2 min en escribir al Sheet. */
function refreshGarmin() {
  var t = PropertiesService.getScriptProperties().getProperty('GH_TOKEN');
  if (!t) throw new Error('Falta GH_TOKEN en Propiedades del script');
  var res = UrlFetchApp.fetch(
    'https://api.github.com/repos/majjjz/panel-max-bot/actions/workflows/332129251/dispatches', {
      method: 'post',
      contentType: 'application/json',
      headers: { Authorization: 'token ' + t, Accept: 'application/vnd.github+json' },
      payload: JSON.stringify({ ref: 'main' }),
      muteHttpExceptions: true
    });
  var code = res.getResponseCode();
  if (code !== 204) throw new Error('GitHub respondió ' + code + ': ' + res.getContentText().substring(0, 200));
  return true;
}

function doPost(e) {
  var out;
  try {
    var req = JSON.parse(e.postData.contents);
    var expected = PropertiesService.getScriptProperties().getProperty('API_TOKEN');
    if (!expected) throw new Error('Falta API_TOKEN en Propiedades del script');
    if (req.token !== expected) throw new Error('Token inválido');
    if (API_ALLOW.indexOf(req.fn) < 0) throw new Error('Función no permitida: ' + req.fn);
    var result = globalThis[req.fn].apply(null, req.args || []);
    out = { result: (result === undefined ? true : result) };
  } catch (err) {
    out = { error: String((err && err.message) || err) };
  }
  return ContentService.createTextOutput(JSON.stringify(out))
    .setMimeType(ContentService.MimeType.JSON);
}
