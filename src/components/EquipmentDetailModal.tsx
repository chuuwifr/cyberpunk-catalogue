import React from 'react';
import {
  X,
  Star,
  Layers,
  Dices,
  Shield,
  Zap,
  Cpu,
  Flame,
  Truck,
  Terminal,
  Activity,
  Crosshair,
  Building2,
  AlertOctagon,
  BookOpen,
  Edit3,
  Copy,
  Trash2,
  ShoppingCart,
  Coins,
  Check
} from 'lucide-react';
import { EquipmentItem, formatCurrency, getSafeImageUrl } from '../utils/gearLogic.ts';
import { generateHologramBlueprint } from '../utils/hologramSvg.ts';
import { playCyberFavorite, playCyberClick } from '../utils/audio.ts';

interface EquipmentDetailModalProps {
  item: EquipmentItem | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpenDiceWithPreset: (item: EquipmentItem) => void;
  isCompared: boolean;
  onToggleCompare: (item: EquipmentItem) => void;
  onEditEquipment?: (item: EquipmentItem) => void;
  onDeleteEquipment?: (id: string) => void;
  onDuplicateEquipment?: (item: EquipmentItem) => void;

  // Virtual Shop Props
  isShopMode?: boolean;
  playerWalletEb?: number;
  playerWalletCredits?: number;
  ownedQuantity?: number;
  onBuyItem?: (item: EquipmentItem, currency: 'eb' | 'credits') => void;
}

