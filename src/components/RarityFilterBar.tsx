import React from 'react';
import { Filter, ArrowUpDown, RotateCcw, Building2 } from 'lucide-react';
import { GearRarity, FilterOptions } from '../utils/gearLogic.ts';
import { playCyberClick } from '../utils/audio.ts';

interface RarityFilterBarProps {
  filters: FilterOptions;
  onFilterChange: (newFilters: Partial<FilterOptions>) => void;
  onResetFilters: () => void;
  manufacturers: string[];
  sortBy: 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'rarity-desc' | 'weight-desc';
  onSortChange: (sort: 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'rarity-desc' | 'weight-desc') => void;
  totalFiltered: number;
  totalOverall: number;
}

const RARITIES: { key: GearRarity | 'all'; label: string; color: string; border: string; bg: string }[] = [
  { key: 'all', label: 'Toutes raretés', color: 'text-zinc-300', border: 'border-zinc-700', bg: 'bg-zinc-900' },
  { key: 'common', label: 'Commun', color: 'text-emerald-400', border: 'border-emerald-500/60', bg: 'bg-emerald-950/40' },
  { key: 'uncommon', label: 'Peu commun', color: 'text-sky-400', border: 'border-sky-500/60', bg: 'bg-sky-950/40' },
  { key: 'rare', label: 'Rare', color: 'text-violet-400', border: 'border-violet-500/60', bg: 'bg-violet-950/40' },
  { key: 'very_rare', label: 'Très Rare', color: 'text-amber-400', border: 'border-amber-500/60', bg: 'bg-amber-950/40' },
  { key: 'legendary', label: 'Exotique / Légendaire', color: 'text-fuchsia-400', border: 'border-fuchsia-500/60', bg: 'bg-fuchsia-950/40' },
];

export const RarityFilterBar: React.FC<RarityFilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  manufacturers,
  sortBy,
  onSortChange,
  totalFiltered,
  totalOverall,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono">
      {/* Rarity filter pills */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1 mr-1">
          <Filter className="w-3.5 h-3.5 text-cyan-400" />
          Rareté:
        </span>
        {RARITIES.map((r) => {
          const isSelected = (filters.rarity || 'all') === r.key;
          return (
            <button
              key={r.key}
              onClick={() => {
                playCyberClick();
                onFilterChange({ rarity: r.key });
              }}
              aria-pressed={isSelected}
              className={`px-2.5 py-1 rounded text-[11px] font-bold tracking-wider border transition-all ${
                isSelected
                  ? `${r.bg} ${r.border} ${r.color} shadow-[0_0_10px_rgba(0,0,0,0.5)] ring-1 ring-cyan-400/40`
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
              }`}
            >
              {r.label}
            </button>
          );
        })}
      </div>

      {/* Controls: Manufacturer, Sort, Reset, Counts */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Manufacturer Filter */}
        <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-800 rounded px-2 py-1">
          <Building2 className="w-3.5 h-3.5 text-cyan-500" />
          <label htmlFor="manufacturer-select" className="sr-only">Filtrer par constructeur</label>
          <select
            id="manufacturer-select"
            value={filters.manufacturer || 'all'}
            onChange={(e) => {
              playCyberClick();
              onFilterChange({ manufacturer: e.target.value });
            }}
            className="bg-transparent text-zinc-300 focus:outline-none text-[11px]"
          >
            <option value="all" className="bg-zinc-900 text-zinc-300">Tous les fabricants / Corpos</option>
            {manufacturers.map((m) => (
              <option key={m} value={m} className="bg-zinc-900 text-zinc-300">
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-800 rounded px-2 py-1">
          <ArrowUpDown className="w-3.5 h-3.5 text-amber-500" />
          <label htmlFor="sort-select" className="sr-only">Trier l'équipement</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => {
              playCyberClick();
              onSortChange(e.target.value as unknown as typeof sortBy);
            }}
            className="bg-transparent text-zinc-300 focus:outline-none text-[11px]"
          >
            <option value="name-asc" className="bg-zinc-900 text-zinc-300">Nom (A-Z)</option>
            <option value="name-desc" className="bg-zinc-900 text-zinc-300">Nom (Z-A)</option>
            <option value="price-asc" className="bg-zinc-900 text-zinc-300">Prix €$ (croissant)</option>
            <option value="price-desc" className="bg-zinc-900 text-zinc-300">Prix €$ (décroissant)</option>
            <option value="rarity-desc" className="bg-zinc-900 text-zinc-300">Rareté (Légendaire d'abord)</option>
            <option value="weight-desc" className="bg-zinc-900 text-zinc-300">Poids (plus lourd d'abord)</option>
          </select>
        </div>

        {/* Reset button */}
        {(filters.query || (filters.category && filters.category !== 'all') || (filters.rarity && filters.rarity !== 'all') || (filters.manufacturer && filters.manufacturer !== 'all') || filters.onlyFavorites) && (
          <button
            onClick={() => {
              playCyberClick();
              onResetFilters();
            }}
            className="flex items-center gap-1 px-2 py-1 rounded bg-red-950/60 border border-red-700/60 text-red-300 hover:bg-red-900/60 text-[11px] transition-colors"
            title="Réinitialiser tous les filtres"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Réinitialiser</span>
          </button>
        )}

        {/* Count indicator */}
        <div className="px-2 py-1 rounded bg-zinc-900 text-zinc-400 border border-zinc-800 text-[11px]">
          <span className="text-cyan-400 font-bold">{totalFiltered}</span>
          <span className="text-zinc-600"> / </span>
          <span>{totalOverall} items</span>
        </div>
      </div>
    </div>
  );
};
