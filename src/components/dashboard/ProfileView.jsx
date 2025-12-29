import Link from 'next/link'; // Not needed, removed
import InsigniasPanel from './InsigniasPanel';
import {
    MODULES_ES, MODULES_EN,
    HIDDEN_BADGES_ES, HIDDEN_BADGES_EN
} from '../../data/constants';

const ProfileView = ({ progress, profile, onEquipAvatar, onEquipTheme, onBack, t, lang = 'es', currentXp }) => {
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
                        <User className="text-brand-500" /> {t?.profile?.avatars || "Mis Avatares"}
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
                        <Palette className="text-brand-500" /> {t?.profile?.themes || "Mis Temas"}
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
                            <p className="text-xs font-black text-slate-800">Estándar</p>
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
                        <Zap className="text-brand-500" /> {t?.profile?.backpack || "Mochila de Objetos"}
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
                                    No tienes objetos en tu mochila. ¡Visita la tienda!
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
                        {t?.profile?.title || "Mi Perfil / Mochila"}
                    </h2>
                    <p className="text-slate-500 font-medium">Gestiona tu equipo y recompensas</p>
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
                    Mi Equipo
                </button>
                <button
                    onClick={() => setActiveTab('stats')}
                    className={`px-8 py-3 rounded-xl font-bold transition-all ${activeTab === 'stats' ? 'bg-white text-brand-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Estadísticas
                </button>
            </div>

            {activeTab === 'inventory' ? renderInventory() : (
                <div className="space-y-6">
                    {/* Render Insignias (Stats) here */}
                    <InsigniasPanel
                        progress={progress}
                        currentLevel={progress.level}
                        currentXp={currentXp}
                        t={t}
                        modules={lang === 'en' ? MODULES_EN : MODULES_ES}
                        hiddenBadges={lang === 'en' ? HIDDEN_BADGES_EN : HIDDEN_BADGES_ES}
                    />

                    <div className="bg-white border border-slate-100 rounded-3xl p-8 text-center animate-in zoom-in-95 duration-500 mt-4">
                        <h3 className="text-lg font-bold text-slate-600 mb-2">Exámenes Realizados</h3>
                        <div className="text-4xl font-black text-brand-500">{progress.examAttempts?.length || 0}</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileView;
