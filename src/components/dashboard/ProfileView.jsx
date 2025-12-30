import React, { useState } from 'react';
import { User, Check, Palette, Zap, ArrowLeft, Star, ShoppingBag, GraduationCap } from 'lucide-react';
import {
    MODULES_ES, MODULES_EN,
    HIDDEN_BADGES_ES, HIDDEN_BADGES_EN
} from '../../data/constants';
import { STORE_ITEMS } from '../../data/storeCatalog';

// Helper functions for localization
const getLocalizedName = (item, lang) => {
    if (!item || !item.name) return '';
    return item.name[lang] || item.name.es || item.name;
};

const getLocalizedDescription = (item, lang) => {
    if (!item || !item.description) return '';
    return item.description[lang] || item.description.es || item.description;
};

const ProfileView = ({ progress, profile, onEquipAvatar, onEquipTheme, onBack, onJoinClass, t, lang = 'es', currentXp }) => {
    const [activeTab, setActiveTab] = useState('inventory'); // 'inventory', 'stats'

    const inventory = progress.inventory || { avatars: ['default'], themes: [], powerups: {} };
    // Use profile prop for active selections if available, otherwise fallback
    const activeAvatar = profile?.avatarId || progress.activeAvatar || 'default';
    const activeTheme = progress.activeTheme || 'default';

    const renderInventory = () => {
        return (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Avatars */}
                <section>
                    <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <User className="text-brand-500" /> {t?.profile?.avatars || "My Avatars"}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {inventory.avatars.map(avatarId => {
                            const item = STORE_ITEMS.avatars.find(a => a.id === avatarId);
                            if (!item) return null;
                            const isActive = activeAvatar === avatarId;

                            return (
                                <div
                                    key={avatarId}
                                    onClick={() => onEquipAvatar(avatarId)}
                                    className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all hover:scale-105 ${isActive ? 'border-brand-500 bg-brand-50 shadow-lg' : 'border-slate-100 bg-white hover:border-slate-300'}`}
                                >
                                    {isActive && (
                                        <div className="absolute top-2 right-2 bg-brand-500 text-white rounded-full p-1 z-10">
                                            <Check size={12} />
                                        </div>
                                    )}
                                    <div className="text-4xl mb-2 text-center">{item.icon}</div>
                                    <p className="text-xs font-black text-center text-slate-800 uppercase tracking-tighter truncate">
                                        {getLocalizedName(item, lang)}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Themes */}
                <section>
                    <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Palette className="text-brand-500" /> {t?.profile?.themes || "My Themes"}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {/* Default Theme */}
                        <div
                            onClick={() => onEquipTheme('default')}
                            className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all hover:scale-105 ${activeTheme === 'default' ? 'border-brand-500 bg-brand-50' : 'border-slate-100 bg-white'}`}
                        >
                            <div className="flex gap-1 mb-2">
                                <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200" />
                                <div className="w-6 h-6 rounded-full bg-white border border-slate-200" />
                            </div>
                            <p className="text-xs font-black text-slate-800">{t?.profile?.standard || "Standard"}</p>
                        </div>

                        {inventory.themes?.map(themeId => {
                            const item = STORE_ITEMS.themes.find(t => t.id === themeId);
                            if (!item) return null;
                            const isActive = activeTheme === themeId;

                            return (
                                <div
                                    key={themeId}
                                    onClick={() => onEquipTheme(themeId)}
                                    className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all hover:scale-105 ${isActive ? 'border-brand-500 bg-brand-50 shadow-lg' : 'border-slate-100 bg-white hover:border-slate-300'}`}
                                >
                                    <div className="flex gap-1 mb-2">
                                        <div className="w-6 h-6 rounded-full border border-white/20" style={{ backgroundColor: item.colors?.primary }} />
                                        <div className="w-6 h-6 rounded-full border border-white/20" style={{ backgroundColor: item.colors?.secondary }} />
                                    </div>
                                    <p className="text-xs font-black text-slate-800 uppercase tracking-tighter truncate">
                                        {getLocalizedName(item, lang)}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Power-ups Backpack */}
                <section>
                    <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Zap className="text-brand-500" /> {t?.profile?.backpack || "Item Backpack"}
                    </h3>
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(inventory.powerups || {}).map(([id, count]) => {
                                if (count <= 0) return null;
                                const item = STORE_ITEMS.powerups.find(p => p.id === id);
                                if (!item) return null;

                                return (
                                    <div key={id} className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                                        <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center text-2xl">
                                            {item.icon}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-slate-800 leading-tight">{getLocalizedName(item, lang)}</p>
                                            <p className="text-xs text-slate-400">{getLocalizedDescription(item, lang)}</p>
                                        </div>
                                        <div className="bg-brand-500 text-white px-3 py-1 rounded-full font-black text-sm">
                                            x{count}
                                        </div>
                                    </div>
                                );
                            })}
                            {Object.values(inventory.powerups || {}).every(v => v === 0) && (
                                <p className="text-slate-400 italic text-sm col-span-2 text-center py-4">
                                    {t?.profile?.emptyBackpack || "Your backpack is empty. Visit the store!"}
                                </p>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                    <ArrowLeft size={24} className="text-slate-600" />
                </button>
                <div className="text-center">
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
                        {t?.profile?.title || "My Profile / Backpack"}
                    </h2>
                    <p className="text-slate-500 font-medium">{t?.profile?.subtitle || "Manage your gear and rewards"}</p>
                </div>
                <div className="w-12 h-12 invisible" /> {/* Spacer */}
            </div>

            {/* Profile Card */}
            <div className="bg-white border-2 border-slate-100 rounded-3xl shadow-xl overflow-hidden mb-8">
                <div className="bg-gradient-to-r from-brand-600 to-brand-700 p-8 text-white relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                    <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                        <div className="w-24 h-24 bg-white rounded-3xl shadow-2xl flex items-center justify-center text-5xl transform -rotate-12">
                            {STORE_ITEMS.avatars.find(a => a.id === activeAvatar)?.icon || '👤'}
                        </div>
                        <div className="text-center md:text-left">
                            <h3 className="text-3xl font-black">{profile?.name || progress.name || 'Estudiante'}</h3>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2">
                                <span className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full font-bold text-sm">
                                    <Star size={14} className="text-yellow-300 fill-yellow-300" /> Nivel {progress.level || 1}
                                </span>
                                <span className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full font-bold text-sm">
                                    <ShoppingBag size={14} className="text-brand-200" /> {currentXp} XP
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-2xl mb-8 w-max mx-auto shadow-inner">
                <button
                    onClick={() => setActiveTab('inventory')}
                    className={`px-8 py-3 rounded-xl font-bold transition-all ${activeTab === 'inventory' ? 'bg-white text-brand-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    {t?.profile?.inventoryTab || "My Gear"}
                </button>
                <button
                    onClick={() => setActiveTab('stats')}
                    className={`px-8 py-3 rounded-xl font-bold transition-all ${activeTab === 'stats' ? 'bg-white text-brand-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    {t?.profile?.statsTab || "Stats"}
                </button>
                <button
                    onClick={() => setActiveTab('classroom')}
                    className={`px-8 py-3 rounded-xl font-bold transition-all ${activeTab === 'classroom' ? 'bg-white text-brand-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    {t?.profile?.classTab || "Clase"}
                </button>
            </div>

            {activeTab === 'inventory' ? renderInventory() : (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                    {/* Brutal Main Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-4 rounded-2xl shadow-lg text-white text-center transform hover:scale-105 transition-transform">
                            <span className="text-indigo-200 text-xs font-bold uppercase tracking-widest">{t?.profile?.level || "Level"}</span>
                            <div className="text-4xl font-black mt-1">{progress.level || 1}</div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-2xl shadow-lg text-white text-center transform hover:scale-105 transition-transform">
                            <span className="text-purple-200 text-xs font-bold uppercase tracking-widest">{t?.profile?.totalXp || "Total XP"}</span>
                            <div className="text-4xl font-black mt-1">{currentXp || 0}</div>
                        </div>
                        <div className="bg-gradient-to-br from-pink-500 to-pink-600 p-4 rounded-2xl shadow-lg text-white text-center transform hover:scale-105 transition-transform">
                            <span className="text-pink-200 text-xs font-bold uppercase tracking-widest">{t?.profile?.streak || "Streak"}</span>
                            <div className="text-4xl font-black mt-1 flex items-center justify-center gap-1">
                                {progress.currentStreak || 0} <Zap size={20} className="fill-white" />
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-2xl shadow-lg text-white text-center transform hover:scale-105 transition-transform">
                            <span className="text-orange-200 text-xs font-bold uppercase tracking-widest">{t?.profile?.exams || "Exams"}</span>
                            <div className="text-4xl font-black mt-1">{progress.examAttempts?.length || 0}</div>
                        </div>
                    </div>

                    {/* Detailed Progress Bars */}
                    <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 shadow-xl">
                        <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                            <Star className="text-brand-500" /> {t?.profile?.moduleProgress || "Module Progress"}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            {(lang === 'en' ? MODULES_EN : MODULES_ES).filter(m => m.id !== 'exam').map(module => {
                                const isCompleted = progress[`${module.id}Completed`];
                                return (
                                    <div key={module.id} className="relative">
                                        <div className="flex justify-between mb-1">
                                            <span className="font-bold text-slate-700 text-sm">{module.title}</span>
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isCompleted ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                                {isCompleted ? (t?.profile?.completed || 'COMPLETED') : (t?.profile?.inProgress || 'IN PROGRESS')}
                                            </span>
                                        </div>
                                        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 ease-out ${isCompleted ? 'bg-gradient-to-r from-brand-400 to-brand-600' : 'bg-slate-300'}`}
                                                style={{ width: isCompleted ? '100%' : '30%' }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Exam Performance */}
                    <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 shadow-xl">
                        <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                            <Zap className="text-yellow-500" /> {t?.profile?.examPerformance || "Exam Performance"}
                        </h3>
                        {(!progress.examAttempts || progress.examAttempts.length === 0) ? (
                            <div className="text-center py-10 text-slate-400 italic">
                                {t?.profile?.noExams || "You haven't taken any exams yet."}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {progress.examAttempts.slice(-4).reverse().map((attempt, i) => (
                                    <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                                        <div className="text-xs font-bold text-slate-400 uppercase mb-1">{t?.profile?.recentAttempt || "Recent Attempt"}</div>
                                        <div className={`text-3xl font-black ${attempt.score >= 5 ? 'text-green-600' : 'text-red-500'}`}>
                                            {attempt.score}/10
                                        </div>
                                        <div className="text-xs text-slate-400 mt-1">{new Date(attempt.date).toLocaleDateString()}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            )}

            {/* Classroom Tab */}
            {activeTab === 'classroom' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {progress.classId ? (
                        <div className="bg-white border-2 border-brand-100 rounded-3xl p-8 text-center shadow-xl">
                            <div className="w-24 h-24 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-600">
                                <GraduationCap size={48} />
                            </div>
                            <h2 className="text-2xl font-black text-slate-800 mb-2">Mi Clase</h2>
                            <p className="text-3xl font-bold text-brand-600 mb-6">{progress.className || 'Clase Asignada'}</p>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 inline-block">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">ESTADO</p>
                                <p className="font-mono text-xl font-black text-slate-700">INSCRITO</p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white border-2 border-slate-100 rounded-3xl p-8 shadow-xl">
                            <h3 className="text-xl font-black text-slate-800 mb-4 flex items-center gap-2">
                                <GraduationCap className="text-brand-500" /> Unirse a una Clase
                            </h3>
                            <p className="text-slate-500 mb-6">Pide el código a tu profesor para unirte a su aula virtual y aparecer en su lista.</p>

                            <form onSubmit={(e) => {
                                e.preventDefault();
                                const code = e.target.code.value.trim().toUpperCase();
                                if (code.length > 2 && onJoinClass) onJoinClass(code);
                            }} className="flex flex-col md:flex-row gap-4">
                                <input
                                    name="code"
                                    type="text"
                                    placeholder="CÓDIGO (ej. X7Y2Z1)"
                                    className="flex-1 px-4 py-3 rounded-xl border border-slate-300 font-mono text-lg uppercase font-bold text-center md:text-left focus:ring-2 focus:ring-brand-500 outline-none"
                                    maxLength={8}
                                />
                                <button type="submit" className="bg-brand-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-700 shadow-lg whitespace-nowrap">
                                    Unirse
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProfileView;