export const EquipmentDetailModal: React.FC<EquipmentDetailModalProps> = ({
  item,
  onClose,
  isFavorite,
  onToggleFavorite,
  onOpenDiceWithPreset,
  isCompared,
  onToggleCompare,
  onEditEquipment,
  onDeleteEquipment,
  onDuplicateEquipment,
  isShopMode = false,
  playerWalletEb = 0,
  playerWalletCredits = 0,
  ownedQuantity = 0,
  onBuyItem,
}) => {
  const [imgError, setImgError] = React.useState(false);

  React.useEffect(() => {
    setImgError(false);
  }, [item?.id]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!item) return null;

  const canAffordEb = playerWalletEb >= (item.red.priceEb || 0);
  const canAffordCredits = playerWalletCredits >= (item.iz.priceCredits || 0);

  const imageSource = !imgError && item.imageUrl
    ? getSafeImageUrl(item.imageUrl)
    : generateHologramBlueprint(item);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#0c1017] border border-cyan-500/70 rounded-lg shadow-[0_0_35px_rgba(0,240,255,0.25)] overflow-hidden font-mono text-zinc-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-zinc-950 border-b border-zinc-800">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <div className="truncate">
              <span className="text-[10px] text-cyan-400/80 uppercase tracking-widest block">
                DOSSIER TACTIQUE // {item.categoryLabel}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-zinc-100 font-['Rajdhani',sans-serif] tracking-wide truncate">
                {item.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playCyberClick();
                onToggleCompare(item);
              }}
              className={`p-2 rounded border transition-colors ${
                isCompared
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                  : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-cyan-300'
              }`}
              title={isCompared ? 'Retirer du comparateur' : 'Ajouter au comparateur'}
              aria-label="Comparer l'équipement"
            >
              <Layers className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                playCyberFavorite();
                onToggleFavorite(item.id);
              }}
              className={`p-2 rounded border transition-colors ${
                isFavorite
                  ? 'bg-amber-500/20 text-amber-400 border-amber-400'
                  : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-amber-300'
              }`}
              aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
            </button>

            <button
              onClick={() => {
                playCyberClick();
                onClose();
              }}
              className="p-2 rounded bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-red-400 hover:border-red-500 transition-colors"
              aria-label="Fermer le dossier"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-800">
          {/* Image + Quick Specs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div className="relative rounded overflow-hidden border border-zinc-800 bg-gradient-to-b from-[#080c14] to-[#04060a] h-52 flex items-center justify-center p-2">
              <img
                src={imageSource}
                alt={item.name}
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full h-full object-contain p-2 drop-shadow-[0_8px_20px_rgba(0,0,0,0.9)]"
              />
              <div className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded border border-cyan-500/30 text-[10px] text-cyan-300">
                FABRICANT: {item.manufacturer}
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-zinc-950 border border-zinc-800 p-3 rounded">
                <div className="text-xs text-zinc-400 mb-1 flex items-center justify-between">
                  <span>PRIX DU MARCHÉ</span>
                  {ownedQuantity > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-500 text-emerald-300 font-bold flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-400" />
                      POSSÉDÉ (x{ownedQuantity})
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-zinc-500 block">CYBERPUNK RED</span>
                    <span className="text-base font-bold text-amber-400">{formatCurrency(item.red.priceEb, 'eb')}</span>
                  </div>
                  <div className="h-8 w-px bg-zinc-800" />
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-500 block">MALMART 2090 (IZ)</span>
                    <span className="text-base font-bold text-cyan-400">{formatCurrency(item.iz.priceCredits, 'credits')}</span>
                  </div>
                </div>
              </div>

              {/* Virtual Shop Buy Button in Details Modal */}
              {isShopMode && onBuyItem && (
                <div className="p-3 bg-amber-950/30 border border-amber-500/50 rounded flex flex-col gap-2">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <ShoppingCart className="w-4 h-4 text-amber-400" /> ACQUÉRIR DANS LA BOUTIQUE
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        playCyberFavorite();
                        onBuyItem(item, 'eb');
                      }}
                      disabled={!canAffordEb}
                      className={`py-1.5 px-2 rounded text-xs font-bold transition-all border ${
                        canAffordEb
                          ? 'bg-amber-500 text-black border-amber-400 hover:bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-600 cursor-not-allowed'
                      }`}
                    >
                      Acheter ({formatCurrency(item.red.priceEb, 'eb')})
                    </button>
                    <button
                      onClick={() => {
                        playCyberFavorite();
                        onBuyItem(item, 'credits');
                      }}
                      disabled={!canAffordCredits}
                      className={`py-1.5 px-2 rounded text-xs font-bold transition-all border ${
                        canAffordCredits
                          ? 'bg-cyan-500 text-black border-cyan-400 hover:bg-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-600 cursor-not-allowed'
                      }`}
                    >
                      Acheter ({formatCurrency(item.iz.priceCredits, 'credits')})
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs px-2.5 py-1 rounded bg-zinc-900 border border-cyan-500/40 text-cyan-300">
                  Rareté: {item.rarityLabel}
                </span>
                <span className="text-xs px-2.5 py-1 rounded bg-zinc-900 border border-zinc-700 text-zinc-300">
                  Poids: {item.iz.weightKg} kg
                </span>
                {item.iz.cybertension !== undefined && (
                  <span className={`text-xs px-2.5 py-1 rounded border ${
                    item.iz.cybertension > 3
                      ? 'bg-red-950/60 border-red-500 text-red-300'
                      : 'bg-zinc-900 border-zinc-700 text-zinc-300'
                  }`}>
                    Cybertension: {item.iz.cybertension}
                  </span>
                )}
              </div>

              {item.flavorQuote && (
                <blockquote className="p-2.5 bg-zinc-950/80 border-l-2 border-cyan-400 rounded-r text-xs text-zinc-400 italic">
                  {item.flavorQuote}
                </blockquote>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="bg-zinc-950 border border-zinc-800/80 rounded p-4">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" /> Fiche Technique & Historique
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
              {item.description}
            </p>
          </div>

          {/* Comparison Dual Rules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* CP Red Details */}
            <div className="bg-zinc-950 border border-red-900/50 rounded p-4 space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-red-950/80">
                <span className="text-xs font-bold text-red-400 tracking-wide">SYSTÈME CYBERPUNK RED</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800/60">
                  {item.red.availability}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                {item.red.damage && (
                  <div>
                    <span className="text-zinc-500 block text-[10px]">DÉGÂTS D10</span>
                    <span className="text-zinc-100 font-bold">{item.red.damage}</span>
                  </div>
                )}
                {item.red.rof !== undefined && (
                  <div>
                    <span className="text-zinc-500 block text-[10px]">CADENCE (ROF)</span>
                    <span className="text-zinc-100 font-bold">{item.red.rof}</span>
                  </div>
                )}
                {item.red.ammo && (
                  <div>
                    <span className="text-zinc-500 block text-[10px]">MUNITIONS</span>
                    <span className="text-zinc-100">{item.red.ammo}</span>
                  </div>
                )}
                {item.red.magazine && (
                  <div>
                    <span className="text-zinc-500 block text-[10px]">CHARGEUR</span>
                    <span className="text-zinc-100">{item.red.magazine} cartouches</span>
                  </div>
                )}
                {item.red.sp !== undefined && (
                  <div>
                    <span className="text-zinc-500 block text-[10px]">BLINDAGE (SP)</span>
                    <span className="text-emerald-400 font-bold">{item.red.sp}</span>
                  </div>
                )}
                {item.red.humanityLoss && (
                  <div>
                    <span className="text-zinc-500 block text-[10px]">PERTE HUMANITÉ</span>
                    <span className="text-fuchsia-400 font-bold">{item.red.humanityLoss}</span>
                  </div>
                )}
                {item.red.installReq && (
                  <div>
                    <span className="text-zinc-500 block text-[10px]">INSTALLATION</span>
                    <span className="text-zinc-300">{item.red.installReq}</span>
                  </div>
                )}
                <div>
                  <span className="text-zinc-500 block text-[10px]">DISSIMULABLE</span>
                  <span className={item.red.concealable ? 'text-emerald-400 font-bold' : 'text-zinc-400'}>
                    {item.red.concealable ? 'Oui (Sous manteau)' : 'Non (Visible)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Interface Zero Details */}
            <div className="bg-zinc-950 border border-amber-900/50 rounded p-4 space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-amber-950/80">
                <span className="text-xs font-bold text-amber-400 tracking-wide">SAVAGE WORLDS // IZ 2.0</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/60">
                  {item.iz.quality}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                {item.iz.damage && (
                  <div>
                    <span className="text-zinc-500 block text-[10px]">DÉGÂTS SWADE</span>
                    <span className="text-amber-300 font-bold">{item.iz.damage}</span>
                  </div>
                )}
                {item.iz.range && (
                  <div>
                    <span className="text-zinc-500 block text-[10px]">PORTÉE (CASES)</span>
                    <span className="text-zinc-100">{item.iz.range}</span>
                  </div>
                )}
                {item.iz.ap !== undefined && (
                  <div>
                    <span className="text-zinc-500 block text-[10px]">PÉNÉTRATION D'ARMURE</span>
                    <span className="text-cyan-400 font-bold">PA {item.iz.ap}</span>
                  </div>
                )}
                {item.iz.armorBonus !== undefined && (
                  <div>
                    <span className="text-zinc-500 block text-[10px]">BONUS D'ARMURE</span>
                    <span className="text-emerald-400 font-bold">+{item.iz.armorBonus}</span>
                  </div>
                )}
                {item.iz.cybertension !== undefined && (
                  <div>
                    <span className="text-zinc-500 block text-[10px]">CYBERTENSION</span>
                    <span className="text-fuchsia-400 font-bold">{item.iz.cybertension} pts</span>
                  </div>
                )}
                {item.iz.firewall !== undefined && (
                  <div>
                    <span className="text-zinc-500 block text-[10px]">FIREWALL</span>
                    <span className="text-zinc-100">{item.iz.firewall}</span>
                  </div>
                )}
              </div>

              {item.iz.notes && (
                <div className="pt-2 border-t border-zinc-800/80 text-[11px] text-zinc-300">
                  <span className="text-zinc-500 font-bold block text-[10px]">RÈGLES SPÉCIALES :</span>
                  {item.iz.notes}
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="flex items-center gap-1.5 flex-wrap pt-2">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest mr-1">TAGS TACTIQUES:</span>
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 bg-zinc-950 border-t border-zinc-800">
          <div className="flex items-center gap-2">
            {item.isCustom ? (
              <>
                {onEditEquipment && (
                  <button
                    onClick={() => {
                      playCyberClick();
                      onEditEquipment(item);
                      onClose();
                    }}
                    className="px-3 py-2 rounded text-xs border font-bold bg-amber-950/40 border-amber-500 text-amber-300 hover:bg-amber-900/50 flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Modifier / Changer Photo</span>
                  </button>
                )}
                {onDeleteEquipment && (
                  <button
                    onClick={() => {
                      if (window.confirm(`Supprimer définitivement "${item.name}" ?`)) {
                        playCyberClick();
                        onDeleteEquipment(item.id);
                        onClose();
                      }
                    }}
                    className="px-3 py-2 rounded text-xs border font-bold bg-red-950/30 border-red-800/60 text-red-400 hover:bg-red-900/40 hover:border-red-600 flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Supprimer</span>
                  </button>
                )}
              </>
            ) : (
              onDuplicateEquipment && (
                <button
                  onClick={() => {
                    playCyberClick();
                    onDuplicateEquipment(item);
                    onClose();
                  }}
                  className="px-3 py-2 rounded text-xs border font-bold bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-cyan-400 hover:text-cyan-300 flex items-center gap-1.5"
                  title="Créer une variante personnalisée avec vos propres stats et photos"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Personnaliser / Cloner</span>
                </button>
              )
            )}
          </div>

          {(item.red.damage || item.iz.damage) && (
            <button
              onClick={() => {
                playCyberClick();
                onOpenDiceWithPreset(item);
              }}
              className="px-4 py-2 rounded text-xs font-bold bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white border border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)] flex items-center gap-2 transition-all ml-auto"
            >
              <Dices className="w-4 h-4" />
              <span>Simuler le Tir / Dégâts</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
