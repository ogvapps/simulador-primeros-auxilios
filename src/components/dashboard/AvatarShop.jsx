import React, { useState, useEffect } from 'react';
import { User, Stethoscope, Flame, Siren, Award, Crown, Lock, Check, ShoppingBag, ArrowLeft } from 'lucide-react';

const ICON_MAP = {
    User: User,
    Stethoscope: Stethoscope,
    Flame: Flame,
    Siren: Siren,
    Award: Award,
    Crown: Crown
};

const AvatarShop = ({ avatars, t, currentXp, unlockedAvatars = ['default'], currentAvatar, onBuy, onSelect, onBack, playSound }) => {

    const handleBuy = (avatar) => {
        if (currentXp >= avatar.cost) {
            if (playSound) playSound('kaching'); // Need to handle this sound or generic success
            onBuy(avatar);
        } else {
            if (playSound) playSound('error');
        }
    };

    if (!avatars) return null;

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8 animate-in fade-in duration-500">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button onClick={onBack} className="bg-white p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm text-slate-600">
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h1 className="text-3xl font-black text-slate-800 tracking-tight">{t?.shop?.title || "Tienda de Avatares"}</h1>
                            <p className="text-slate-500 font-medium">{t?.shop?.subtitle || "Personaliza tu perfil"}</p>
                        </div>
                    </div>

                    <div className="bg-white px-6 py-3 rounded-2xl border-2 border-yellow-400 shadow-sm flex items-center gap-3">
                        <div className="bg-yellow-100 p-2 rounded-lg">
                            <ShoppingBag className="text-yellow-600" size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t?.shop?.credits || "Tus Créditos"}</p>
                            <p className="text-2xl font-black text-slate-800">{currentXp} XP</p>
                        </div>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {avatars.map(avatar => {
                        const isUnlocked = unlockedAvatars.includes(avatar.id);
                        const isSelected = currentAvatar === avatar.id;
                        const canAfford = currentXp >= avatar.cost;
                        const Icon = ICON_MAP[avatar.icon] || User;

                        return (
                            <div
                                key={avatar.id}
                                className={`
                                    relative overflow-hidden rounded-3xl border-2 transition-all duration-300
                                    ${isSelected
                                        ? 'border-brand-500 bg-brand-50 shadow-xl scale-[1.02]'
                                        : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-lg'
                                    }
                                    ${!isUnlocked && !canAfford ? 'opacity-70' : ''}
                                `}
                            >
                                <div className="p-8 flex flex-col items-center text-center">
                                    {/* Avatar Visual */}
                                    <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-md transition-transform duration-500 hover:rotate-12 ${avatar.color}`}>
                                        <Icon size={48} />
                                    </div>

                                    <h3 className="text-2xl font-black text-slate-800 mb-2">{avatar.name}</h3>

                                    {/* Status or Price */}
                                    {isUnlocked ? (
                                        <div className="mt-4">
                                            {isSelected ? (
                                                <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg font-bold">
                                                    <Check size={18} /> {t?.shop?.selected || "Seleccionado"}
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => { if (playSound) playSound('click'); onSelect(avatar.id); }}
                                                    className="px-8 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition-colors shadow-lg hover:-translate-y-1 active:scale-95"
                                                >
                                                    {t?.shop?.equip || "Equipar"}
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="mt-4 w-full">
                                            <button
                                                onClick={() => handleBuy(avatar)}
                                                disabled={!canAfford}
                                                className={`
                                                    w-full py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-all
                                                    ${canAfford
                                                        ? 'bg-yellow-400 text-yellow-900 hover:bg-yellow-300 shadow-lg hover:-translate-y-1 active:scale-95'
                                                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                                    }
                                                `}
                                            >
                                                {canAfford ? (
                                                    <>{t?.shop?.buy ? t.shop.buy.replace('{cost}', avatar.cost) : `Comprar por ${avatar.cost} XP`}</>
                                                ) : (
                                                    <><Lock size={16} /> {t?.shop?.need ? t.shop.need.replace('{cost}', avatar.cost) : `Necesitas ${avatar.cost} XP`}</>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default AvatarShop;
