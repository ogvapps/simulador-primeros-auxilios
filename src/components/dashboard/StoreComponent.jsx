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
        if (category === 'powerups') return (ownedPowerups[id] || 0) > 0;
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
            alert(t?.store?.notEnough || 'Not enough XP!');
            return;
        }
        onPurchase(category, item);
    };

    const ItemCard = ({ item, category }) => {
        const owned = isOwned(category, item.id);
        const affordable = canAfford(item.price);
        const count = category === 'powerups' ? (ownedPowerups[item.id] || 0) : null;
        const name = getLocalizedText(item, 'name');
        const description = getLocalizedText(item, 'description');

        return (
            <div className={`p-4 rounded-xl border-2 transition-all ${owned ? 'bg-green-50 border-green-300' : affordable ? 'bg-white border-slate-200 hover:border-purple-300 hover:shadow-lg' : 'bg-slate-50 border-slate-200 opacity-60'}`}>
                <div className="text-center mb-3">
                    <div className="text-5xl mb-2">{item.icon}</div>
                    <h3 className="font-bold text-slate-800 text-sm">{name}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{description}</p>
                </div>

                <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-1 text-sm font-bold text-purple-600">
                        <Zap size={16} />
                        {item.price}
                    </div>

                    {owned ? (
                        <div className="flex items-center gap-1 text-green-600 text-xs font-bold">
                            <Check size={16} />
                            {count !== null ? `x${count}` : (t?.store?.owned || 'Owned')}
                        </div>
                    ) : (
                        <button
                            onClick={() => handlePurchase(category, item)}
                            disabled={!affordable}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${affordable ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                        >
                            {affordable ? (t?.store?.buy || 'Buy') : <Lock size={14} />}
                        </button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                            <ShoppingBag size={24} className="text-purple-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-800">{t?.store?.title || 'Tienda'}</h2>
                            <p className="text-sm text-slate-500">{t?.store?.subtitle || 'Gasta tu XP en objetos'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-xl border border-purple-200">
                        <Zap size={20} className="text-purple-600" />
                        <span className="font-black text-purple-900">{currentXp}</span>
                        <span className="text-xs text-purple-600">XP</span>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    <button
                        onClick={() => setSelectedTab('avatars')}
                        className={`px-4 py-2 rounded-lg font-bold transition-all whitespace-nowrap ${selectedTab === 'avatars' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                        <User size={16} className="inline mr-2" />
                        {t?.store?.avatars || 'Avatares'}
                    </button>
                    <button
                        onClick={() => setSelectedTab('titles')}
                        className={`px-4 py-2 rounded-lg font-bold transition-all whitespace-nowrap ${selectedTab === 'titles' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                        <Award size={16} className="inline mr-2" />
                        {t?.store?.titles || 'Títulos'}
                    </button>
                    <button
                        onClick={() => setSelectedTab('themes')}
                        className={`px-4 py-2 rounded-lg font-bold transition-all whitespace-nowrap ${selectedTab === 'themes' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                        <Palette size={16} className="inline mr-2" />
                        {t?.store?.themes || 'Temas'}
                    </button>
                    <button
                        onClick={() => setSelectedTab('powerups')}
                        className={`px-4 py-2 rounded-lg font-bold transition-all whitespace-nowrap ${selectedTab === 'powerups' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                        <Zap size={16} className="inline mr-2" />
                        {t?.store?.powerups || 'Power-ups'}
                    </button>
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
