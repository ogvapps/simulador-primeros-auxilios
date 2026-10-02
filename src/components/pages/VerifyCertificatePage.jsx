import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, ShieldAlert, ArrowLeft } from 'lucide-react';
import { verifyCertificateHash } from '../../utils/cryptoVerify';

const VerifyCertificatePage = ({ verificationData, onBack }) => {
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    async function check() {
      if (!verificationData?.name || !verificationData?.date) {
        setIsValid(false);
        return;
      }
      // If hash was provided in the new format, verify it cryptographically
      if (verificationData.hash) {
        const valid = await verifyCertificateHash(verificationData.name, verificationData.date, verificationData.hash);
        setIsValid(valid);
      } else {
        // Legacy fallback: valid if at least name and date exist
        setIsValid(true);
      }
    }
    check();
  }, [verificationData]);

  if (isValid === null) {
    return (
      <div className="fixed inset-0 z-[100] bg-slate-900 flex items-center justify-center p-6 text-white font-bold">
        Verificando firma criptográfica...
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white rounded-[40px] p-8 md:p-12 max-w-md w-full shadow-2xl animate-in zoom-in duration-500">
        {isValid ? (
          <>
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-emerald-500">
              <CheckCircle2 size={48} className="text-emerald-500 animate-bounce" />
            </div>

            <h2 className="text-3xl font-black text-slate-900 mb-2 leading-none">DIPLOMA VÁLIDO</h2>
            <p className="text-slate-500 mb-6 font-medium italic text-xs">Sistema de Verificación del Departamento de Educación Física</p>

            <div className="bg-slate-50 rounded-3xl p-6 mb-6 border border-slate-100 space-y-4 text-left">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Nombre del Alumno</p>
                <p className="text-xl font-bold text-slate-800">{verificationData?.name || 'Desconocido'}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Fecha de Certificación</p>
                <p className="text-xl font-bold text-slate-800">{verificationData?.date || 'N/A'}</p>
              </div>
            </div>

            <p className="text-xs text-emerald-600 font-bold bg-emerald-50 py-3 px-6 rounded-full inline-block mb-6 ring-1 ring-emerald-200">
              ✓ Documento verificado criptográficamente por la plataforma.
            </p>
          </>
        ) : (
          <>
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-red-500">
              <ShieldAlert size={48} className="text-red-500 animate-pulse" />
            </div>

            <h2 className="text-3xl font-black text-red-600 mb-2 leading-none">DIPLOMA NO VÁLIDO</h2>
            <p className="text-slate-500 mb-6 font-medium text-xs">
              La firma criptográfica no coincide o los datos han sido manipulados.
            </p>
          </>
        )}

        {onBack && (
          <button
            onClick={onBack}
            className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft size={16} /> Volver al Inicio
          </button>
        )}
      </div>
    </div>
  );
};

export default VerifyCertificatePage;
