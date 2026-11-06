import React, { useState } from 'react';
import {
  Star,
  Layers,
  ExternalLink,
  Shield,
  Crosshair,
  Zap,
  Activity,
  Cpu,
  Flame,
  Truck,
  Terminal,
  Sword,
  AlertTriangle,
  Edit3,
  Trash2,
  Eye,
  Sparkles,
  Sliders,
  ShoppingCart,
  Check,
  Coins
} from 'lucide-react';
import { EquipmentItem, formatCurrency, getItemPriceEb, getSafeImageUrl } from '../utils/gearLogic.ts';
import { generateHologramBlueprint } from '../utils/hologramSvg.ts';
import { playCyberFavorite, playCyberClick } from '../utils/audio.ts';

interface EquipmentCardProps {
  item: EquipmentItem;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  isCompared: boolean;
  onToggleCompare: (item: EquipmentItem) => void;
  onSelectDetails: (item: EquipmentItem) => void;
  onEditCustom?: (item: EquipmentItem) => void;
  onDeleteCustom?: (id: string) => void;

  // Virtual Shop Mode Props
  isShopMode?: boolean;
  playerWalletEb?: number;
  ownedQuantity?: number;
  onBuyItem?: (item: EquipmentItem, currency: 'eb' | 'credits') => void;
}

