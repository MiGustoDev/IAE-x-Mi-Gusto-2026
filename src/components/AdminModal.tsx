import React, { useState, useRef, useEffect } from 'react';
import { Download, Users, X, Clock, Building, Mail, Phone, FileSpreadsheet, FileText, ChevronDown } from 'lucide-react';
import type { LeadData } from '../types';
import { exportLeadsToExcel, exportLeadsToPDF } from '../utils/storage';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  leads: LeadData[];
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose, leads }) => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    };
    if (showExportMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showExportMenu]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-center p-0 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white w-full h-[100dvh] max-w-4xl flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100/80 text-[#1b2e7b] flex items-center justify-center shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
                Registros del Evento
              </h2>
              <p className="text-xs text-slate-500">
                Total: <span className="font-semibold text-slate-900">{leads.length} personas</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Dropdown Exportar */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-[#1b2e7b] to-[#2541a8] hover:from-[#152461] hover:to-[#1b2e7b] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-blue-900/20 active:scale-95 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Exportar</span>
                <ChevronDown className="w-3.5 h-3.5 ml-0.5 opacity-80" />
              </button>

              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <button
                    type="button"
                    onClick={() => {
                      exportLeadsToExcel();
                      setShowExportMenu(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-xs sm:text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    <span>Descargar Excel (.xlsx)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      exportLeadsToPDF();
                      setShowExportMenu(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-xs sm:text-sm font-medium text-slate-700 hover:bg-red-50 hover:text-red-700 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-red-600" />
                    <span>Descargar PDF</span>
                  </button>
                </div>
              )}
            </div>

            {/* Botón X de cerrar */}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/80 rounded-xl transition-colors cursor-pointer"
              aria-label="Cerrar registros"
            >
              <X className="w-6 h-6 stroke-[2.2]" />
            </button>
          </div>
        </div>

        {/* Content list ocupando todo el alto */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3 bg-slate-50/40">
          {leads.length === 0 ? (
            <div className="text-center py-24 text-slate-400">
              <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-7 h-7 text-slate-400" />
              </div>
              <p className="text-base font-semibold text-slate-700">Aún no hay participantes</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Los participantes que completen el formulario en sus celulares aparecerán aquí al instante.
              </p>
            </div>
          ) : (
            leads.map((lead) => (
              <div
                key={lead.id}
                className="p-4 rounded-2xl border border-slate-200/80 bg-white hover:border-blue-200 shadow-xs hover:shadow-md transition-all flex flex-col gap-2.5"
              >
                {/* Primera fila: Nombre y Hora */}
                <div className="flex items-start justify-between gap-2">
                  <p className="font-bold text-slate-900 text-base leading-tight">
                    {lead.fullName}
                  </p>
                  <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
                    <Clock className="w-3 h-3" />
                    {new Date(lead.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} hs
                  </span>
                </div>

                {/* Empresa / Emprendimiento Badge */}
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-[#1b2e7b] text-xs font-semibold">
                    <Building className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate max-w-[280px]">{lead.company}</span>
                  </span>
                </div>

                {/* Contact Data (Links táctiles directos para mobile) */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-600">
                  <a
                    href={`tel:${lead.phone.replace(/\s+/g, '')}`}
                    className="inline-flex items-center gap-1.5 hover:text-[#1b2e7b] transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{lead.phone}</span>
                  </a>

                  <a
                    href={`mailto:${lead.email}`}
                    className="inline-flex items-center gap-1.5 hover:text-[#1b2e7b] transition-colors break-all"
                  >
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{lead.email}</span>
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
