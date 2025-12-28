import React, { Component } from 'react';
import { ShieldAlert, RefreshCw, Home } from 'lucide-react';

class ShieldErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Shield Boundary Caught Error:", error, errorInfo);
    }

    handleReload = () => {
        window.location.reload();
    };

    handleHome = () => {
        // Attempt to reset state via a hard reload for safety, 
        // or we could try to just reset this boundary if we passed a reset handler.
        // For now, hard reload to root is safest.
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
                    <div className="bg-white max-w-md w-full p-8 rounded-3xl shadow-2xl border border-slate-200 text-center animate-in zoom-in duration-300">
                        <div className="bg-red-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                            <ShieldAlert size={48} className="text-red-500" />
                        </div>

                        <h1 className="text-2xl font-black text-slate-800 mb-2">¡Algo ha fallado!</h1>
                        <p className="text-slate-500 mb-8 font-medium">
                            No te preocupes, nuestros servicios de emergencia están en camino. Ha ocurrido un error inesperado en el simulador.
                        </p>

                        <div className="space-y-3">
                            <button
                                onClick={this.handleReload}
                                className="w-full bg-brand-600 text-white py-4 rounded-xl font-bold flex items-center justify-center hover:bg-brand-700 transition-colors shadow-lg shadow-brand-200"
                            >
                                <RefreshCw size={20} className="mr-2" />
                                Reiniciar Aplicación
                            </button>

                            {process.env.NODE_ENV === 'development' && (
                                <div className="mt-8 p-4 bg-slate-100 rounded-xl text-left overflow-auto max-h-40 text-xs font-mono text-slate-600 border border-slate-200">
                                    {this.state.error && this.state.error.toString()}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ShieldErrorBoundary;
