import React from 'react';
import { X, BookOpen, ShieldAlert, Cpu, Sparkles, Building, Layers } from 'lucide-react';
import { playCyberClick } from '../utils/audio.ts';
import { useEscapeKey } from '../utils/useEscapeKey.ts';

interface RulesGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesGuideModal: React.FC<RulesGuideModalProps> = ({ isOpen, onClose }) => {
  useEscapeKey(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Guide des Règles Interface Zéro & Cyberpunk RED"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[88vh] bg-[#0a0d16] border border-cyan-500/60 rounded shadow-[0_0_50px_rgba(0,240,255,0.2)] text-zinc-200 font-mono flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#050810] border-b border-cyan-500/40 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-base font-bold font-['Orbitron',sans-serif] text-zinc-100">
                GUIDE DES RÈGLES &amp; CONVERSIONS TACTIQUES
              </h2>
              <span className="text-[10px] text-zinc-400">
                Interface Zéro 2.0 (Malmart 2090) ⇄ Cyberpunk RED (Night City)
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              playCyberClick();
              onClose();
            }}
            className="p-1.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white"
            aria-label="Fermer le guide"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs text-zinc-300 leading-relaxed scrollbar-thin scrollbar-thumb-cyan-800">
          {/* Section 1: Qualité et Cybertension Interface Zéro */}
          <div className="bg-zinc-950 border border-zinc-800 p-4 rounded space-y-2">
            <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              1. Hiérarchie de Qualité Cybernétique &amp; Cybertension (IZ 2.0)
            </h3>
            <p>
              Dans Interface Zéro 2.0, chaque composant cybernétique possède un coût en <strong>Cybertension</strong> (stress exercé sur l'organisme). La qualité de fabrication modifie ce coût et son prix en crédits :
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
              <div className="p-2 rounded bg-zinc-900/80 border border-red-900/50">
                <span className="text-red-400 font-bold block">GUTTERWARE</span>
                <span className="text-zinc-400 block">Coût : 1 000 c$ / pt</span>
                <span className="text-zinc-400 block">Cybertension × 2</span>
                <span className="text-[10px] text-red-400/80">Illégal / Défectueux</span>
              </div>
              <div className="p-2 rounded bg-zinc-900/80 border border-sky-900/50">
                <span className="text-sky-400 font-bold block">STREETWARE</span>
                <span className="text-zinc-400 block">Coût : 5 000 c$ / pt</span>
                <span className="text-zinc-400 block">Cybertension normale</span>
                <span className="text-[10px] text-sky-400/80">Standard urbain</span>
              </div>
              <div className="p-2 rounded bg-zinc-900/80 border border-violet-900/50">
                <span className="text-violet-400 font-bold block">HYPERCHROME</span>
                <span className="text-zinc-400 block">Coût : 25 000 c$ / pt</span>
                <span className="text-zinc-400 block">Cybertension - 1</span>
                <span className="text-[10px] text-violet-400/80">Finition de luxe</span>
              </div>
              <div className="p-2 rounded bg-zinc-900/80 border border-amber-900/50">
                <span className="text-amber-400 font-bold block">MILWARE</span>
                <span className="text-zinc-400 block">Coût : 125 000 c$ / pt</span>
                <span className="text-zinc-400 block">Cybertension ÷ 2</span>
                <span className="text-[10px] text-amber-400/80">Projet secret</span>
              </div>
            </div>
            <div className="mt-2 p-2 bg-red-950/40 border border-red-800/40 rounded text-[11px] text-red-300">
              <strong>Règle du Cybertrauma :</strong> Si votre Cybertension totale dépasse votre dé de Vigueur sans augmentation, vous devez réussir un jet de Vigueur à chaque nouvel implant sous peine de subir de la Fatigue permanente voire la mort sur la table d'opération.
            </div>
          </div>

          {/* Section 2: Cyberpunk RED Raretés & Humanité */}
          <div className="bg-zinc-950 border border-zinc-800 p-4 rounded space-y-2">
            <h3 className="text-sm font-bold text-red-400 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              2. Système de Rareté &amp; Perte d'Humanité (Cyberpunk RED)
            </h3>
            <p>
              Dans Cyberpunk RED, l'économie de Night City est régie par la rareté d'accès au Marché Noir des Fixers :
            </p>
            <ul className="list-disc pl-5 space-y-1 text-zinc-400 text-[11px]">
              <li><strong className="text-zinc-200">Partout / Bon Marché (10 - 100 €$) :</strong> Disponible dans n'importe quel distributeur ou épicerie de rue.</li>
              <li><strong className="text-zinc-200">Coûteux (500 €$) :</strong> Vendeur spécialisé ou Night Market de quartier.</li>
              <li><strong className="text-zinc-200">Cher (1 000 €$) :</strong> Requiert un contact de Fixer de réputation intermédiaire.</li>
              <li><strong className="text-zinc-200">Très Cher / Super Luxe (5 000 - 10 000+ €$) :</strong> Marché corporatiste exclusif ou braquage d'un convoi blindé.</li>
              <li><strong className="text-zinc-200">Perte d'Humanité (PH) :</strong> Chaque implant réduit le score d'Humanité. Si l'Humanité tombe à 0, le personnage bascule en Cyberpsychose incontrôlable.</li>
            </ul>
          </div>

          {/* Section 3: Table de correspondance */}
          <div className="bg-zinc-950 border border-zinc-800 p-4 rounded space-y-2">
            <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              3. Table d'Équivalences Cyberpunk RED ⇄ SWADE (Savage Worlds)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px] border-collapse border border-zinc-800">
                <thead>
                  <tr className="bg-zinc-900 text-zinc-300 border-b border-zinc-800 text-left">
                    <th className="p-2">Paramètre</th>
                    <th className="p-2 text-red-400">Cyberpunk RED</th>
                    <th className="p-2 text-amber-400">SWADE / Interface Zéro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900 text-zinc-400">
                  <tr>
                    <td className="p-2 font-semibold text-zinc-200">Système de Résolution</td>
                    <td className="p-2">1d10 + Stat + Compétence (Critique sur 10, Fumble sur 1)</td>
                    <td className="p-2">Dé de Trait (d4 à d12) + Dé Joker (d6), As explosifs sur max</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold text-zinc-200">Monnaie</td>
                    <td className="p-2">Eurodollars (€$ / eb)</td>
                    <td className="p-2">Crédits Malmart (c$) (~1 €$ ≈ 1 à 1.5 c$)</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold text-zinc-200">Dégâts Pistolet Moyen</td>
                    <td className="p-2">3d6 (ex: Unity, Omaha)</td>
                    <td className="p-2">2d6, PA 1</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold text-zinc-200">Dégâts Gros Pistolet / Revolver</td>
                    <td className="p-2">4d6 (ex: Malorian, Thunderbolt)</td>
                    <td className="p-2">2d8 ou 2d8+1, PA 2 à 4</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold text-zinc-200">Dégâts Fusil d'Assaut</td>
                    <td className="p-2">5d6 (ex: Masamune, Sidewinder)</td>
                    <td className="p-2">2d8+1, PA 2 ou 3, CdT 3, Tir auto</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold text-zinc-200">Fusil Sniper / Antimatière</td>
                    <td className="p-2">6d6 à 8d6 (ex: Overwatch, Mjolnir)</td>
                    <td className="p-2">2d10 à 3d8, PA 6, Arme Lourde (AL)</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold text-zinc-200">Protection Armure Légère</td>
                    <td className="p-2">SP 11 - 12 (Veste Kevlar)</td>
                    <td className="p-2">+2 à +3 Armure (Nanotissu, cuir renforcé)</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold text-zinc-200">Protection Armure Lourde</td>
                    <td className="p-2">SP 15 - 18 (Métalmallie / Assaut)</td>
                    <td className="p-2">+5 à +6 Armure (RS Bulwark / Raptor)</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold text-zinc-200">Stress Cybernétique</td>
                    <td className="p-2">Perte d'Humanité (PH) 1d6 à 4d6</td>
                    <td className="p-2">Cybertension (1 à 4 pts / implant) sur Vigueur</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold text-zinc-200">Portées de Combat</td>
                    <td className="p-2">Portées fixes en mètres (DV table)</td>
                    <td className="p-2">Courte / Moyenne / Longue en cases (12/24/48, etc.)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: Mots-clés SWADE utiles pour la table */}
          <div className="bg-zinc-950 border border-zinc-800 p-4 rounded space-y-2">
            <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              4. Mots-clés &amp; Options Tactiques SWADE
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-zinc-400 text-[11px]">
              <li><strong className="text-zinc-200">As (Exploding Dice) :</strong> Tout dé atteignant son maximum (ex: 6 sur 1d6) est immédiatement relancé et additionné au total.</li>
              <li><strong className="text-zinc-200">Pénétration d'Armure (PA / AP) :</strong> Ignore autant de points d'armure chez la cible lors du calcul des dégâts.</li>
              <li><strong className="text-zinc-200">Arme Lourde (AL) :</strong> Capable d'endommager les blindages de mécagolems, chars et véhicules protégés par une Armure Lourde.</li>
              <li><strong className="text-zinc-200">Tir Automatique (CdT 2+) :</strong> Lance un dé de Tir par point de Cadence de Tir (CdT) avec un malus de recul de -2, consommant plus de munitions.</li>
              <li><strong className="text-zinc-200">Tir en Rafale (3RB) :</strong> Rafale de trois coups courte conférant +1 au jet de Tir et +1 aux Dégâts sans malus de recul.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
