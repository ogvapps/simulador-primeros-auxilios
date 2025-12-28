import React, { useState } from 'react';
import { ShoppingBag, Zap, User, Check, Lock } from 'lucide-react';
import { STORE_ITEMS } from '../../data/storeCatalog';

const StoreComponent = ({ currentXp, inventory = {}, onPurchase, onBack, t, language = 'es' }) => {
    const [selectedTab, setSelectedTab] = useState('avatars');

    const ownedAvatars = inventory.avatars || ['default'];
    const ownedPowerups = inventory.powerups || {};
    const ownedThemes = inventory.themes || [];

    const canAfford = (price) => currentXp >= price;
    const isOwned = (category, id) => {
        if (category === 'avatars') return ownedAvatars.includes(id);
        if (category === 'powerups') return (ownedPowerups[id] || 0) > 0;
        if (category === 'themes') return ownedThemes.includes(id);
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
                        <span>{item.price} XP</span>
                    </div>

                    {owned ? (
                        <div className="flex items-center gap-1 text-green-600 text-sm font-bold">
                            <Check size={16} />
                            {count !== null && count > 0 && <span>x{count}</span>}
                            {count === null && <span>{t?.store?.owned || 'Owned'}</span>}
                        </div>
                    ) : (
                        <button
                            onClick={() => handlePurchase(category, item)}
                            disabled={!affordable}
                            className={`px-3 py-1 rounded-lg text-sm font-bold transition-all ${affordable ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-slate-300 text-slate-500 cursor-not-allowed'}`}
                        >
                            {affordable ? (t?.store?.buy || 'Buy') : <Lock size={14} />}
                        </button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                <ShoppingBag size={24} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-slate-800">Rewards Store</h1>
                                <p className="text-sm text-slate-500">Spend your XP on awesome rewards!</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-slate-500">Your Balance</p>
                            <div className="flex items-center gap-2 text-2xl font-black text-purple-600">
                                <Zap size={24} />
                                <span>{currentXp} XP</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setSelectedTab('avatars')}
                        className={`flex-1 py-3 rounded-xl font-bold transition-all ${selectedTab === 'avatars' ? 'bg-white shadow-lg text-purple-600' : 'bg-white/50 text-slate-500'}`}
                    >
                        <User size={20} className="inline mr-2" />
                        {t?.store?.avatars || 'Avatars'}
                    </button>
                    <button
                        onClick={() => setSelectedTab('powerups')}
                        className={`flex-1 py-3 rounded-xl font-bold transition-all ${selectedTab === 'powerups' ? 'bg-white shadow-lg text-purple-600' : 'bg-white/50 text-slate-500'}`}
                    >
                        <Zap size={20} className="inline mr-2" />
                        {t?.store?.powerups || 'Power-ups'}
                    </button>
                    <button
                        onClick={() => setSelectedTab('themes')}
                        className={`flex-1 py-3 rounded-xl font-bold transition-all ${selectedTab === 'themes' ? 'bg-white shadow-lg text-purple-600' : 'bg-white/50 text-slate-500'}`}
                    >
                        <ShoppingBag size={20} className="inline mr-2" />
                        Themes
                    </button>
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {STORE_ITEMS[selectedTab].map(item => (
                        <ItemCard key={item.id} item={item} category={selectedTab} />
                    ))}
                </div>

                {/* Back Button */}
                <button
                    onClick={onBack}
                    className="mt-6 px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl transition-all"
                >
                    ← Back to Home
                </button>
            </div>
        </div>
    );
};

export default StoreComponent;
