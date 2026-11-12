import type { LeadData } from '../types';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const STORAGE_KEY = 'iae_2026_leads';

export function clearLeads(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Error clearing leads from localStorage', e);
  }
}

export function getLeads(): LeadData[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error reading leads from localStorage', e);
    return [];
  }
}

/**
 * Guarda en localStorage y envía a Google Sheets de forma asíncrona
 */
export async function saveLead(lead: Omit<LeadData, 'id' | 'timestamp'>): Promise<LeadData> {
  const newLead: LeadData = {
    ...lead,
    id: 'lead_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    timestamp: new Date().toISOString(),
  };

  const leads = getLeads();
  leads.unshift(newLead);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  } catch (e) {
    console.error('Error saving lead to localStorage', e);
  }

  const sheetsUrl = import.meta.env.VITE_GOOGLE_SHEETS_URL;
  if (sheetsUrl && sheetsUrl.trim().length > 0) {
    // Usar FormData para evitar preflights y asegurar compatibilidad total con Google Apps Script
    try {
      const formData = new FormData();
      formData.append('timestamp', newLead.timestamp);
      formData.append('fullName', newLead.fullName);
      formData.append('phone', newLead.phone);
      formData.append('email', newLead.email);
      formData.append('company', newLead.company);

      fetch(sheetsUrl, {
        method: 'POST',
        mode: 'no-cors',
        body: formData,
      }).catch((err) => {
        console.warn('Error en fetch no-cors a Google Sheets:', err);
      });
    } catch (sheetError) {
      console.warn('No se pudo enviar a Google Sheets en este momento:', sheetError);
    }
  }

  return newLead;
}

/**
 * Exportar a planilla Excel (.xlsx) nativa
 */
export function exportLeadsToExcel(): void {
  const leads = getLeads();
  if (leads.length === 0) {
    alert('No hay registros para exportar.');
    return;
  }

  const data = leads.map((l) => ({
    'Fecha y Hora': new Date(l.timestamp).toLocaleString('es-AR'),
    'Nombre y Apellido': l.fullName,
    'Celular': l.phone,
    'Email': l.email,
    'Empresa / Emprendimiento': l.company,
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);

  worksheet['!cols'] = [
    { wch: 20 },
    { wch: 25 },
    { wch: 18 },
    { wch: 28 },
    { wch: 26 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Participantes');

  const dateStr = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(workbook, `IAE_2026_Participantes_${dateStr}.xlsx`);
}

/**
 * Exportar a documento PDF formateado
 */
export function exportLeadsToPDF(): void {
  const leads = getLeads();
  if (leads.length === 0) {
    alert('No hay registros para exportar.');
    return;
  }

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  doc.setFontSize(16);
  doc.setTextColor(27, 46, 123);
  doc.text('IAE Business School ✕ Mi Gusto', 14, 18);

  doc.setFontSize(11);
  doc.setTextColor(100, 116, 139);
  doc.text('Reporte Oficial de Participantes Registrados - Evento 2026', 14, 25);

  const dateStr = new Date().toLocaleString('es-AR');
  doc.setFontSize(9);
  doc.text(`Generado el: ${dateStr} | Total de inscriptos: ${leads.length}`, 14, 31);

  const tableRows = leads.map((l, index) => [
    index + 1,
    l.fullName,
    l.phone,
    l.email,
    l.company,
    new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' hs',
  ]);

  autoTable(doc, {
    startY: 36,
    head: [['#', 'Nombre y Apellido', 'Celular', 'Email', 'Empresa / Empr.', 'Hora']],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [27, 46, 123],
      textColor: 255,
      fontSize: 9,
      fontStyle: 'bold',
      halign: 'left',
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: [30, 41, 59],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 42 },
      2: { cellWidth: 30 },
      3: { cellWidth: 46 },
      4: { cellWidth: 42 },
      5: { cellWidth: 16, halign: 'center' },
    },
    styles: {
      overflow: 'linebreak',
      cellPadding: 2.5,
    },
  });

  doc.save(`IAE_2026_Participantes_${new Date().toISOString().slice(0, 10)}.pdf`);
}
