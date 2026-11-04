import React, { useState } from 'react';
import { X, Dices, RotateCcw, Zap, Sparkles, AlertTriangle } from 'lucide-react';
import { EquipmentItem, rollCyberpunkRedD10 } from '../utils/gearLogic.ts';
import { playCyberClick } from '../utils/audio.ts';

interface DiceRollerModalProps {
  isOpen: boolean;
  onClose: () => void;
  presetItem: EquipmentItem | null;
}

interface RollLog {
  id: string;
  time: string;
  system: 'Cyberpunk RED (1d10)' | 'Interface Zéro (Trait + As)' | 'Dégâts d\'Arme';
  details: string;
  result: number;
  highlight?: 'crit-success' | 'crit-fail' | 'normal';
}

export const DiceRollerModal: React.FC<DiceRollerModalProps> = ({
  isOpen,
  onClose,
  presetItem,
}) => {
  const [activeTab, setActiveTab] = useState<'red' | 'iz' | 'damage'>('red');
  const [redSkillStat, setRedSkillStat] = useState<number>(10);
  const [izTraitDie, setIzTraitDie] = useState<number>(8); // d8
  const [izModifier, setIzModifier] = useState<number>(0);
  const [isWildCard, setIsWildCard] = useState<boolean>(true);
  const [diceCount, setDiceCount] = useState<number>(4);
  const [diceSides, setDiceSides] = useState<number>(6);
  const [diceBonus, setDiceBonus] = useState<number>(0);
  const [rollLogs, setRollLogs] = useState<RollLog[]>([]);

  // If presetItem changes, automatically select damage tab and configure
  React.useEffect(() => {
    if (presetItem) {
      setActiveTab('damage');
      // Parse formula like "4d6" or "2d8+1"
      const formula = presetItem.red.damage || presetItem.iz.damage;
      if (formula) {
        const match = formula.match(/(\d+)d(\d+)(?:\+(\d+))?/);
        if (match) {
          setDiceCount(parseInt(match[1], 10) || 1);
          setDiceSides(parseInt(match[2], 10) || 6);
          setDiceBonus(parseInt(match[3] || '0', 10));
        }
      }
    }
  }, [presetItem]);

  if (!isOpen) return null;

  const addLog = (
    system: RollLog['system'],
    details: string,
    result: number,
    highlight: RollLog['highlight'] = 'normal'
  ) => {
    const time = new Date().toLocaleTimeString('fr-FR');
    const newEntry: RollLog = {
      id: Math.random().toString(36).slice(2),
      time,
      system,
      details,
      result,
      highlight,
    };
    setRollLogs((prev) => [newEntry, ...prev.slice(0, 19)]);
  };

  // Roll Cyberpunk RED (1d10 + Stat/Skill)
  const handleRollRed = () => {
    playCyberClick();
    const res = rollCyberpunkRedD10(redSkillStat);
    let highlight: RollLog['highlight'] = 'normal';
    let details = `1d10 (${res.baseRoll}) + Stat/Comp (${redSkillStat})`;

    if (res.criticalSuccess) {
      highlight = 'crit-success';
      details = `CRITIQUE ! 1d10 (${res.baseRoll}) + Explosion (${res.explodedRolls.slice(1).join(' + ')}) + ${redSkillStat}`;
    } else if (res.criticalFailure) {
      highlight = 'crit-fail';
      details = `ÉCHEC CRITIQUE ! 1d10 (1) - Pénalité (${Math.abs(res.explodedRolls[1])}) + ${redSkillStat}`;
    }

    addLog('Cyberpunk RED (1d10)', details, res.total, highlight);
  };

  // Roll Interface Zero / Savage Worlds (Trait die + Wild die with Exploding Aces)
  const rollExplodingDie = (sides: number): { total: number; rolls: number[] } => {
    const rolls: number[] = [];
    let current = Math.floor(Math.random() * sides) + 1;
    rolls.push(current);
    let sum = current;
    while (current === sides) {
      current = Math.floor(Math.random() * sides) + 1;
      rolls.push(current);
      sum += current;
    }
    return { total: sum, rolls };
  };

  const handleRollIz = () => {
    playCyberClick();
    const traitRoll = rollExplodingDie(izTraitDie);
    let bestResult = traitRoll.total;
    let details = `Trait d${izTraitDie}: [${traitRoll.rolls.join('!')}]`;

    if (isWildCard) {
      const wildRoll = rollExplodingDie(6);
      details += ` vs Dé Joker d6: [${wildRoll.rolls.join('!')}]`;
      bestResult = Math.max(traitRoll.total, wildRoll.total);
    }

    const finalTotal = bestResult + izModifier;
    if (izModifier !== 0) {
      details += ` ${izModifier > 0 ? `+${izModifier}` : izModifier}`;
    }

    const isAce = traitRoll.rolls.length > 1;
    addLog(
      'Interface Zéro (Trait + As)',
      details,
      finalTotal,
      isAce ? 'crit-success' : 'normal'
    );
  };

  // Roll standard damage
  const handleRollDamage = () => {
    playCyberClick();
    let sum = 0;
    const individual: number[] = [];
    for (let i = 0; i < diceCount; i++) {
      const roll = Math.floor(Math.random() * diceSides) + 1;
      individual.push(roll);
      sum += roll;
    }
    sum += diceBonus;
    const formulaStr = `${diceCount}d${diceSides}${diceBonus > 0 ? `+${diceBonus}` : ''}`;
    const details = `${formulaStr} => (${individual.join(' + ')})${diceBonus > 0 ? ` + ${diceBonus}` : ''}`;

    addLog('Dégâts d\'Arme', details, sum, 'normal');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Simulateur de Dés Cyberpunk"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#0a0d16] border border-red-500/60 rounded shadow-[0_0_50px_rgba(239,68,68,0.2)] text-zinc-200 font-mono overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#050810] border-b border-red-500/40 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dices className="w-5 h-5 text-red-400" />
            <div>
              <h2 className="text-base font-bold font-['Orbitron',sans-serif] text-zinc-100">
                SIMULATEUR DE DÉS &amp; DÉGÂTS TACTIQUES
              </h2>
              <span className="text-[10px] text-zinc-400">
                Cyberpunk RED (1d10) &amp; Interface Zéro 2.0 (Savage Worlds)
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              playCyberClick();
              onClose();
            }}
            className="p-1.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white"
            aria-label="Fermer le simulateur"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-zinc-800 bg-zinc-950/80">
          <button
            onClick={() => setActiveTab('red')}
            className={`flex-1 py-2.5 text-xs font-bold transition-colors ${
              activeTab === 'red'
                ? 'bg-red-950/60 text-red-300 border-b-2 border-red-500'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Cyberpunk RED (1d10)
          </button>
          <button
            onClick={() => setActiveTab('iz')}
            className={`flex-1 py-2.5 text-xs font-bold transition-colors ${
              activeTab === 'iz'
                ? 'bg-amber-950/60 text-amber-300 border-b-2 border-amber-500'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Interface Zéro (Trait + Joker)
          </button>
          <button
            onClick={() => setActiveTab('damage')}
            className={`flex-1 py-2.5 text-xs font-bold transition-colors ${
              activeTab === 'damage'
                ? 'bg-cyan-950/60 text-cyan-300 border-b-2 border-cyan-500'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Dégâts d'Arme ({presetItem ? presetItem.name : 'Libre'})
          </button>
        </div>

        {/* Tab body */}
        <div className="p-4 sm:p-6 space-y-4">
          {activeTab === 'red' && (
            <div className="space-y-4 bg-zinc-950 p-4 border border-zinc-800 rounded">
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="stat-skill-input" className="text-xs text-zinc-400 block mb-1">
                    Statistique + Compétence (ex: RÉF 8 + Armes de poing 6 = 14)
                  </label>
                  <input
                    id="stat-skill-input"
                    type="number"
                    min="1"
                    max="25"
                    value={redSkillStat}
                    onChange={(e) => setRedSkillStat(parseInt(e.target.value, 10) || 0)}
                    className="w-28 px-3 py-1.5 bg-black border border-red-600/50 rounded text-red-300 font-bold"
                  />
                </div>
                <button
                  onClick={handleRollRed}
                  className="px-6 py-3 rounded text-sm font-bold bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white border border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)] flex items-center gap-2"
                >
                  <Dices className="w-4 h-4" />
                  <span>LANCER 1d10</span>
                </button>
              </div>
              <p className="text-[11px] text-zinc-500">
                Règle RED: Si vous obtenez 10, relancez et ajoutez le résultat. Si vous obtenez 1, relancez et soustrayez le résultat !
              </p>
            </div>
          )}

          {activeTab === 'iz' && (
            <div className="space-y-4 bg-zinc-950 p-4 border border-zinc-800 rounded">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                <div>
                  <label htmlFor="trait-die-select" className="text-xs text-zinc-400 block mb-1">Type de Dé de Trait</label>
                  <select
                    id="trait-die-select"
                    value={izTraitDie}
                    onChange={(e) => setIzTraitDie(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-1.5 bg-black border border-amber-600/50 rounded text-amber-300 text-xs"
                  >
                    <option value="4">d4 (Initié)</option>
                    <option value="6">d6 (Standard)</option>
                    <option value="8">d8 (Aguerri)</option>
                    <option value="10">d10 (Vétéran)</option>
                    <option value="12">d12 (Maître)</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="modifier-select" className="text-xs text-zinc-400 block mb-1">Modificateur (MAP / Blessure)</label>
                  <select
                    id="modifier-select"
                    value={izModifier}
                    onChange={(e) => setIzModifier(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-1.5 bg-black border border-zinc-700 rounded text-zinc-300 text-xs"
                  >
                    <option value="2">+2 (Relance / Avantage)</option>
                    <option value="1">+1</option>
                    <option value="0">0 (Normal)</option>
                    <option value="-1">-1 (Blessé / Obscurité)</option>
                    <option value="-2">-2 (Action multiple / Blessure)</option>
                    <option value="-4">-4 (Situation critique)</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-amber-400 mb-2">
                    <input
                      type="checkbox"
                      checked={isWildCard}
                      onChange={(e) => setIsWildCard(e.target.checked)}
                      className="accent-amber-500 rounded"
                    />
                    <span>Personnage Joker (Dé Joker d6)</span>
                  </label>
                  <button
                    onClick={handleRollIz}
                    className="w-full py-2.5 rounded text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black border border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)] flex items-center justify-center gap-1.5"
                  >
                    <Dices className="w-4 h-4" />
                    <span>LANCER TRAIT</span>
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-zinc-500">
                Règle Savage Worlds / IZ 2.0 : Les dés explosent ("As") sur leur score maximal. Le Joker garde le meilleur résultat entre le Dé de Trait et le Dé Joker !
              </p>
            </div>
          )}

          {activeTab === 'damage' && (
            <div className="space-y-4 bg-zinc-950 p-4 border border-zinc-800 rounded">
              {presetItem && (
                <div className="text-xs text-cyan-400 bg-cyan-950/40 p-2 rounded border border-cyan-800/40 flex items-center justify-between">
                  <span>Préréglage actif : <strong>{presetItem.name}</strong></span>
                  <span>RED: {presetItem.red.damage || 'N/A'} | IZ: {presetItem.iz.damage || 'N/A'}</span>
                </div>
              )}
              <div className="grid grid-cols-3 gap-3 items-end">
                <div>
                  <label htmlFor="dice-count-select" className="text-xs text-zinc-400 block mb-1">Nombre de Dés</label>
                  <select
                    id="dice-count-select"
                    value={diceCount}
                    onChange={(e) => setDiceCount(parseInt(e.target.value, 10))}
                    className="w-full px-2 py-1.5 bg-black border border-cyan-600/50 rounded text-cyan-300 text-xs"
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
                      <option key={n} value={n}>{n} dés</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="dice-type-select" className="text-xs text-zinc-400 block mb-1">Type de Dé</label>
                  <select
                    id="dice-type-select"
                    value={diceSides}
                    onChange={(e) => setDiceSides(parseInt(e.target.value, 10))}
                    className="w-full px-2 py-1.5 bg-black border border-cyan-600/50 rounded text-cyan-300 text-xs"
                  >
                    <option value="4">d4</option>
                    <option value="6">d6</option>
                    <option value="8">d8</option>
                    <option value="10">d10</option>
                    <option value="12">d12</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="dice-bonus-select" className="text-xs text-zinc-400 block mb-1">Bonus Fixe</label>
                  <select
                    id="dice-bonus-select"
                    value={diceBonus}
                    onChange={(e) => setDiceBonus(parseInt(e.target.value, 10))}
                    className="w-full px-2 py-1.5 bg-black border border-cyan-600/50 rounded text-cyan-300 text-xs"
                  >
                    <option value="0">+0</option>
                    <option value="1">+1</option>
                    <option value="2">+2</option>
                    <option value="4">+4</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleRollDamage}
                className="w-full py-2.5 rounded text-xs font-bold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-black border border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.25)] flex items-center justify-center gap-2"
              >
                <Dices className="w-4 h-4" />
                <span>LANCER {diceCount}d{diceSides}{diceBonus > 0 ? `+${diceBonus}` : ''}</span>
              </button>
            </div>
          )}

          {/* Roll Logs History */}
          <div>
            <div className="flex items-center justify-between text-xs text-zinc-400 font-bold mb-2">
              <span>HISTORIQUE DES TIRS &amp; JETS</span>
              {rollLogs.length > 0 && (
                <button
                  onClick={() => setRollLogs([])}
                  className="text-zinc-500 hover:text-red-400 text-[11px]"
                >
                  Effacer
                </button>
              )}
            </div>

            <div className="h-44 overflow-y-auto space-y-1.5 bg-[#05070a] border border-zinc-800 rounded p-2.5 scrollbar-thin scrollbar-thumb-zinc-700">
              {rollLogs.length === 0 ? (
                <div className="h-full flex items-center justify-center text-zinc-600 text-xs">
                  Aucun jet pour l'instant. Lancez les dés ci-dessus !
                </div>
              ) : (
                rollLogs.map((log) => (
                  <div
                    key={log.id}
                    className={`p-2 rounded text-xs flex items-center justify-between border ${
                      log.highlight === 'crit-success'
                        ? 'bg-amber-950/40 border-amber-500/60 text-amber-200'
                        : log.highlight === 'crit-fail'
                        ? 'bg-red-950/40 border-red-500/60 text-red-200'
                        : 'bg-zinc-950 border-zinc-850 text-zinc-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                        <span>{log.time}</span>
                        <span>•</span>
                        <span className="text-cyan-400 font-semibold">{log.system}</span>
                      </div>
                      <div className="text-[11px] mt-0.5">{log.details}</div>
                    </div>
                    <div className="text-base font-bold font-['Orbitron',sans-serif] px-2 py-0.5 rounded bg-black/60 border border-zinc-800">
                      {log.result}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
