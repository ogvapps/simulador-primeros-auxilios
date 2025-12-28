import React from 'react';
import { Home, AlertCircle } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="text-center max-w-md">
                <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400 animate-bounce">
                    <AlertCircle size={48} />
                </div>
                <h1 className="text-6xl font-black text-slate-800 mb-2">404</h1>
                <h2 className="text-2xl font-bold text-slate-600 mb-4">Página no encontrada</h2>
                <p className="text-slate-400 mb-8">Parece que te has perdido en el simulacro. Esta ruta no existe.</p>

                <a href="/" className="inline-flex items-center gap-2 bg-brand-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-brand-700 transition-colors shadow-lg shadow-brand-200">
                    <Home size={20} /> Volver al Inicio
                </a>
            </div>
        </div>
    );
};

export default NotFound;
