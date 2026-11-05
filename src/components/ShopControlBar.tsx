import React from 'react';
import {
  ShoppingBag,
  User,
  Users,
  UserPlus,
  Wallet,
  Weight,
  Cpu,
  Heart,
  PlusCircle,
  Package,
  Layers,
  ChevronDown,
  Sparkles,
  ShieldAlert,
  Coins
} from 'lucide-react';
import { PlayerProfile } from '../types/playerProfile.ts';
import { calculateProfileStats } from '../utils/profileService.ts';
import { playCyberClick, playCyberSelect } from '../utils/audio.ts';

interface ShopControlBarProps {
  isShopMode: boolean;
  onToggleShopMode: () => void;
  activeProfile: PlayerProfile;
  profiles: PlayerProfile[];
  onSelectProfile: (id: string) => void;
  onOpenInventory: () => void;
  onOpenProfileManager: () => void;
  onOpenCreateProfile: () => void;
  onQuickAddFunds: () => void;
}

export const ShopControlBar: React.FC<ShopControlBarProps> = ({
  isShopMode,
  onToggleShopMode,
  activeProfile,
  profiles,
  onSelectProfile,
  onOpenInventory,
  onOpenProfileManager,
  onOpenCreateProfile,
  onQuickAddFunds,
}) => {
  const stats = calculateProfileStats(activeProfile);
  const totalItemsCount = activeProfile.inventory.reduce((sum, i) => sum + (i.quantity || 1), 0);
  const weightPercent = Math.min(100, Math.round((stats.totalCarriedWeightKg / activeProfile.maxWeightKg) * 100));
  const cyberPercent = Math.min(100, Math.round((stats.totalCybertension / activeProfile.maxCybertension) * 100));

  return (
    <div className="bg-[#070b13] border-y border-cyan-500/40 px-3 sm:px-6 py-2.5 font-mono text-xs">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Left: Mode Toggle & Profile Switcher */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Virtual Shop Mode Toggle */}
          <button
            onClick={() => {
              playCyberClick();
              onToggleShopMode();
            }}
            className={`px-3 py-1.5 rounded font-bold uppercase tracking-wider flex items-center gap-2 border transition-all ${
              isShopMode
                ? 'bg-amber-500 text-black border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                : 'bg-zinc-900/90 text-zinc-300 border-zinc-700 hover:border-cyan-400 hover:text-cyan-300'
            }`}
            title="Basculer entre la consultation du catalogue et la boutique marchande interactive"
          >
            <ShoppingBag className={`w-4 h-4 ${isShopMode ? 'fill-black' : ''}`} />
            <span>{isShopMode ? 'Boutique Virtuelle : ACTIVE' : 'Mode Boutique'}</span>
            {isShopMode && <span className="w-2 h-2 rounded-full bg-black animate-ping" />}
          </button>

          {/* Active Profile Dropdown / Selector */}
          <div className="flex items-center gap-1.5 bg-zinc-950/90 border border-cyan-800/60 rounded px-2.5 py-1">
            <div
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: activeProfile.avatarColor || '#00f0ff' }}
            />
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-zinc-400 leading-tight">PROFIL JOUEUR</span>
              <div className="flex items-center gap-1">
                <select
                  value={activeProfile.id}
                  onChange={(e) => {
                    playCyberSelect();
                    if (e.target.value === '__create_new__') {
                      onOpenCreateProfile();
                    } else {
                      onSelectProfile(e.target.value);
                    }
                  }}
                  className="bg-transparent text-cyan-200 font-bold text-xs focus:outline-none cursor-pointer truncate max-w-[140px] sm:max-w-[180px]"
                  aria-label="Sélectionner le profil joueur actif"
                >
                  {profiles.map((p) => (
                    <option key={p.id} value={p.id} className="bg-zinc-900 text-zinc-100">
                      {p.name} ({p.role})
                    </option>
                  ))}
                  <option value="__create_new__" className="bg-cyan-950 text-cyan-300 font-bold">
                    + Créer un nouveau profil...
                  </option>
                </select>
              </div>
            </div>
            <button
              onClick={() => {
                playCyberClick();
                onOpenProfileManager();
              }}
              className="p-1 rounded text-zinc-400 hover:text-cyan-300 hover:bg-cyan-950/40 transition-colors ml-0.5"
              title="Gérer, dupliquer ou exporter tous les profils"
              aria-label="Gérer les profils"
            >
              <Users className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Create Profile Button */}
          <button
            onClick={() => {
              playCyberClick();
              onOpenCreateProfile();
            }}
            className="px-2.5 py-1.5 rounded bg-zinc-900 border border-cyan-700/60 text-cyan-300 hover:bg-cyan-950/60 hover:border-cyan-400 transition-all flex items-center gap-1.5 font-bold"
            title="Créer rapidement un nouveau profil de joueur indépendant"
            aria-label="Créer un nouveau profil"
          >
            <UserPlus className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">+ Profil</span>
          </button>

          {/* Player Inventory Button */}
          <button
            onClick={() => {
              playCyberClick();
              onOpenInventory();
            }}
            className="px-3 py-1.5 rounded bg-cyan-950/60 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-900/60 hover:border-cyan-400 transition-all flex items-center gap-2 font-bold"
            title="Consulter et gérer l'équipement possédé par ce joueur"
          >
            <Package className="w-3.5 h-3.5 text-cyan-400" />
            <span>Mon Paquetage</span>
            <span className="px-1.5 py-0.2 rounded-full bg-cyan-500 text-black text-[10px] font-black">
              {totalItemsCount}
            </span>
          </button>
        </div>

        {/* Right: Wallet & Live Tactical Gauges */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 justify-between lg:justify-end">
          {/* Wallet Balances */}
          <div className="flex items-center gap-2 bg-zinc-950/90 border border-zinc-800 rounded px-2.5 py-1">
            <Coins className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <div className="flex items-center gap-2.5">
              <div>
                <span className="text-[10px] text-zinc-500 block leading-none">EURODOLLARS</span>
                <span className="text-xs font-bold text-amber-300">
                  {activeProfile.walletEb.toLocaleString('fr-FR')} €$
                </span>
              </div>
              <div className="h-5 w-px bg-zinc-800" />
              <div>
                <span className="text-[10px] text-zinc-500 block leading-none">CRÉDITS IZ</span>
                <span className="text-xs font-bold text-cyan-300">
                  {activeProfile.walletCredits.toLocaleString('fr-FR')} c$
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                playCyberClick();
                onQuickAddFunds();
              }}
              className="p-1 rounded text-zinc-400 hover:text-amber-300 hover:bg-amber-950/40 transition-colors ml-1"
              title="Ajouter une prime ou récompense de mission"
              aria-label="Ajouter des fonds"
            >
              <PlusCircle className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Tactical Encombrement & Cybertension meters */}
          <div className="flex items-center gap-3 bg-zinc-950/80 border border-zinc-800/80 rounded px-2.5 py-1">
            {/* Weight Meter */}
            <div className="flex flex-col" title={`Poids transporté: ${stats.totalCarriedWeightKg} / ${activeProfile.maxWeightKg} kg`}>
              <div className="flex items-center justify-between text-[10px] gap-2">
                <span className="flex items-center gap-1 text-zinc-400">
                  <Weight className="w-3 h-3 text-zinc-400" /> Poids
                </span>
                <span className={stats.isOverweight ? 'text-red-400 font-bold' : 'text-zinc-200'}>
                  {stats.totalCarriedWeightKg} / {activeProfile.maxWeightKg} kg
                </span>
              </div>
              <div className="w-20 h-1.5 bg-zinc-900 rounded-full overflow-hidden mt-0.5">
                <div
                  className={`h-full transition-all ${
                    stats.isOverweight ? 'bg-red-500' : weightPercent > 75 ? 'bg-amber-400' : 'bg-cyan-400'
                  }`}
                  style={{ width: `${weightPercent}%` }}
                />
              </div>
            </div>

            {/* Cybertension Meter */}
            <div className="flex flex-col" title={`Cybertension installée: ${stats.totalCybertension} / ${activeProfile.maxCybertension} pts`}>
              <div className="flex items-center justify-between text-[10px] gap-2">
                <span className="flex items-center gap-1 text-zinc-400">
                  <Cpu className="w-3 h-3 text-cyan-400" /> Cyber
                </span>
                <span className={stats.isCyberOverloaded ? 'text-red-400 font-bold' : 'text-cyan-300'}>
                  {stats.totalCybertension} / {activeProfile.maxCybertension} pt
                </span>
              </div>
              <div className="w-16 h-1.5 bg-zinc-900 rounded-full overflow-hidden mt-0.5">
                <div
                  className={`h-full transition-all ${
                    stats.isCyberOverloaded ? 'bg-red-500 animate-pulse' : cyberPercent > 75 ? 'bg-amber-400' : 'bg-fuchsia-400'
                  }`}
                  style={{ width: `${cyberPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
