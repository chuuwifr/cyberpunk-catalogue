import React from 'react';
import {
  Crosshair,
  Shield,
  Cpu,
  Sword,
  Flame,
  Truck,
  Terminal,
  Activity,
  Layers,
  Zap,
  Sliders
} from 'lucide-react';
import { GearCategory, EquipmentItem } from '../utils/gearLogic.ts';
import { playCyberClick } from '../utils/audio.ts';

interface CategoryFiltersProps {
  selectedCategory: GearCategory;
  onSelectCategory: (cat: GearCategory) => void;
  items: EquipmentItem[];
}

interface CategoryDef {
  key: GearCategory;
  label: string;
  icon: React.ElementType;
}

const CATEGORIES: CategoryDef[] = [
  { key: 'all', label: 'Tout le Matériel', icon: Layers },
  { key: 'handguns', label: 'Armes de poing', icon: Crosshair },
  { key: 'longarms', label: 'Fusils & Mitraillettes', icon: Zap },
  { key: 'heavy', label: 'Armes Lourdes & Exotiques', icon: Flame },
  { key: 'melee', label: 'Mêlée & Cyber-lames', icon: Sword },
  { key: 'weapon_mods', label: 'Accessoires & Mods', icon: Sliders },
  { key: 'cyberware', label: 'Cybermatériel & Implants', icon: Cpu },
  { key: 'armor', label: 'Armures & Protections', icon: Shield },
  { key: 'drones_vehicles', label: 'Drones & Véhicules', icon: Truck },
  { key: 'gear_tap', label: 'Netrunning & T-APP', icon: Terminal },
  { key: 'pharma', label: 'Drogues & Soins', icon: Activity },
];

export const CategoryFilters: React.FC<CategoryFiltersProps> = ({
  selectedCategory,
  onSelectCategory,
  items,
}) => {
  // Count items per category
  const counts = React.useMemo(() => {
    const map: Record<string, number> = { all: items.length };
    for (const item of items) {
      map[item.category] = (map[item.category] || 0) + 1;
    }
    return map;
  }, [items]);

  return (
    <div className="w-full bg-[#0d111a] border-b border-cyan-900/40 py-2.5 px-4 overflow-x-auto scrollbar-thin scrollbar-thumb-cyan-800">
      <div className="max-w-7xl mx-auto flex items-center gap-1.5 min-w-max">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.key;
          const Icon = cat.icon;
          const count = counts[cat.key] || 0;

          return (
            <button
              key={cat.key}
              onClick={() => {
                playCyberClick();
                onSelectCategory(cat.key);
              }}
              aria-pressed={isSelected}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-sm text-xs font-mono font-medium transition-all ${
                isSelected
                  ? 'bg-gradient-to-r from-cyan-950 to-blue-950 border border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                  : 'bg-zinc-950/70 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-zinc-500'}`} />
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-zinc-900 text-zinc-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
