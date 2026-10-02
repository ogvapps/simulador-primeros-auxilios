import React from 'react';
import { ArrowLeft } from 'lucide-react';
import InsigniasPanel from '../dashboard/InsigniasPanel';
import ProfileView from '../dashboard/ProfileView';

const ProfilePage = ({ progress, currentLevel, currentXp, profile, t, lang, modules, hiddenBadges, onBack, onJoinClass, onEquipAvatar, onEquipTheme }) => {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 fade-in duration-500 pb-20">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all text-slate-500 hover:text-brand-600">
          <ArrowLeft />
        </button>
        <h1 className="text-3xl font-black text-slate-900">Tu Perfil de Agente</h1>
      </div>

      <InsigniasPanel
        progress={progress}
        currentLevel={currentLevel}
        currentXp={currentXp}
        t={t}
        modules={modules}
        hiddenBadges={hiddenBadges}
      />

      <ProfileView
        progress={progress}
        profile={profile}
        t={t}
        lang={lang}
        currentXp={currentXp}
        onBack={onBack}
        onJoinClass={onJoinClass}
        onEquipAvatar={onEquipAvatar}
        onEquipTheme={onEquipTheme}
      />
    </div>
  );
};

export default ProfilePage;
