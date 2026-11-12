/**
 * CÓDIGO PARA GOOGLE APPS SCRIPT
 * -------------------------------------------------------------
 * 1. Abrí tu Google Sheet (Planilla de Google).
 * 2. En el menú superior seleccioná: Extensiones > Apps Script.
 * 3. Borrá cualquier código existente y pegá este código completo.
 * 4. Hacé clic en "Implementar" (Deploy) > "Nueva implementación" (New deployment).
 * 5. Tipo: "Aplicación web" (Web app).
 * 6. Configuración:
 *    - Ejecutar como: "Yo" (tu cuenta de Google).
 *    - Quién tiene acceso: "Cualquier usuario" (Anyone).  <-- ¡IMPORTANTE!
 * 7. Hacé clic en "Implementar", autorizá los permisos y copiá la URL de la Aplicación web que te entrega.
 * 8. Pegá esa URL en el archivo .env de este proyecto:
 *    VITE_GOOGLE_SHEETS_URL=https://script.google.com/macros/s/TU_ID/exec
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Si la hoja está vacía, creamos los encabezados automáticamente
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Fecha y Hora",
        "Nombre y Apellido",
        "Celular",
        "Email",
        "Empresa / Emprendimiento"
      ]);
      
      // Formatear encabezados
      var headerRange = sheet.getRange(1, 1, 1, 5);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#1b2e7b");
      headerRange.setFontColor("#ffffff");
    }

    var data;
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter;
      }
    } else {
      data = e.parameter;
    }

    var fecha = data.timestamp ? new Date(data.timestamp).toLocaleString("es-AR") : new Date().toLocaleString("es-AR");
    var fullName = data.fullName || "";
    var phone = data.phone || "";
    var email = data.email || "";
    var company = data.company || "";

    sheet.appendRow([
      fecha,
      fullName,
      "'" + phone, // con apóstrofe para preservar formato telefónico
      email,
      company
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", message: "Registro guardado exitosamente" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "success", message: "Webhook IAE 2026 activo" }))
    .setMimeType(ContentService.MimeType.JSON);
}
