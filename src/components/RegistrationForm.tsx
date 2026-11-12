import React, { useState } from 'react';
import { User, Phone, Mail, Building2, Send, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { FormErrors, LeadData } from '../types';
import { saveLead } from '../utils/storage';

interface FormProps {
  onSuccess: (lead: LeadData) => void;
}

export const RegistrationForm: React.FC<FormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    company: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Por favor ingresá tu nombre y apellido';
    }

    const phoneClean = formData.phone.trim();
    if (!phoneClean) {
      newErrors.phone = 'Ingresá tu celular con código de área';
    } else if (phoneClean.replace(/\D/g, '').length < 8) {
      newErrors.phone = 'El número debe tener al menos 8 dígitos';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Ingresá un email válido';
    }

    if (!formData.company.trim() || formData.company.trim().length < 2) {
      newErrors.company = 'Ingresá tu empresa o emprendimiento';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const saved = await saveLead({
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim().toLowerCase(),
        company: formData.company.trim(),
      });

      setFormData({
        fullName: '',
        phone: '',
        email: '',
        company: '',
      });
      setErrors({});
      setIsSubmitting(false);

      setShowToast(true);

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.25 },
          colors: ['#10b981', '#1b2e7b', '#f59e0b', '#3b82f6'],
        });
      } catch (err) {
        console.error(err);
      }

      onSuccess(saved);

      setTimeout(() => {
        setShowToast(false);
      }, 2000);

    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-full flex-1 flex flex-col">
      {/* Modal / Cartel de afirmación centrado en pantalla con fondo oscuro y sombra */}
      {showToast && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xs w-full shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-slate-100 flex flex-col items-center text-center animate-in zoom-in-90 duration-200">
            {/* Ícono de tilde positivo grande */}
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4 ring-8 ring-emerald-50/60 shadow-inner">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              ¡Registro completado!
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Tus datos han sido guardados correctamente.
            </p>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full bg-white rounded-t-[36px] sm:rounded-3xl p-6 sm:p-8 shadow-2xl shadow-blue-950/20 border-t sm:border border-slate-100 flex flex-col justify-between text-left flex-1"
      >
        {/* Campos distribuidos verticalmente de forma óptima */}
        <div className="flex flex-col justify-around flex-1 py-1 gap-2 sm:gap-3">
          {/* Nombre y Apellido */}
          <div>
            <label className="block text-sm sm:text-base font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-[#1b2e7b]" />
              <span>Nombre y apellido</span>
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="fullName"
                autoComplete="name"
                placeholder="Ej: Sofia Martínez"
                value={formData.fullName}
                onChange={(e) => {
                  setFormData({ ...formData, fullName: e.target.value });
                  if (errors.fullName) setErrors({ ...errors, fullName: undefined });
                }}
                className={`w-full px-4 py-4 rounded-2xl bg-slate-50 border text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:bg-white transition-all text-base ${
                  errors.fullName
                    ? 'border-red-400 focus:ring-red-200 focus:border-red-500'
                    : 'border-slate-200 focus:ring-blue-100 focus:border-[#1b2e7b]'
                }`}
              />
            </div>
            {errors.fullName && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.fullName}</p>
            )}
          </div>

          {/* Celular con código de área */}
          <div>
            <label className="block text-sm sm:text-base font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
              <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-[#1b2e7b]" />
              <span>Celular (con código de área)</span>
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="tel"
                name="phone"
                autoComplete="tel"
                placeholder="Ej: 11 5432 1098"
                value={formData.phone}
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value });
                  if (errors.phone) setErrors({ ...errors, phone: undefined });
                }}
                className={`w-full px-4 py-4 rounded-2xl bg-slate-50 border text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:bg-white transition-all text-base ${
                  errors.phone
                    ? 'border-red-400 focus:ring-red-200 focus:border-red-500'
                    : 'border-slate-200 focus:ring-blue-100 focus:border-[#1b2e7b]'
                }`}
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Incluí el código de área sin el 0 y sin el 15</p>
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm sm:text-base font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-[#1b2e7b]" />
              <span>Email</span>
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="Ej: sofia.martinez@empresa.com"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                className={`w-full px-4 py-4 rounded-2xl bg-slate-50 border text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:bg-white transition-all text-base ${
                  errors.email
                    ? 'border-red-400 focus:ring-red-200 focus:border-red-500'
                    : 'border-slate-200 focus:ring-blue-100 focus:border-[#1b2e7b]'
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>
            )}
          </div>

          {/* Empresa / Emprendimiento */}
          <div>
            <label className="block text-sm sm:text-base font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
              <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#1b2e7b]" />
              <span>Empresa / emprendimiento</span>
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="company"
                autoComplete="organization"
                placeholder="Ej: Innovar Tech / Consultora X"
                value={formData.company}
                onChange={(e) => {
                  setFormData({ ...formData, company: e.target.value });
                  if (errors.company) setErrors({ ...errors, company: undefined });
                }}
                className={`w-full px-4 py-4 rounded-2xl bg-slate-50 border text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:bg-white transition-all text-base ${
                  errors.company
                    ? 'border-red-400 focus:ring-red-200 focus:border-red-500'
                    : 'border-slate-200 focus:ring-blue-100 focus:border-[#1b2e7b]'
                }`}
              />
            </div>
            {errors.company && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.company}</p>
            )}
          </div>
        </div>

        {/* Submit Button grande y con presencia como en la captura */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-4 mb-2 py-4 sm:py-5 px-6 bg-gradient-to-r from-[#1b2e7b] to-[#2541a8] hover:from-[#152461] hover:to-[#1b2e7b] text-white font-bold rounded-2xl shadow-xl shadow-blue-900/30 active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 text-lg sm:text-xl disabled:opacity-60 cursor-pointer"
        >
          {isSubmitting ? (
            <span>Enviando información...</span>
          ) : (
            <>
              <span>Enviar formulario</span>
              <Send className="w-5 h-5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
