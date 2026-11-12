# Formulario IAE Business School 2026

Aplicación en React + TypeScript + Vite + Tailwind CSS desarrollada para el evento de IAE.

## 🚀 Campos incluidos según requerimiento:
1. **Nombre y apellido**
2. **Celular (con código de área)**
3. **Email**
4. **Empresa / emprendimiento**

## ✨ Características
- **Identidad IAE Business School**: Diseñado con los colores institucionales y logos oficiales en alta resolución.
- **Validaciones en tiempo real**: Formato de email, celular mínimo 8 dígitos y nombre completo.
- **Persistencia local (Offline-first)**: Los registros se guardan en `localStorage`, garantizando que no se pierdan datos incluso sin conexión a internet.
- **Panel de Administrador / Registros**: Botón "Ver registros" en la barra superior con contador en vivo.
- **Exportación a CSV**: Permite descargar la planilla con todos los contactos recopilados durante el evento con un solo clic.
- **Feedback visual**: Animación de confirmación y efecto confeti al enviar.

## 📊 Conexión con Google Sheets

La aplicación cuenta con sincronización automática con Google Sheets:
1. Crea una hoja en Google Sheets.
2. Ve a **Extensiones > Apps Script**.
3. Pega el código que se encuentra en [google-apps-script.js](file:///c:/Code/1MGactivos/IAE2026/google-apps-script.js).
4. Haz clic en **Implementar > Nueva implementación**, elige **Aplicación web**, en *"Quién tiene acceso"* selecciona **Cualquier usuario** y copia la URL.
5. Coloca esa URL en el archivo `.env`:
   ```env
   VITE_GOOGLE_SHEETS_URL=https://script.google.com/macros/s/TU_ID/exec
   ```

Los datos se guardan tanto en la planilla de Google en tiempo real como en el almacenamiento local del dispositivo.

```bash
# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Previsualizar build
npm run preview
```
