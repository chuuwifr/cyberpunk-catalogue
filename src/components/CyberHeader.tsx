import React from 'react';
import {
  Search,
  Star,
  Layers,
  Dices,
  Volume2,
  VolumeX,
  SlidersHorizontal,
  Terminal,
  Activity,
  X,
  Github
} from 'lucide-react';
import { playCyberClick } from '../utils/audio.ts';
import { GitHubUser } from '../utils/githubService.ts';
import { PlayerProfile } from '../types/playerProfile.ts';

interface CyberHeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  favoritesCount: number;
  onOpenFavorites: () => void;
  isFavoritesActive: boolean;
  onToggleFavoritesMode: () => void;
  compareCount: number;
  onOpenCompare: () => void;
  onOpenDiceRoller: () => void;
  onOpenAddEquipment: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  scanlinesEnabled: boolean;
  onToggleScanlines: () => void;
  ruleSystem: 'both' | 'red' | 'iz';
  onRuleSystemChange: (sys: 'both' | 'red' | 'iz') => void;
  githubUser: GitHubUser | null;
  onOpenGitHubModal: () => void;
  activeProfile?: PlayerProfile;
  onOpenProfileManager?: () => void;
}

export const CyberHeader: React.FC<CyberHeaderProps> = ({
  searchQuery,
  onSearchChange,
  favoritesCount,
  onOpenFavorites,
  isFavoritesActive,
  onToggleFavoritesMode,
  compareCount,
  onOpenCompare,
  onOpenDiceRoller,
  onOpenAddEquipment,
  soundEnabled,
  onToggleSound,
  scanlinesEnabled,
  onToggleScanlines,
  ruleSystem,
  onRuleSystemChange,
  githubUser,
  onOpenGitHubModal,
  activeProfile,
  onOpenProfileManager,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0a0d14]/95 backdrop-blur-md border-b border-cyan-500/30 shadow-[0_4px_25px_rgba(0,240,255,0.08)]">
      {/* Top micro ticker */}
      <div className="bg-[#05070a] border-b border-cyan-950 px-4 py-1 flex items-center justify-between text-[11px] font-mono text-cyan-400/80">
        <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
          <span className="inline-flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            GLOBAL DATANET ONLINE // TAP V4.2
          </span>
          {activeProfile && (
            <>
              <span className="text-zinc-600">|</span>
              <button
                onClick={() => {
                  playCyberClick();
                  onOpenProfileManager?.();
                }}
                className="inline-flex items-center gap-1.5 text-zinc-300 hover:text-cyan-300 transition-colors"
                title="Gérer les profils de joueurs"
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: activeProfile.avatarColor || '#00f0ff' }}
                />
                <span className="text-zinc-500">OPÉRATEUR:</span>
                <span className="font-bold text-cyan-300">{activeProfile.name}</span>
                <span className="text-zinc-500 text-[10px]">({activeProfile.role})</span>
              </button>
            </>
          )}
          <span className="text-zinc-600 hidden sm:inline">|</span>
          <span className="text-amber-400 hidden sm:inline">MALMART 2090</span>
          <span className="text-zinc-600 hidden md:inline">|</span>
          <span className="text-zinc-400 hidden md:inline">CORPO LINK: ARASAKA / MILITECH / BKI / AGA</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Rules System Quick Switch */}
          <div className="flex items-center bg-zinc-900 border border-cyan-800/60 rounded px-1.5 py-0.5 text-[10px]">
            <span className="text-zinc-400 mr-1.5 hidden lg:inline">Affichage Règles:</span>
            <button
              onClick={() => {
                playCyberClick();
                onRuleSystemChange('both');
              }}
              className={`px-1.5 py-0.5 rounded font-bold transition-colors ${
                ruleSystem === 'both' ? 'bg-cyan-500 text-black' : 'text-zinc-400 hover:text-cyan-300'
              }`}
              title="Afficher Cyberpunk RED & Interface Zéro 2.0"
            >
              HYBRIDE
            </button>
            <button
              onClick={() => {
                playCyberClick();
                onRuleSystemChange('red');
              }}
              className={`px-1.5 py-0.5 rounded font-bold transition-colors ${
                ruleSystem === 'red' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:text-red-400'
              }`}
              title="Focaliser sur Cyberpunk RED"
            >
              CP RED
            </button>
            <button
              onClick={() => {
                playCyberClick();
                onRuleSystemChange('iz');
              }}
              className={`px-1.5 py-0.5 rounded font-bold transition-colors ${
                ruleSystem === 'iz' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-amber-400'
              }`}
              title="Focaliser sur les règles SWADE / Interface Zéro 2.0"
            >
              SWADE / IZ
            </button>
          </div>

          {/* Sound toggle */}
          <button
            onClick={() => {
              onToggleSound();
            }}
            aria-label={soundEnabled ? 'Désactiver le son cybernétique' : 'Activer le son cybernétique'}
            className="p-1 text-zinc-400 hover:text-cyan-400 transition-colors"
            title={soundEnabled ? 'Son activé' : 'Son coupé'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Scanlines toggle */}
          <button
            onClick={() => {
              playCyberClick();
              onToggleScanlines();
            }}
            aria-label="Basculer filtre scanlines CRT"
            className={`p-1 text-[10px] font-mono border rounded px-1.5 transition-colors ${
              scanlinesEnabled ? 'border-cyan-500 text-cyan-300 bg-cyan-950/40' : 'border-zinc-800 text-zinc-500'
            }`}
            title="Activer/Désactiver scanlines CRT"
          >
            CRT
          </button>
        </div>
      </div>

      {/* Main bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand / Title */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded bg-cyan-950/80 border border-cyan-400/60 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
            <Terminal className="w-5 h-5 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-[#0a0d14]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-xl font-bold tracking-wider font-['Orbitron',sans-serif] bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-400 bg-clip-text text-transparent">
                TECH COMPENDIUM
              </h1>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-red-950/80 border border-red-500/50 text-red-400 rounded">
                RED &amp; IZ 2.0
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono hidden sm:block">
              Catalogue de matériel, armement &amp; cybermatériel // Night City &amp; Malmart 2090
            </p>
          </div>
        </div>

        {/* Quick Search Input */}
        <div className="flex-1 max-w-md min-w-[240px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Recherche rapide (nom, corpo, dégâts, smartgun, AP...)"
              className="w-full pl-9 pr-9 py-2 bg-zinc-950/90 border border-cyan-500/40 rounded text-sm text-cyan-100 placeholder-zinc-500 font-mono focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 shadow-inner"
              aria-label="Recherche rapide d'équipement"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-cyan-300 p-0.5"
                aria-label="Effacer la recherche"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {/* Mode Favoris Toggle */}
          <button
            onClick={() => {
              playCyberClick();
              onToggleFavoritesMode();
            }}
            aria-pressed={isFavoritesActive}
            aria-label={`Filtrer par favoris (${favoritesCount})`}
            className={`flex items-center gap-1.5 px-3 py-2 rounded text-xs font-mono font-bold tracking-wide border transition-all ${
              isFavoritesActive
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-amber-400/60 hover:text-amber-300'
            }`}
            title="Afficher uniquement les favoris dans le catalogue"
          >
            <Star className={`w-3.5 h-3.5 ${favoritesCount > 0 ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span className="hidden sm:inline">Favoris</span>
            <span className="px-1.5 py-0.2 bg-amber-950 border border-amber-500/40 rounded text-[10px] text-amber-300">
              {favoritesCount}
            </span>
          </button>

          {/* Open Loadout Drawer Button */}
          <button
            onClick={() => {
              playCyberClick();
              onOpenFavorites();
            }}
            aria-label="Ouvrir le paquetage et calcul du matériel"
            className="flex items-center gap-1.5 px-2.5 py-2 rounded text-xs font-mono font-bold tracking-wide bg-zinc-900 border border-amber-600/50 text-amber-300 hover:bg-amber-950/40 transition-colors"
            title="Ouvrir la fiche de paquetage et le calcul du poids/budget"
          >
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden lg:inline">Paquetage</span>
          </button>

          {/* Comparateur */}
          <button
            onClick={() => {
              playCyberClick();
              onOpenCompare();
            }}
            aria-label={`Ouvrir comparateur (${compareCount})`}
            className="flex items-center gap-1.5 px-2.5 py-2 rounded text-xs font-mono font-bold tracking-wide bg-zinc-900 border border-zinc-700 text-zinc-300 hover:border-cyan-400/60 hover:text-cyan-300 transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Comparer</span>
            {compareCount > 0 && (
              <span className="px-1.5 py-0.2 bg-cyan-950 border border-cyan-500/40 rounded text-[10px] text-cyan-300">
                {compareCount}
              </span>
            )}
          </button>

          {/* Add / Create Equipment Button */}
          <button
            onClick={() => {
              playCyberClick();
              onOpenAddEquipment();
            }}
            aria-label="Créer un nouvel équipement ou arme"
            className="flex items-center gap-1.5 px-3 py-2 rounded text-xs font-mono font-bold tracking-wide bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black border border-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.3)] transition-all"
          >
            <span className="text-sm font-extrabold">+</span>
            <span className="hidden sm:inline">Créer Matériel</span>
          </button>

          {/* Dice Roller */}
          <button
            onClick={() => {
              playCyberClick();
              onOpenDiceRoller();
            }}
            aria-label="Ouvrir le simulateur de dés Cyberpunk RED et Savage Worlds"
            className="flex items-center gap-1.5 px-2.5 py-2 rounded text-xs font-mono font-bold tracking-wide bg-gradient-to-r from-red-950/80 to-zinc-900 border border-red-600/50 text-red-300 hover:border-red-400 hover:text-red-200 transition-all shadow-[0_0_10px_rgba(239,68,68,0.15)]"
          >
            <Dices className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden lg:inline">Dés</span>
          </button>

          {/* GitHub Uplink Button */}
          <button
            onClick={() => {
              playCyberClick();
              onOpenGitHubModal();
            }}
            aria-label="Ouvrir la synchronisation GitHub et Gists"
            className={`flex items-center gap-1.5 px-2.5 py-2 rounded text-xs font-mono font-bold tracking-wide transition-all border ${
              githubUser
                ? 'bg-emerald-950/50 border-emerald-500 text-emerald-300 hover:bg-emerald-900/60 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                : 'bg-zinc-900 border-cyan-700/60 text-cyan-300 hover:border-cyan-400 hover:bg-cyan-950/40 shadow-[0_0_10px_rgba(0,240,255,0.12)]'
            }`}
            title={githubUser ? `Connecté à GitHub en tant que @${githubUser.login} (cliquez pour synchroniser)` : 'Connecter GitHub (Gist & Sauvegardes)'}
          >
            <Github className={`w-3.5 h-3.5 ${githubUser ? 'text-emerald-400' : 'text-cyan-400'}`} />
            {githubUser ? (
              <span className="hidden sm:inline">@{githubUser.login}</span>
            ) : (
              <span className="hidden sm:inline">GitHub</span>
            )}
            <span className={`w-1.5 h-1.5 rounded-full ${githubUser ? 'bg-emerald-400 animate-pulse' : 'bg-cyan-400'}`} />
          </button>
        </div>
      </div>
    </header>
  );
};
