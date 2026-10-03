import React from 'react';
import { BadgeCheck, Award, Download, XCircle } from 'lucide-react';

const CertificatePage = ({ profile, t, onDownload, onSaveSignature, onBack }) => {
  return (
    <div className="min-h-screen bg-slate-200 flex items-center justify-center p-4 overflow-x-hidden print:p-0 print:bg-white">
      <style>{`
        @media print {
          @page { size: landscape; margin: 0; }
          body { -webkit-print-color-adjust: exact; }
        }
      `}</style>

      <div className="w-full max-w-4xl mx-auto px-1 sm:px-4">
        <div className="bg-white p-4 sm:p-8 md:p-12 rounded-lg shadow-2xl w-full min-h-[480px] sm:min-h-0 sm:aspect-[1.414] flex flex-col justify-center text-center border-4 sm:border-[10px] md:border-[20px] border-double border-yellow-600 relative overflow-hidden print:absolute print:top-0 print:left-0 print:w-full print:h-screen print:border-0 print:shadow-none print:z-[100]">
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <BadgeCheck className="w-1/2 h-1/2" />
          </div>

          <div className="relative z-10 flex flex-col items-center justify-between h-full py-2 sm:py-8">
            <div className="flex flex-col items-center">
              <div className="mb-1 sm:mb-4 md:mb-8">
                <Award className="w-8 h-8 sm:w-16 sm:h-16 md:w-20 md:h-20 text-yellow-500 fill-yellow-100" />
              </div>
              <h1 className="text-lg sm:text-3xl md:text-5xl lg:text-6xl font-serif font-black text-slate-900 mb-1 sm:mb-2 md:mb-4 uppercase tracking-widest">Certificado de Honor</h1>
              <div className="w-12 sm:w-24 md:w-32 h-0.5 sm:h-1 bg-yellow-500 mx-auto mb-2 sm:mb-6 md:mb-10"></div>
            </div>

            <div className="flex-1 flex flex-col justify-center w-full">
              <p className="text-[11px] sm:text-lg md:text-xl text-slate-500 font-serif italic mb-1 sm:mb-4 md:mb-8">Se otorga el presente reconocimiento a</p>
              <h2 className="text-xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-brand-700 mb-2 sm:mb-6 md:mb-10 font-serif border-b-2 sm:border-b-4 border-slate-200 inline-block px-3 sm:px-12 pb-1 sm:pb-4 mx-auto max-w-[95%] break-words">
                {profile?.name || 'Estudiante'}
              </h2>
              <p className="text-[11px] sm:text-base md:text-lg lg:text-xl text-slate-600 font-serif leading-relaxed max-w-4xl mx-auto px-2 sm:px-4">
                ha demostrado excelencia y dominio teórico-práctico en el programa de<br />
                <strong className="text-slate-900 text-xs sm:text-xl md:text-2xl lg:text-3xl mt-1 sm:mt-2 block uppercase tracking-tight">PRIMEROS AUXILIOS - SOPORTE VITAL BÁSICO (P.A.S.) - DESA</strong>
              </p>
            </div>

            <div className="flex justify-between w-full max-w-5xl mx-auto px-2 sm:px-12 mt-2 sm:mt-auto pt-2 sm:pt-10 items-end">
              <div className="text-center w-1/3">
                <div className="w-full border-b sm:border-b-2 border-slate-800 mb-1 sm:mb-3 mx-auto"></div>
                <p className="text-[8px] sm:text-xs md:text-sm uppercase tracking-wider font-black text-slate-900 leading-tight">Orestes González V.</p>
                <p className="text-[6px] sm:text-[10px] md:text-xs uppercase tracking-widest font-bold text-slate-400 mt-1 leading-tight">Profesor EF</p>
              </div>
              <div className="hidden sm:flex flex-col items-center justify-end pb-2 opacity-50">
                <div className="border border-slate-200 p-1 bg-white">
                  <div className="w-10 h-10 sm:w-16 sm:h-16 bg-slate-900 pattern-grid-lg"></div>
                </div>
              </div>
              <div className="text-center w-1/3">
                <div className="w-full border-b sm:border-b-2 border-slate-800 mb-1 sm:mb-3 mx-auto"></div>
                <p className="text-[8px] sm:text-xs md:text-sm uppercase tracking-wider font-black text-slate-900 leading-tight">Fecha</p>
                <p className="text-[8px] sm:text-sm md:text-base font-serif text-slate-700 mt-1 leading-tight">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="absolute top-2 right-2 sm:top-4 sm:right-4 md:top-8 md:right-8 print:hidden flex gap-2">
            <button onClick={onDownload} className="bg-brand-600 text-white p-2 sm:p-3 rounded-full hover:bg-brand-700 shadow-lg hover:scale-110 transition-transform z-50 relative" title="Descargar como PDF">
              <Download size={20} className="sm:w-6 sm:h-6" />
            </button>
            <button onClick={onBack} className="bg-slate-200 text-slate-500 p-2 sm:p-3 rounded-full hover:bg-slate-300 hover:scale-110 transition-transform z-50 relative" title="Cerrar">
              <XCircle size={20} className="sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificatePage;
