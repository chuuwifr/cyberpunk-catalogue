import React, { useState } from 'react';
import {
  X,
  Trash2,
  Copy,
  Check,
  Star,
  Download,
  AlertTriangle,
  Scale,
  Coins,
  Cpu,
  HeartCrack,
  ExternalLink
} from 'lucide-react';
import { EquipmentItem, calculateLoadoutSummary, formatCurrency, getSafeImageUrl } from '../utils/gearLogic.ts';
import { playCyberClick } from '../utils/audio.ts';
import { useEscapeKey } from '../utils/useEscapeKey.ts';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: EquipmentItem[];
  onRemoveFavorite: (id: string) => void;
  onClearAll: () => void;
  onSelectDetails: (item: EquipmentItem) => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  favorites,
  onRemoveFavorite,
  onClearAll,
  onSelectDetails,
}) => {
  const [copied, setCopied] = useState(false);

  useEscapeKey(isOpen, onClose);

  if (!isOpen) return null;

  const summary = calculateLoadoutSummary(favorites);

  const handleCopyLoadout = () => {
    playCyberClick();
    const text = [
      '==========================================',
      ' FICHE DE MATÉRIEL // CYBERPUNK & INTERFACE ZÉRO',
      '==========================================',
      `Éléments équipés: ${summary.totalItems}`,
      `Poids Total: ${summary.totalWeightKg.toFixed(1)} kg`,
      `Coût Total Cyberpunk RED: ${formatCurrency(summary.totalPriceEb, 'eb')}`,
      `Coût Total Interface Zéro: ${formatCurrency(summary.totalPriceCredits, 'credits')}`,
      `Cybertension Totale: ${summary.totalCybertension} pts`,
      `Perte d'Humanité Max: ${summary.estimatedHumanityLossMax} PH`,
      '------------------------------------------',
      ...favorites.map(
        (f, i) =>
          `${i + 1}. ${f.name} [${f.categoryLabel}] - ${formatCurrency(f.red.priceEb, 'eb')} / ${formatCurrency(f.iz.priceCredits, 'credits')} | Poids: ${f.iz.weightKg}kg`
      ),
      '==========================================',
    ].join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Gestionnaire de Favoris & Paquetage"
      className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl h-full bg-[#0a0d16] border-l border-amber-500/40 shadow-2xl flex flex-col font-mono text-zinc-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-[#050810] border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <div>
              <h2 className="text-base font-bold font-['Orbitron',sans-serif] text-zinc-100">
                FAVORIS &amp; PAQUETAGE JOUEUR
              </h2>
              <span className="text-[10px] text-amber-400">
                {favorites.length} équipement{favorites.length > 1 ? 's' : ''} en mémoire
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              playCyberClick();
              onClose();
            }}
            className="p-1.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white"
            aria-label="Fermer le tiroir favoris"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Loadout Summary Dashboard */}
        <div className="p-4 bg-zinc-950/80 border-b border-zinc-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="bg-[#0e121d] border border-cyan-900/50 p-2.5 rounded">
            <div className="flex items-center gap-1 text-zinc-400 text-[10px] mb-1">
              <Scale className="w-3 h-3 text-cyan-400" />
              POIDS TOTAL
            </div>
            <div className="text-sm font-bold text-cyan-300">
              {summary.totalWeightKg.toFixed(1)} kg
            </div>
          </div>

          <div className="bg-[#0e121d] border border-amber-900/50 p-2.5 rounded">
            <div className="flex items-center gap-1 text-zinc-400 text-[10px] mb-1">
              <Coins className="w-3 h-3 text-amber-400" />
              BUDGET RED
            </div>
            <div className="text-sm font-bold text-amber-300 truncate">
              {formatCurrency(summary.totalPriceEb, 'eb')}
            </div>
          </div>

          <div className="bg-[#0e121d] border border-emerald-900/50 p-2.5 rounded">
            <div className="flex items-center gap-1 text-zinc-400 text-[10px] mb-1">
              <Coins className="w-3 h-3 text-emerald-400" />
              BUDGET IZ 2.0
            </div>
            <div className="text-sm font-bold text-emerald-300 truncate">
              {formatCurrency(summary.totalPriceCredits, 'credits')}
            </div>
          </div>

          <div className="bg-[#0e121d] border border-purple-900/50 p-2.5 rounded">
            <div className="flex items-center gap-1 text-zinc-400 text-[10px] mb-1">
              <Cpu className="w-3 h-3 text-purple-400" />
              CYBERTENSION
            </div>
            <div className={`text-sm font-bold ${summary.totalCybertension > 5 ? 'text-red-400' : 'text-purple-300'}`}>
              {summary.totalCybertension} pts
            </div>
          </div>
        </div>

        {/* Warning if High Cybertension */}
        {summary.totalCybertension > 5 && (
          <div className="mx-4 mt-3 p-2.5 bg-red-950/60 border border-red-500/50 rounded flex items-center gap-2 text-xs text-red-300">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>
              <strong>Alerte Cybertrauma:</strong> Cybertension cumulée supérieure à 5. Risque élevé de fatigue chronique et rejet d’implants.
            </span>
          </div>
        )}

        {/* Items List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-2.5 scrollbar-thin scrollbar-thumb-amber-800">
          {favorites.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center text-zinc-500">
              <Star className="w-12 h-12 stroke-[1] mb-2 text-zinc-700" />
              <p className="text-sm font-semibold text-zinc-400">Aucun équipement en favori</p>
              <p className="text-xs text-zinc-600 mt-1 max-w-xs">
                Cliquez sur l'étoile d'un équipement dans le catalogue pour l'ajouter à votre paquetage personnalisé.
              </p>
            </div>
          ) : (
            favorites.map((item) => (
              <FavoriteItemRow
                key={item.id}
                item={item}
                onSelectDetails={onSelectDetails}
                onRemoveFavorite={onRemoveFavorite}
              />
            ))
          )}
        </div>

        {/* Footer Actions */}
        {favorites.length > 0 && (
          <div className="p-4 bg-[#050810] border-t border-zinc-800 flex flex-wrap items-center justify-between gap-2.5">
            <button
              onClick={() => {
                playCyberClick();
                onClearAll();
              }}
              className="px-3 py-2 rounded text-xs text-red-400 hover:bg-red-950/40 border border-red-900/40 transition-colors"
            >
              Vider tout
            </button>

            <div className="flex items-center gap-2 flex-1 justify-end">
              <button
                onClick={() => {
                  playCyberClick();
                  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(favorites, null, 2));
                  const downloadAnchor = document.createElement('a');
                  downloadAnchor.setAttribute('href', dataStr);
                  downloadAnchor.setAttribute('download', `paquetage_cyberpunk_${Date.now()}.json`);
                  document.body.appendChild(downloadAnchor);
                  downloadAnchor.click();
                  downloadAnchor.remove();
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded text-xs bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 transition-colors"
                title="Exporter sous format JSON (VTT, Foundry, etc.)"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">JSON</span>
              </button>

              <button
                onClick={handleCopyLoadout}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black border border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)] transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-black" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copié !' : 'Copier Paquetage PJ'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface FavoriteItemRowProps {
  item: EquipmentItem;
  onSelectDetails: (item: EquipmentItem) => void;
  onRemoveFavorite: (id: string) => void;
}

const FavoriteItemRow: React.FC<FavoriteItemRowProps> = ({
  item,
  onSelectDetails,
  onRemoveFavorite,
}) => {
  const [imgErr, setImgErr] = useState(false);

  return (
    <div className="bg-zinc-950 border border-zinc-800 hover:border-amber-400/50 p-3 rounded flex items-center justify-between gap-3 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded bg-[#0e121d] border border-zinc-800 overflow-hidden shrink-0 flex items-center justify-center">
          {!imgErr && item.imageUrl ? (
            <img
              src={getSafeImageUrl(item.imageUrl)}
              alt={item.name}
              referrerPolicy="no-referrer"
              onError={() => setImgErr(true)}
              className="w-full h-full object-contain p-0.5"
            />
          ) : (
            <Star className="w-4 h-4 text-amber-400" />
          )}
        </div>
        <div className="min-w-0">
          <button
            onClick={() => onSelectDetails(item)}
            className="text-sm font-bold text-zinc-100 hover:text-cyan-300 text-left truncate block"
          >
            {item.name}
          </button>
          <div className="text-[11px] text-zinc-400 flex items-center gap-2 mt-0.5">
            <span className="text-amber-400">{formatCurrency(item.red.priceEb, 'eb')}</span>
            <span>•</span>
            <span>{item.iz.weightKg} kg</span>
            {item.iz.cybertension !== undefined && item.iz.cybertension > 0 ? (
              <>
                <span>•</span>
                <span className="text-purple-400">{item.iz.cybertension} CT</span>
              </>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={() => {
            playCyberClick();
            onSelectDetails(item);
          }}
          className="p-1.5 text-zinc-400 hover:text-cyan-300 rounded hover:bg-zinc-900"
          title="Voir la fiche"
          aria-label={`Voir la fiche de ${item.name}`}
        >
          <ExternalLink className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            playCyberClick();
            onRemoveFavorite(item.id);
          }}
          className="p-1.5 text-zinc-500 hover:text-red-400 rounded hover:bg-zinc-900"
          title="Retirer du paquetage"
          aria-label={`Retirer ${item.name} du paquetage`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
