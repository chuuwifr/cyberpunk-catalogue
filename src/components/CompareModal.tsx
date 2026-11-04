import React from 'react';
import { X, Layers, Shield, Zap, Cpu, Scale, Coins, AlertCircle } from 'lucide-react';
import { EquipmentItem, formatCurrency, getSafeImageUrl } from '../utils/gearLogic.ts';
import { playCyberClick } from '../utils/audio.ts';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  comparedItems: EquipmentItem[];
  onRemoveFromCompare: (id: string) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  comparedItems,
  onRemoveFromCompare,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Comparateur d'équipement Cyberpunk"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#0a0d16] border border-cyan-500/60 rounded shadow-[0_0_50px_rgba(0,240,255,0.2)] text-zinc-200 font-mono flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#050810] border-b border-cyan-500/40 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold font-['Orbitron',sans-serif] text-zinc-100">
              MODULE DE COMPARAISON TACTIQUE
            </h2>
          </div>
          <button
            onClick={() => {
              playCyberClick();
              onClose();
            }}
            className="p-1.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white"
            aria-label="Fermer le comparateur"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {comparedItems.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center text-zinc-500">
              <Layers className="w-12 h-12 stroke-[1] mb-2 text-zinc-700" />
              <p className="text-sm font-semibold text-zinc-400">Aucun matériel à comparer</p>
              <p className="text-xs text-zinc-600 mt-1 max-w-xs">
                Cliquez sur le bouton "Comparer" sur deux cartes du catalogue pour juxtaposer leurs statistiques.
              </p>
            </div>
          ) : comparedItems.length === 1 ? (
            <div className="text-center p-4 bg-zinc-950 border border-zinc-800 rounded">
              <p className="text-xs text-cyan-400">
                1 seul équipement sélectionné : <strong>{comparedItems[0].name}</strong>.
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                Sélectionnez un second équipement dans le catalogue pour lancer l’analyse comparative.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {comparedItems.map((item) => (
                <div key={item.id} className="bg-zinc-950 border border-cyan-900/50 rounded p-4 relative flex flex-col justify-between">
                  <button
                    onClick={() => onRemoveFromCompare(item.id)}
                    className="absolute top-2 right-2 text-zinc-500 hover:text-red-400 p-1"
                    title="Retirer de la comparaison"
                    aria-label={`Retirer ${item.name} de la comparaison`}
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div>
                    {item.imageUrl && (
                      <div className="h-28 rounded bg-[#070b12] border border-zinc-800/80 mb-3 flex items-center justify-center p-2 overflow-hidden">
                        <img
                          src={getSafeImageUrl(item.imageUrl)}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
                        />
                      </div>
                    )}
                    <div className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                      {item.manufacturer}
                    </div>
                    <h3 className="text-base font-bold text-zinc-100 font-['Rajdhani',sans-serif] mt-0.5">
                      {item.name}
                    </h3>
                    <div className="text-[11px] text-zinc-400 mt-1 flex items-center gap-1.5 flex-wrap">
                      <span className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-[10px]">
                        {item.categoryLabel}
                      </span>
                      <span className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-[10px] text-cyan-300">
                        {item.rarityLabel}
                      </span>
                    </div>

                    {/* Compare Specs List */}
                    <dl className="mt-4 space-y-2 text-xs divide-y divide-zinc-900">
                      <div className="pt-2 flex justify-between">
                        <dt className="text-zinc-500">Prix Cyberpunk RED:</dt>
                        <dd className="font-bold text-amber-400">{formatCurrency(item.red.priceEb, 'eb')}</dd>
                      </div>
                      <div className="pt-2 flex justify-between">
                        <dt className="text-zinc-500">Prix Interface Zéro:</dt>
                        <dd className="font-bold text-cyan-400">{formatCurrency(item.iz.priceCredits, 'credits')}</dd>
                      </div>
                      <div className="pt-2 flex justify-between">
                        <dt className="text-zinc-500">Poids:</dt>
                        <dd className="text-zinc-200">{item.iz.weightKg} kg</dd>
                      </div>
                      {item.red.damage && (
                        <div className="pt-2 flex justify-between">
                          <dt className="text-zinc-500">Dégâts RED:</dt>
                          <dd className="font-bold text-red-300">{item.red.damage}</dd>
                        </div>
                      )}
                      {item.iz.damage && (
                        <div className="pt-2 flex justify-between">
                          <dt className="text-zinc-500">Dégâts Savage Worlds:</dt>
                          <dd className="font-bold text-amber-300">{item.iz.damage}</dd>
                        </div>
                      )}
                      {item.iz.ap !== undefined && (
                        <div className="pt-2 flex justify-between">
                          <dt className="text-zinc-500">Pénétration (PA):</dt>
                          <dd className="font-bold text-orange-400">PA {item.iz.ap}</dd>
                        </div>
                      )}
                      {item.red.sp !== undefined && (
                        <div className="pt-2 flex justify-between">
                          <dt className="text-zinc-500">Stopping Power (SP):</dt>
                          <dd className="font-bold text-emerald-400">SP {item.red.sp}</dd>
                        </div>
                      )}
                      {item.iz.cybertension !== undefined && (
                        <div className="pt-2 flex justify-between">
                          <dt className="text-zinc-500">Cybertension:</dt>
                          <dd className="font-bold text-purple-400">{item.iz.cybertension} pts</dd>
                        </div>
                      )}
                      <div className="pt-2 text-[11px] text-zinc-400">
                        <span className="text-zinc-500 block mb-0.5">Notes tactiques:</span>
                        {item.iz.notes}
                      </div>
                    </dl>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
