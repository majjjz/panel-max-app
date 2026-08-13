/*** Panel Max — API JSON para la PWA (v1.0.0)
 * PEGAR COMO ARCHIVO NUEVO "Api.gs" en el proyecto Apps Script del Sheet Panel_Max_Comida.
 * NO toca Code.gs: doGet sigue sirviendo la app vieja tal cual.
 *
 * Requisitos:
 * 1. Propiedades del script → agregar API_TOKEN con un valor secreto largo.
 * 2. Implementar → Nueva implementación → Aplicación web:
 *    Ejecutar como: YO · Quién tiene acceso: CUALQUIER PERSONA
 *    (el token es lo que protege; sin token válido no responde nada)
 ***/

var API_ALLOW = ['getInit', 'addFood', 'addScanned', 'logPlanMeal', 'deleteFood', 'moveFood',
  'updateGrams', 'togglePlan', 'addWeight', 'addWater', 'logByText', 'logByPhoto',
  'weeklyReport', 'getPanel'];

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
