import React from 'react';
import { Shield, X, UserCheck } from 'lucide-react';

const PrivacyPolicy = ({ onClose, t }) => {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[85vh] flex flex-col border border-slate-100">
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    aria-label="Cerrar"
                >
                    <X size={22} />
                </button>

                <div className="flex items-center gap-3 mb-5 pb-5 border-b border-slate-100">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Shield size={26} />
                    </div>
                    <div>
                        <h2 className="text-xl sm:text-2xl font-black text-slate-800">
                            {t?.privacy?.title || "Protección de Datos y Privacidad Escolar"}
                        </h2>
                        <p className="text-slate-400 text-xs font-semibold">
                            Conforme al RGPD (UE 2016/679) y Ley Orgánica 3/2018 (LOPDGDD)
                        </p>
                    </div>
                </div>

                <div className="overflow-y-auto pr-2 space-y-5 text-slate-600 text-sm leading-relaxed">
                    <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-2xl flex items-start gap-3 text-blue-900 text-xs font-medium">
                        <UserCheck size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                        <p>
                            <strong>Entorno Educativo Protegido:</strong> Este simulador está diseñado para el aprendizaje de soporte vital básico en centros escolares, aplicando el principio de minimización de datos para menores de edad.
                        </p>
                    </div>

                    <section>
                        <h3 className="font-bold text-slate-800 text-base mb-1.5 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-bold">1</span>
                            Responsable del Tratamiento y Finalidad
                        </h3>
                        <p>
                            El responsable del tratamiento es el Centro Educativo o Departamento docente organizador de la actividad formativa (Contacto docente: <code className="text-xs font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-700">ogonzalezv01@educarex.es</code>).
                            La finalidad exclusiva es el desarrollo pedagógico, seguimiento formativo y evaluación didáctica del taller de Primeros Auxilios y Soporte Vital Básico (P.A.S.).
                        </p>
                    </section>

                    <section>
                        <h3 className="font-bold text-slate-800 text-base mb-1.5 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-bold">2</span>
                            Base Jurídica y Tratamiento en Menores
                        </h3>
                        <p>
                            La base jurídica que legitima este tratamiento es el cumplimiento de una misión realizada en <strong>interés público y el ejercicio de la función docente</strong> regulada en la <strong>Disposición Adicional 23ª de la Ley Orgánica 2/2006 de Educación (LOE/LOMLOE)</strong> y el artículo 6.1.e del RGPD. No se requiere autorización mercantil al tratarse de actividades curriculares escolares y no recabar datos para finalidades ajenas a la enseñanza.
                        </p>
                    </section>

                    <section>
                        <h3 className="font-bold text-slate-800 text-base mb-1.5 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-bold">3</span>
                            Datos Recabados y Principio de Minimización
                        </h3>
                        <p>
                            En estricto cumplimiento del principio de minimización (Art. 5.1.c RGPD), únicamente se solicitan:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-500">
                            <li><strong>Identificador escolar:</strong> Nombre de pila o alias y curso escolar.</li>
                            <li><strong>Credencial de acceso:</strong> Correo electrónico y contraseña cifrada para autenticación.</li>
                            <li><strong>Progreso didáctico:</strong> Puntuaciones en simulacros, módulos completados, nivel y medallas gamificadas.</li>
                        </ul>
                        <p className="mt-2 text-xs text-slate-500 italic">
                            * No se solicitan datos de salud reales, DNI, direcciones postales, teléfonos ni datos biométricos.
                        </p>
                    </section>

                    <section>
                        <h3 className="font-bold text-slate-800 text-base mb-1.5 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-bold">4</span>
                            Seguridad, Confidencialidad y No Cesión
                        </h3>
                        <p>
                            Los datos nunca se venden, ceden ni transfieren a terceros con fines comerciales o publicitarios. La aplicación no utiliza cookies de seguimiento publicitario. Las comunicaciones están cifradas bajo protocolo seguro TLS/HTTPS, las contraseñas están protegidas mediante funciones hash seguras y los correos electrónicos se mantienen estrictamente en colecciones privadas sin exposición pública.
                        </p>
                    </section>

                    <section>
                        <h3 className="font-bold text-slate-800 text-base mb-1.5 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-bold">5</span>
                            Tus Derechos (Acceso, Rectificación y Supresión)
                        </h3>
                        <p>
                            De acuerdo con el RGPD y la LOPDGDD, los alumnos o sus representantes legales pueden ejercer sus derechos de acceso, rectificación, limitación y supresión. En cumplimiento del <strong>Derecho de Supresión (Derecho al Olvido, Art. 17 RGPD)</strong>, cualquier estudiante puede eliminar de forma autónoma e inmediata su cuenta y todo su registro de datos desde la sección <em>"Baja / Eliminar Cuenta"</em> disponible en el menú o pie de página.
                        </p>
                    </section>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow transition-all text-sm"
                    >
                        Entendido
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