export const EquipmentCard: React.FC<EquipmentCardProps> = ({
  item,
  isFavorite,
  onToggleFavorite,
  isCompared,
  onToggleCompare,
  onSelectDetails,
  onEditCustom,
  onDeleteCustom,
  isShopMode = false,
  playerWalletEb = 0,
  ownedQuantity = 0,
  onBuyItem,
}) => {
  const [imgError, setImgError] = useState(false);
  const itemPriceEb = getItemPriceEb(item);
  const canAffordEb = playerWalletEb >= itemPriceEb;

  const getRarityStyles = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return {
          border: 'border-emerald-500/40 hover:border-emerald-400',
          badge: 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300',
          glow: 'group-hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]',
          accent: 'text-emerald-400',
        };
      case 'uncommon':
        return {
          border: 'border-sky-500/40 hover:border-sky-400',
          badge: 'bg-sky-950/80 border-sky-500/60 text-sky-300',
          glow: 'group-hover:shadow-[0_0_20px_rgba(14,165,233,0.15)]',
          accent: 'text-sky-400',
        };
      case 'rare':
        return {
          border: 'border-violet-500/40 hover:border-violet-400',
          badge: 'bg-violet-950/80 border-violet-500/60 text-violet-300',
          glow: 'group-hover:shadow-[0_0_20px_rgba(139,92,246,0.18)]',
          accent: 'text-violet-400',
        };
      case 'very_rare':
        return {
          border: 'border-amber-500/50 hover:border-amber-400',
          badge: 'bg-amber-950/80 border-amber-500/60 text-amber-300',
          glow: 'group-hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]',
          accent: 'text-amber-400',
        };
      case 'legendary':
      default:
        return {
          border: 'border-fuchsia-500/60 hover:border-fuchsia-400',
          badge: 'bg-gradient-to-r from-fuchsia-950 to-pink-950 border-fuchsia-500 text-fuchsia-200',
          glow: 'group-hover:shadow-[0_0_25px_rgba(217,70,239,0.25)]',
          accent: 'text-fuchsia-400',
        };
    }
  };

  const styles = getRarityStyles(item.rarity);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Crosshair':
        return <Crosshair className="w-5 h-5" />;
      case 'Shield':
        return <Shield className="w-5 h-5" />;
      case 'Zap':
        return <Zap className="w-5 h-5" />;
      case 'Flame':
        return <Flame className="w-5 h-5" />;
      case 'Sword':
        return <Sword className="w-5 h-5" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5" />;
      case 'Truck':
        return <Truck className="w-5 h-5" />;
      case 'Terminal':
        return <Terminal className="w-5 h-5" />;
      case 'Eye':
        return <Eye className="w-5 h-5" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5" />;
      case 'Sliders':
        return <Sliders className="w-5 h-5" />;
      case 'Activity':
      default:
        return <Activity className="w-5 h-5" />;
    }
  };

  // Guaranteed image source: if error or missing, procedural holographic SVG is used
  const imageSource = !imgError && item.imageUrl
    ? getSafeImageUrl(item.imageUrl)
    : generateHologramBlueprint(item);

  return (
    <article
      className={`group relative flex flex-col bg-[#0b0f19] border ${styles.border} rounded-sm overflow-hidden transition-all duration-200 ${styles.glow} font-mono`}
    >
      {/* Cyber Corner Decos */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-400 pointer-events-none" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-400 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-400 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-400 pointer-events-none" />

      {/* Header bar */}
      <div className="p-3 pb-2 border-b border-zinc-800/80 bg-zinc-950/60 flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap mb-1">
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase ${styles.badge}`}>
              {item.rarityLabel}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
              {item.categoryLabel}
            </span>
            {item.isCustom && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-400/80 text-amber-300 font-bold">
                ★ CRÉÉ
              </span>
            )}
            {isShopMode && ownedQuantity > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-500 text-emerald-300 font-bold flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-400" />
                POSSÉDÉ (x{ownedQuantity})
              </span>
            )}
          </div>
          <h2 className="text-sm md:text-base font-bold text-zinc-100 font-['Rajdhani',sans-serif] tracking-wide truncate group-hover:text-cyan-300 transition-colors">
            {item.name}
          </h2>
          <div className="text-[11px] text-zinc-400 truncate flex items-center gap-1 mt-0.5">
            <span className="text-cyan-400/90 font-semibold">{item.manufacturer}</span>
            <span className="text-zinc-600">•</span>
            <span className="text-[10px] text-zinc-500">{item.origin}</span>
          </div>
        </div>

        {/* Favorite button */}
        <button
          onClick={() => {
            playCyberFavorite();
            onToggleFavorite(item.id);
          }}
          aria-label={isFavorite ? `Retirer ${item.name} des favoris` : `Ajouter ${item.name} aux favoris`}
          className={`p-1.5 rounded transition-all ${
            isFavorite
              ? 'bg-amber-500/20 text-amber-400 border border-amber-400/60 shadow-[0_0_8px_rgba(245,158,11,0.3)]'
              : 'text-zinc-500 hover:text-amber-400 hover:bg-zinc-900 border border-transparent'
          }`}
          title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
        </button>
      </div>

      {/* Visual / Image area */}
      <div className="relative h-44 bg-gradient-to-b from-zinc-950 via-[#0d121d] to-[#0b0f19] overflow-hidden flex items-center justify-center border-b border-zinc-800/80">
        <img
          src={imageSource}
          alt={item.name}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="w-full h-full object-contain p-2 opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300 drop-shadow-[0_6px_16px_rgba(0,0,0,0.85)]"
          loading="lazy"
        />

        {/* Tactical watermark tag */}
        <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded border border-cyan-500/30 text-[10px] text-cyan-300 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span>SPEC // 2077-2090</span>
        </div>

        {/* Quick price tag */}
        <div className="absolute bottom-2 right-2 bg-black/85 backdrop-blur-sm px-2.5 py-1 rounded border border-amber-500/40 text-right">
          <div className="text-xs font-bold text-amber-300">{formatCurrency(itemPriceEb)}</div>
        </div>
      </div>

      {/* Description Snippet */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed mb-3">
          {item.description}
        </p>

        {/* SWADE // INTERFACE ZÉRO Stats Block */}
        <div className="space-y-2 mb-3">
          <div className="bg-zinc-950/90 border border-amber-900/40 rounded p-2.5 text-[11px]">
            <div className="flex items-center justify-between text-amber-400 font-bold border-b border-amber-950/60 pb-1 mb-1.5">
              <span>SWADE // INTERFACE ZÉRO</span>
              <span className="text-[10px] text-zinc-400 px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800">{item.iz.quality}</span>
            </div>
            <div className="space-y-1 text-zinc-300">
              <div className="flex items-center justify-between">
                {item.iz.damage ? (
                  <span><strong className="text-amber-300">Dégâts:</strong> {item.iz.damage}</span>
                ) : (
                  <span className="text-zinc-500">Non-létal / Utilitaire</span>
                )}
                {item.iz.range && (
                  <span><strong className="text-zinc-400">Portée:</strong> {item.iz.range}</span>
                )}
              </div>
              <div className="flex items-center justify-between text-[10px]">
                {item.iz.ap ? <span><strong className="text-orange-400">PA (Armure):</strong> PA {item.iz.ap}</span> : <span><strong className="text-zinc-500">Poids:</strong> {item.iz.weightKg} kg</span>}
                {item.iz.cybertension !== undefined && item.iz.cybertension > 0 && (
                  <span>
                    <strong className="text-fuchsia-400">Cybertension:</strong>{' '}
                    {item.iz.cybertension} pts
                  </span>
                )}
                {item.iz.armorBonus !== undefined && item.iz.armorBonus > 0 && (
                  <span className="text-emerald-400 font-bold">
                    +{item.iz.armorBonus} Armure
                  </span>
                )}
              </div>
              <div className="text-[10px] text-zinc-400 line-clamp-1 italic pt-0.5 border-t border-zinc-900">
                Notes: {item.iz.notes}
              </div>
            </div>
          </div>
        </div>

        {/* VIRTUAL SHOP BUY BAR (If Shop Mode is active) */}
        {isShopMode && onBuyItem && (
          <div className="mb-2.5 p-2 bg-gradient-to-r from-amber-950/40 via-zinc-950 to-cyan-950/40 border border-amber-500/50 rounded flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[10px] font-bold">
              <span className="text-amber-400 flex items-center gap-1">
                <ShoppingCart className="w-3.5 h-3.5" /> BOUTIQUE VIRTUELLE
              </span>
              <span className="text-amber-300">{formatCurrency(itemPriceEb)}</span>
            </div>
            <button
              onClick={() => {
                playCyberFavorite();
                onBuyItem(item, 'eb');
              }}
              disabled={!canAffordEb}
              className={`w-full py-1.5 px-2 rounded text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 border ${
                canAffordEb
                  ? 'bg-amber-500 text-black border-amber-400 hover:bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.25)] cursor-pointer'
                  : 'bg-zinc-900/60 border-zinc-800 text-zinc-600 cursor-not-allowed'
              }`}
              title={canAffordEb ? `Acheter pour ${formatCurrency(itemPriceEb)}` : 'Fonds en Eurodollars insuffisants'}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Acheter ({formatCurrency(itemPriceEb)})</span>
            </button>
          </div>
        )}

        {/* Card action buttons */}
        <div className="pt-2 mt-auto border-t border-zinc-800/80 flex items-center justify-between gap-2">
          {item.isCustom && onEditCustom && (
            <button
              onClick={() => {
                playCyberClick();
                onEditCustom(item);
              }}
              aria-label={`Modifier ${item.name} ou changer sa photo`}
              className="py-1.5 px-2 rounded text-[11px] font-mono border bg-amber-950/40 border-amber-500/50 text-amber-300 hover:bg-amber-900/50 hover:border-amber-400 transition-all flex items-center justify-center gap-1"
              title="Modifier les statistiques ou la photo"
            >
              <Edit3 className="w-3 h-3" />
              <span>Éditer</span>
            </button>
          )}

          {/* Compare Button */}
          <button
            onClick={() => {
              playCyberClick();
              onToggleCompare(item);
            }}
            aria-pressed={isCompared}
            aria-label={isCompared ? `Retirer ${item.name} du comparateur` : `Comparer ${item.name}`}
            className={`flex-1 py-1.5 px-2 rounded text-[11px] font-mono border transition-all flex items-center justify-center gap-1 ${
              isCompared
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold shadow-[0_0_8px_rgba(0,240,255,0.25)]'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>{isCompared ? 'Retirer' : 'Comparer'}</span>
          </button>

          {/* Details Button */}
          <button
            onClick={() => {
              playCyberClick();
              onSelectDetails(item);
            }}
            aria-label={`Détails pour ${item.name}`}
            className="flex-1 py-1.5 px-2 rounded text-[11px] font-mono font-bold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-black border border-cyan-400 transition-all flex items-center justify-center gap-1 shadow-[0_0_10px_rgba(0,240,255,0.2)]"
          >
            <span>Fiche Détaillée</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </article>
  );
};
