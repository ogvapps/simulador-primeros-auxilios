import React from 'react';
import { Shield, X } from 'lucide-react';

const PrivacyPolicy = ({ onClose, t }) => {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl relative max-h-[80vh] flex flex-col">
                <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors">
                    <X size={24} />
                </button>

                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
                    <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                        <Shield size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">{t?.privacy?.title || "Política de Privacidad"}</h2>
                        <p className="text-slate-500 text-sm">{t?.privacy?.lastUpdate || "Última actualización: Diciembre 2025"}</p>
                    </div>
                </div>

                <div className="overflow-y-auto pr-2 space-y-6 text-slate-600 leading-relaxed">
                    <section>
                        <h3 className="font-bold text-slate-800 mb-2">{t?.privacy?.section1 || "1. Recopilación de Datos"}</h3>
                        <p>{t?.privacy?.section1Desc || "Utilizamos Google Firebase para autenticar usuarios y guardar su progreso. Recopilamos datos mínimos necesarios como nombre (o apodo), correo electrónico (si se proporciona) y estadísticas de uso de la app (XP, nivel, insignias)."}</p>
                    </section>

                    <section>
                        <h3 className="font-bold text-slate-800 mb-2">{t?.privacy?.section2 || "2. Uso de la Información"}</h3>
                        <p>{t?.privacy?.section2Desc || "Los datos se usan en exclusiva para:"}</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>{t?.privacy?.li1 || "Mantener tu progreso sincronizado entre dispositivos."}</li>
                            <li>{t?.privacy?.li2 || "Mostrar tablas de clasificación (Leaderboards) anónimas o con apodo."}</li>
                            <li>{t?.privacy?.li3 || "Mejorar el contenido educativo."}</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="font-bold text-slate-800 mb-2">{t?.privacy?.section3 || "3. Tus Derechos"}</h3>
                        <p>{t?.privacy?.section3Desc || "No vendemos ni compartimos tus datos con terceros. Tienes derecho a acceder, rectificar o eliminar tus datos en cualquier momento utilizando la opción \"Eliminar Cuenta\" dentro de la aplicación."}</p>
                    </section>

                    <section>
                        <h3 className="font-bold text-slate-800 mb-2">{t?.privacy?.section4 || "4. Contacto"}</h3>
                        <p>{t?.privacy?.section4Desc || "Para dudas sobre privacidad, contacta con el equipo de desarrollo a través del repositorio oficial en GitHub."}</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
