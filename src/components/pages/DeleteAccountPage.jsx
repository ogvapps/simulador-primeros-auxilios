import React from 'react';
import { AlertTriangle, XCircle } from 'lucide-react';

const DeleteAccountPage = ({ onDelete, onBack, t }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 animate-in fade-in zoom-in">
      <div className="bg-red-50 p-6 rounded-full mb-6 text-red-600 animate-pulse border-4 border-red-100">
        <AlertTriangle size={64} />
      </div>
      <h2 className="text-4xl font-black text-slate-800 mb-4 tracking-tight">¿Estás seguro?</h2>
      <p className="text-slate-500 max-w-lg mb-3 text-base sm:text-lg font-medium leading-relaxed">
        Esta acción es <strong>irreversible</strong>. Borraremos de forma permanente todo tu progreso, nivel, medallas y certificados obtenidos.
      </p>
      <p className="text-xs text-slate-400 max-w-md mb-8 leading-relaxed">
        En cumplimiento del <strong>Derecho de Supresión (Derecho al Olvido, Art. 17 RGPD)</strong>, se eliminarán definitivamente tu cuenta, correo electrónico, perfil y estadísticas de nuestros servidores.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <button onClick={onDelete} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-2xl shadow-xl shadow-red-200 transition-all flex items-center justify-center gap-2">
          <XCircle size={20} />
          Sí, Borrar Todo
        </button>
        <button onClick={onBack} className="flex-1 bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 font-bold py-4 px-8 rounded-2xl transition-all flex items-center justify-center gap-2">
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default DeleteAccountPage;
