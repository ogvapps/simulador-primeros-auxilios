import React, { useState } from 'react';
import { HeartPulse, Volume2, VolumeX, User, Lock, Menu, X, LogOut, Flame, Moon, Sun, HelpCircle, Cloud, CloudOff, RefreshCw, Check } from 'lucide-react';
import HelpTutorial from '../dashboard/HelpTutorial';
import PrivacyPolicy from '../common/PrivacyPolicy';

const Layout = ({ children, view, setView, profile, currentLevel, currentXp, muted, toggleMute, onAdminClick, onLogout, onDeleteAccount, streak, darkMode, toggleDarkMode, lang, toggleLang, t, onProfileClick, isSaving }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const [showPrivacy, setShowPrivacy] = useState(false);

    return (
        <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} font-sans selection:bg-brand-200 selection:text-brand-900 flex flex-col`}>
            {/* Header */}
            <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 transition-all duration-300 print:hidden">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <div
                        className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setView('home')}
                    >
                        <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-xl">
                            <HeartPulse size={24} className="text-red-600 dark:text-red-500 animate-pulse-fast" />
                        </div>
                        <h1 className="text-xl font-black tracking-tight hidden sm:block">
                            <span className="text-slate-800 dark:text-white">{t?.app?.title || "Simulador P.A.S."}</span>
                        </h1>
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-3">
                        {/* Streak */}
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-lg font-bold text-sm border border-orange-100 dark:border-orange-800/30" title={t?.nav?.streak || "Racha"}>
                            <Flame size={16} className={streak > 0 ? "fill-orange-500 animate-pulse" : ""} />
                            <span>{streak}</span>
                        </div>

                        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

                        {/* Help */}
                        <button onClick={() => setShowHelp(true)} className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" title={t?.nav?.help || "Ayuda"}>
                            <HelpCircle size={20} />
                        </button>

                        {/* Sound */}
                        <button onClick={toggleMute} className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" title={muted ? (t?.nav?.soundOn || "Activar Sonido") : (t?.nav?.soundOff || "Silenciar")}>
                            {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                        </button>

                        {/* Dark Mode */}
                        <button onClick={toggleDarkMode} className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" title={darkMode ? (t?.nav?.lightMode || "Modo Claro") : (t?.nav?.darkMode || "Modo Oscuro")}>
                            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {/* Lang */}
                        <button onClick={toggleLang} className="flex items-center justify-center p-2 w-10 h-10 text-xs font-black bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors uppercase">
                            {lang === 'es' ? 'ES' : 'EN'}
                        </button>

                        {/* Profile */}
                        {profile ? (
                            <button
                                onClick={onProfileClick}
                                className="flex items-center gap-3 pl-2 pr-4 py-1.5 ml-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-full transition-all group"
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-lg font-bold ${profile.avatarColor || 'bg-brand-500 shadow-sm border border-white/20'}`}>
                                    {profile.activeAvatarIcon || (profile.name ? profile.name[0] : 'U')}
                                </div>
                                <div className="text-left">
                                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-none mb-0.5">{profile.name}</p>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Lvl {currentLevel} • {currentXp} XP</p>
                                </div>
                            </button>
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse ml-2" />
                        )}

                        {/* Admin */}
                        <button onClick={onAdminClick} className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors ml-1" title={t?.nav?.admin || "Acceso Docente"}>
                            <Lock size={20} />
                        </button>

                        <button onClick={onLogout} className="p-2 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 rounded-lg transition-colors ml-1" title="Cerrar Sesión">
                            <LogOut size={20} />
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-2">
                        <button onClick={toggleLang} className="px-2 py-1 text-xs font-bold bg-slate-100 dark:bg-slate-800 rounded uppercase">
                            {lang}
                        </button>
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600 dark:text-slate-300">
                            {isMobileMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden absolute top-16 left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 shadow-xl animate-in slide-in-from-top-2">
                        <div className="flex flex-col gap-2">
                            {profile && (
                                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl mb-2" onClick={() => { onProfileClick(); setIsMobileMenuOpen(false); }}>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-xl font-bold ${profile.avatarColor || 'bg-brand-500 shadow-sm'}`}>
                                        {profile.activeAvatarIcon || (profile.name ? profile.name[0] : 'U')}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white">{profile.name}</p>
                                        <p className="text-xs text-slate-500">Nivel {currentLevel} • {currentXp} XP</p>
                                    </div>
                                </div>
                            )}

                            <button onClick={() => { setView('home'); setIsMobileMenuOpen(false); }} className="p-3 text-left font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">Inicio</button>
                            <button onClick={() => { onAdminClick(); setIsMobileMenuOpen(false); }} className="p-3 text-left font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2"><Lock size={16} /> {t?.nav?.admin || "Docente"}</button>
                            <button onClick={() => { toggleDarkMode(); }} className="p-3 text-left font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2">
                                {darkMode ? <Sun size={16} /> : <Moon size={16} />} {darkMode ? "Modo Claro" : "Modo Oscuro"}
                            </button>
                            <button onClick={() => { toggleMute(); }} className="p-3 text-left font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2">
                                {muted ? <VolumeX size={16} /> : <Volume2 size={16} />} {muted ? "Activar Sonido" : "Silenciar"}
                            </button>
                            <button onClick={() => { setShowHelp(true); setIsMobileMenuOpen(false); }} className="p-3 text-left font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2"><HelpCircle size={16} /> {t?.nav?.help || "Ayuda"}</button>
                            <div className="h-px bg-slate-100 dark:bg-slate-800 my-1"></div>
                            <button onClick={onLogout} className="p-3 text-left font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg flex items-center gap-2"><LogOut size={16} /> Cerrar Sesión</button>
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-grow w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in duration-500">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 text-center text-slate-400 dark:text-slate-500 text-sm print:hidden">
                <p className="mb-2">{t?.footer?.title || "Simulador de Primeros Auxilios para Educación"}</p>
                <div className="flex justify-center gap-4 text-xs font-bold text-slate-300">
                    <span>© {new Date().getFullYear()} {t?.footer?.rights || "OGV Apps Educational"} • ogonzalezv01@educarex.es</span>
                    <span>•</span>
                    <button onClick={() => setShowPrivacy(true)} className="hover:text-brand-600 transition-colors">{t?.nav?.privacy || "Privacidad"}</button>
                    <span>•</span>
                    <a href="#" className="hover:text-brand-600 transition-colors">{t?.nav?.terms || "Términos"}</a>
                    <span>•</span>
                    <button onClick={onDeleteAccount} className="hover:text-red-500 transition-colors">{t?.nav?.deleteAccount || "Baja"}</button>
                </div>
                {/* Sync & network Status */}
                <div className="flex items-center justify-center gap-2 mt-4 text-xs font-medium text-slate-300">
                    {isSaving ? (
                        <><RefreshCw size={12} className="animate-spin text-brand-400" /> <span>{t?.sync?.saving || "Guardando..."}</span></>
                    ) : (
                        <><Cloud size={12} className="text-green-400" /> <span>{t?.sync?.saved || "Guardado"}</span></>
                    )}
                </div>
            </footer>

            {/* Modals */}
            <HelpTutorial isOpen={showHelp} onClose={() => setShowHelp(false)} t={t} />
            {showPrivacy && <PrivacyPolicy onClose={() => setShowPrivacy(false)} t={t} />}
        </div>
    );
};

export default Layout;
