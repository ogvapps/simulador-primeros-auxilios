import React, { useState } from 'react';
import { ShoppingBag, Zap, User, Check, Lock, Palette, Award } from 'lucide-react';
import { STORE_ITEMS } from '../../data/storeCatalog';

const StoreComponent = ({ currentXp, inventory = {}, onPurchase, onBack, t, language = 'es' }) => {
    const [selectedTab, setSelectedTab] = useState('avatars');

    const ownedAvatars = inventory.avatars || ['default'];
    const ownedPowerups = inventory.powerups || {};
    const ownedThemes = inventory.themes || [];
    const ownedTitles = inventory.titles || ['novice'];

    const canAfford = (price) => currentXp >= price;
    const isOwned = (category, id) => {
        if (category === 'avatars') return ownedAvatars.includes(id);
        if (category === 'themes') return ownedThemes.includes(id);
        if (category === 'titles') return ownedTitles.includes(id);
        return false;
    };

    const getLocalizedText = (item, field) => {
        const value = item[field];
        return typeof value === 'object' ? (value[language] || value.es) : value;
    };

    const handlePurchase = (category, item) => {
        if (!canAfford(item.price)) {
            return;
        }
        onPurchase(category, item);
    };

    const ItemCard = ({ item, category }) => {
        const isPowerup = category === 'powerups';
        const owned = !isPowerup && isOwned(category, item.id);
        const affordable = canAfford(item.price);
        const count = isPowerup ? (ownedPowerups[item.id] || 0) : null;
        const name = getLocalizedText(item, 'name');
        const description = getLocalizedText(item, 'description');

        return (
            <div className={`p-3 sm:p-4 rounded-xl border-2 transition-all ${owned ? 'bg-green-50 border-green-300' : affordable ? 'bg-white border-slate-200 hover:border-purple-300 hover:shadow-lg' : 'bg-slate-50 border-slate-200 opacity-60'}`}>
                <div className="text-center mb-3">
                    <div className="text-4xl sm:text-5xl mb-2">{item.icon}</div>
                    <h3 className="font-bold text-slate-800 text-xs sm:text-sm">{name}</h3>
                    <p className="text-[11px] sm:text-xs text-slate-500 mt-1 line-clamp-2">{description}</p>
                </div>

                <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-1 text-xs sm:text-sm font-bold text-purple-600">
                        <Zap size={16} />
                        {item.price}
                    </div>

                    <div className="flex items-center gap-2">
                        {count !== null && count > 0 && (
                            <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">
                                x{count}
                            </span>
                        )}

                        {owned ? (
                            <div className="flex items-center gap-1 text-green-600 text-xs font-bold">
                                <Check size={16} />
                                {t?.store?.owned || 'Adquirido'}
                            </div>
                        ) : (
                            <button
                                onClick={() => handlePurchase(category, item)}
                                disabled={!affordable}
                                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-bold transition-all ${affordable ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                            >
                                {affordable ? (isPowerup && count > 0 ? '+ Más' : (t?.store?.buy || 'Comprar')) : <Lock size={14} />}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-6xl mx-auto p-3 sm:p-4 md:p-8 animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-slate-100 gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
                            <ShoppingBag size={20} className="sm:size-6 text-purple-600" />
                        </div>
                        <div>
                            <h2 className="text-xl sm:text-2xl font-black text-slate-800">{t?.store?.title || 'Tienda'}</h2>
                            <p className="text-xs sm:text-sm text-slate-500">{t?.store?.subtitle || 'Gasta tu XP en objetos'}</p>
                        </div>
                    </div>
                    <div className="flex items-center self-start sm:self-auto gap-2 bg-purple-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border border-purple-200">
                        <Zap size={18} className="text-purple-600" />
                        <span className="font-black text-purple-900 text-sm sm:text-base">{currentXp}</span>
                        <span className="text-[10px] sm:text-xs text-purple-600 font-bold">XP</span>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    <button
                        onClick={() => setSelectedTab('avatars')}
                        className={`px-3 sm:px-4 py-2 rounded-lg font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${selectedTab === 'avatars' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                        <User size={16} className="inline mr-1.5 sm:mr-2" />
                        {t?.store?.avatars || 'Avatares'}
                    </button>
                    <button
                        onClick={() => setSelectedTab('titles')}
                        className={`px-3 sm:px-4 py-2 rounded-lg font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${selectedTab === 'titles' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                        <Award size={16} className="inline mr-1.5 sm:mr-2" />
                        {t?.store?.titles || 'Títulos'}
                    </button>
                    <button
                        onClick={() => setSelectedTab('themes')}
                        className={`px-3 sm:px-4 py-2 rounded-lg font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${selectedTab === 'themes' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                        <Palette size={16} className="inline mr-1.5 sm:mr-2" />
                        {t?.store?.themes || 'Temas'}
                    </button>
                    <button
                        onClick={() => setSelectedTab('powerups')}
                        className={`px-3 sm:px-4 py-2 rounded-lg font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${selectedTab === 'powerups' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                        <Zap size={16} className="inline mr-1.5 sm:mr-2" />
                        {t?.store?.powerups || 'Power-ups'}
                    </button>
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                    {STORE_ITEMS[selectedTab]?.map(item => (
                        <ItemCard key={item.id} item={item} category={selectedTab} />
                    ))}
                </div>

                {/* Back Button */}
                <button
                    onClick={onBack}
                    className="mt-6 w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-all"
                >
                    {t?.store?.back || 'Volver'}
                </button>
            </div>
        </div>
    );
};

export default StoreComponent;
