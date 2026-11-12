import { useState, useEffect, useRef } from 'react';
import { RegistrationForm } from './components/RegistrationForm';
import { AdminModal } from './components/AdminModal';
import type { LeadData } from './types';
import { getLeads } from './utils/storage';

export default function App() {
  const [leads, setLeads] = useState<LeadData[]>([]);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [showAdminButton, setShowAdminButton] = useState(false);
  const secretClicksRef = useRef(0);
  const secretTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLeads(getLeads());

    // Si la URL contiene ?admin=true o ?admin=1, se hace visible el botón de registros
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true' || params.get('admin') === '1') {
      setShowAdminButton(true);
    }
  }, []);

  const handleSecretClick = () => {
    secretClicksRef.current += 1;
    if (secretTimeoutRef.current) clearTimeout(secretTimeoutRef.current);

    if (secretClicksRef.current >= 3) {
      setIsAdminOpen(true);
      setShowAdminButton(true);
      secretClicksRef.current = 0;
      return;
    }

    secretTimeoutRef.current = setTimeout(() => {
      secretClicksRef.current = 0;
    }, 2000);
  };

  const handleLeadSaved = (newLead: LeadData) => {
    setLeads((prev) => [newLead, ...prev]);
  };

  return (
    <div className="min-h-[100dvh] w-full bg-[#0a1128] text-slate-100 flex flex-col justify-between pt-[max(0.75rem,env(safe-area-inset-top))] pb-[env(safe-area-inset-bottom)] selection:bg-[#233d99] selection:text-white relative overflow-x-hidden overflow-y-auto">
      {/* Decorative ambient background glows (CSS radial-gradient para máxima compatibilidad y rendimiento en iOS Safari) */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[550px] h-[350px] pointer-events-none rounded-full"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(37,99,235,0.18) 0%, rgba(10,17,40,0) 70%)',
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-[400px] h-[400px] pointer-events-none rounded-full"
        style={{
          background: 'radial-gradient(circle at center, rgba(49,46,129,0.25) 0%, rgba(10,17,40,0) 70%)',
        }}
      />

      {/* Top Bar with Logos (IAE x Mi Gusto Colaboración) */}
      <header className="relative z-10 w-full px-5 max-w-lg mx-auto flex items-center justify-between mb-2.5 shrink-0">
        <div className={`flex items-center gap-3 transition-all ${!showAdminButton ? 'mx-auto' : ''}`}>
          {/* Logo IAE Oficial */}
          <div className="flex items-center">
            <img
              src={`${import.meta.env.BASE_URL}iae-official-darkbg.png`}
              alt="IAE Business School"
              className="h-10 w-auto object-contain filter drop-shadow-md rounded-md"
            />
          </div>

          {/* Separador / Cruz de Alianza (Tocar 3 veces seguidas para abrir panel de registros) */}
          <button
            type="button"
            onClick={handleSecretClick}
            className="text-slate-400/60 hover:text-slate-200 font-light text-base select-none cursor-default bg-transparent border-none p-1 focus:outline-none transition-colors"
            title=""
            aria-label="Separador"
          >
            ✕
          </button>

          {/* Logo Mi Gusto sin fondo */}
          <div className="flex items-center">
            <img
              src={`${import.meta.env.BASE_URL}logo-migusto.png`}
              alt="Mi Gusto"
              className="h-9 w-auto object-contain filter drop-shadow-sm"
            />
          </div>
        </div>

        {/* Botón de registros: solo visible si se activó por URL (?admin=true) o por el gesto de 3 toques */}
        {showAdminButton && (
          <div className="flex items-center animate-in fade-in duration-200">
            <button
              onClick={() => setIsAdminOpen(true)}
              className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 text-slate-200 border border-white/10 transition-all backdrop-blur-sm cursor-pointer shadow-sm"
              title="Ver base de datos y exportar CSV"
            >
              <span>Registros</span>
              <span className="bg-[#1b2e7b] text-white text-[11px] font-bold px-2 py-0.5 rounded-full border border-blue-400/30">
                {leads.length}
              </span>
            </button>
          </div>
        )}
      </header>

      {/* Main Content Area: Ocupa el 100% del ancho de la pantalla */}
      <main className="relative z-10 w-full flex-1 flex flex-col justify-start">
        {/* The Form */}
        <div className="w-full flex-1 flex flex-col">
          <RegistrationForm onSuccess={handleLeadSaved} />
        </div>
      </main>

      {/* Modal Admin para ver los leads y descargarlos */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        leads={leads}
      />
    </div>
  );
}
