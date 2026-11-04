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
  Trash2
} from 'lucide-react';
import { EquipmentItem, formatCurrency, getSafeImageUrl } from '../utils/gearLogic.ts';
import { playCyberFavorite, playCyberClick } from '../utils/audio.ts';
import { useEscapeKey } from '../utils/useEscapeKey.ts';

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
}) => {
  const [imgError, setImgError] = React.useState(false);

  React.useEffect(() => {
    setImgError(false);
  }, [item?.id]);

  useEscapeKey(Boolean(item), onClose);

  if (!item) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl my-8 bg-[#0a0d16] border border-cyan-500/60 rounded shadow-[0_0_50px_rgba(0,240,255,0.2)] text-zinc-200 font-mono overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Holographic Header Bar */}
        <div className="bg-[#050810] border-b border-cyan-500/40 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
              <Zap className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest block">
                DOSSIER TECHNIQUE // {item.origin}
              </span>
              <h2 id="detail-modal-title" className="text-xl font-bold font-['Orbitron',sans-serif] text-zinc-100">
                {item.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
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
        <div className="p-4 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-800">
          {/* Image + Quick Specs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div className="relative rounded overflow-hidden border border-zinc-800 bg-gradient-to-b from-[#080c14] to-[#04060a] h-52 flex items-center justify-center p-2">
              {!imgError && item.imageUrl ? (
                <img
                  src={getSafeImageUrl(item.imageUrl)}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-contain p-2 drop-shadow-[0_8px_20px_rgba(0,0,0,0.9)]"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-zinc-600 gap-2 p-4 text-center">
                  <div className="w-12 h-12 rounded border border-cyan-800/40 bg-cyan-950/30 flex items-center justify-center text-cyan-400/70">
                    <Crosshair className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] tracking-widest uppercase text-zinc-500">SCHÉMA HOLOGRAMME ACTIF</span>
                </div>
              )}
              <div className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded border border-cyan-500/30 text-[10px] text-cyan-300">
                FABRICANT: {item.manufacturer}
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-zinc-950 border border-zinc-800 p-3 rounded">
                <div className="text-xs text-zinc-400 mb-1">PRIX DU MARCHÉ</div>
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
              <BookOpen className="w-3.5 h-3.5" />
              Description &amp; Historique
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Dual Rules Tables: RED vs Interface Zero */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cyberpunk RED */}
            <div className="bg-gradient-to-b from-[#140b0f] to-zinc-950 border border-red-500/40 rounded p-4">
              <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider pb-2 border-b border-red-950 flex items-center justify-between">
                <span>Règles Cyberpunk RED</span>
                <span className="text-[10px] text-zinc-400">{item.red.availability}</span>
              </h3>
              <dl className="mt-3 space-y-2 text-xs">
                {item.red.damage && (
                  <div className="flex justify-between border-b border-zinc-900 pb-1">
                    <dt className="text-zinc-500">Dégâts RED:</dt>
                    <dd className="font-bold text-red-300">{item.red.damage}</dd>
                  </div>
                )}
                {item.red.rof !== undefined && (
                  <div className="flex justify-between border-b border-zinc-900 pb-1">
                    <dt className="text-zinc-500">Cadence de tir (ROF):</dt>
                    <dd className="text-zinc-200">{item.red.rof} coup/tour</dd>
                  </div>
                )}
                {item.red.magazine && (
                  <div className="flex justify-between border-b border-zinc-900 pb-1">
                    <dt className="text-zinc-500">Capacité chargeur:</dt>
                    <dd className="text-zinc-200">{item.red.magazine} cartouches</dd>
                  </div>
                )}
                {item.red.ammo && (
                  <div className="flex justify-between border-b border-zinc-900 pb-1">
                    <dt className="text-zinc-500">Type de Munitions:</dt>
                    <dd className="text-zinc-200">{item.red.ammo}</dd>
                  </div>
                )}
                {item.red.sp !== undefined && (
                  <div className="flex justify-between border-b border-zinc-900 pb-1">
                    <dt className="text-zinc-500">Stopping Power (SP):</dt>
                    <dd className="text-emerald-300 font-bold">SP {item.red.sp}</dd>
                  </div>
                )}
                {item.red.humanityLoss && (
                  <div className="flex justify-between border-b border-zinc-900 pb-1">
                    <dt className="text-zinc-500">Perte d'Humanité (PH):</dt>
                    <dd className="text-fuchsia-400 font-bold">{item.red.humanityLoss}</dd>
                  </div>
                )}
                <div className="flex justify-between border-b border-zinc-900 pb-1">
                  <dt className="text-zinc-500">Dissimulable:</dt>
                  <dd className={item.red.concealable ? 'text-emerald-400' : 'text-zinc-400'}>
                    {item.red.concealable ? 'Oui (Sous veste)' : 'Non (Visible)'}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Interface Zéro 2.0 / SWADE */}
            <div className="bg-gradient-to-b from-[#14120a] to-zinc-950 border border-amber-500/40 rounded p-4">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider pb-2 border-b border-amber-950 flex items-center justify-between">
                <span>Règles SWADE &amp; Interface Zéro</span>
                <span className="text-[10px] text-zinc-400">{item.iz.quality}</span>
              </h3>
              <dl className="mt-3 space-y-2 text-xs">
                {item.iz.damage && (
                  <div className="flex justify-between border-b border-zinc-900 pb-1">
                    <dt className="text-zinc-500">Dégâts SWADE:</dt>
                    <dd className="font-bold text-amber-300">{item.iz.damage}</dd>
                  </div>
                )}
                {item.iz.ap !== undefined && (
                  <div className="flex justify-between border-b border-zinc-900 pb-1">
                    <dt className="text-zinc-500">Pénétration d'Armure (PA):</dt>
                    <dd className="text-orange-300 font-bold">PA {item.iz.ap}</dd>
                  </div>
                )}
                {item.iz.range && (
                  <div className="flex justify-between border-b border-zinc-900 pb-1">
                    <dt className="text-zinc-500">Portée (cases):</dt>
                    <dd className="text-zinc-200">{item.iz.range}</dd>
                  </div>
                )}
                {item.iz.armorBonus !== undefined && (
                  <div className="flex justify-between border-b border-zinc-900 pb-1">
                    <dt className="text-zinc-500">Bonus d'Armure SWADE:</dt>
                    <dd className="text-emerald-400 font-bold">+{item.iz.armorBonus}</dd>
                  </div>
                )}
                {item.iz.cybertension !== undefined && (
                  <div className="flex justify-between border-b border-zinc-900 pb-1">
                    <dt className="text-zinc-500">Cybertension (Vigueur):</dt>
                    <dd className="text-cyan-300 font-bold">{item.iz.cybertension} pts</dd>
                  </div>
                )}
                {item.iz.firewall !== undefined && (
                  <div className="flex justify-between border-b border-zinc-900 pb-1">
                    <dt className="text-zinc-500">Niveau de Firewall:</dt>
                    <dd className="text-purple-300 font-bold">{item.iz.firewall}</dd>
                  </div>
                )}
                <div className="pt-1">
                  <dt className="text-zinc-500 text-[10px]">Notes de règles SWADE:</dt>
                  <dd className="text-zinc-300 text-xs mt-0.5">{item.iz.notes}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Tabletop Conversion Guide Note */}
          <div className="p-3 bg-zinc-950/90 border border-cyan-800/50 rounded flex items-start gap-3 text-xs text-zinc-400">
            <AlertOctagon className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-cyan-300 block mb-0.5">Adaptation pour SWADE (Savage Worlds Adventure Edition)</strong>
              Cet équipement tiré du canon Cyberpunk est entièrement calibré pour les règles de <strong>SWADE</strong> : les portées sont converties en cases sur plan de jeu (1 case = 2 mètres), les valeurs de dégâts exploitent les dés explosifs (As sur le dé max), la pénétration d'armure (PA) réduit la valeur d'armure de la cible, et les armes automatiques appliquent le malus de recul de -2 sauf stabilisation.
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-[#050810] border-t border-zinc-800 p-4 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                playCyberClick();
                onToggleCompare(item);
              }}
              className={`px-3 py-2 rounded text-xs border font-bold transition-colors flex items-center gap-1.5 ${
                isCompared
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                  : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:text-cyan-300'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{isCompared ? 'Retirer' : 'Comparer'}</span>
            </button>

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
