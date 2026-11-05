import React, { useState } from 'react';
import {
  X,
  Package,
  Shield,
  Crosshair,
  Zap,
  Sword,
  Cpu,
  Coins,
  Weight,
  Sparkles,
  Trash2,
  Dices,
  Archive,
  ArrowRightLeft,
  DollarSign,
  Download,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Minus
} from 'lucide-react';
import { PlayerProfile, InventoryItem, EquipmentSlot } from '../types/playerProfile.ts';
import {
  calculateProfileStats,
  toggleEquipItem,
  toggleStashItem,
  sellItem,
  adjustWallet
} from '../utils/profileService.ts';
import { EquipmentItem, formatCurrency, getSafeImageUrl } from '../utils/gearLogic.ts';
import { generateHologramBlueprint } from '../utils/hologramSvg.ts';
import { playCyberClick, playCyberSelect, playCyberFavorite } from '../utils/audio.ts';

interface PlayerInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: PlayerProfile;
  onUpdateProfile: (updated: PlayerProfile) => void;
  onOpenDiceRoller: (item: EquipmentItem) => void;
  onSelectItemDetails: (item: EquipmentItem) => void;
}

export const PlayerInventoryModal: React.FC<PlayerInventoryModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  onOpenDiceRoller,
  onSelectItemDetails,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'equipped' | 'backpack' | 'stash'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sellingItemId, setSellingItemId] = useState<string | null>(null);
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const [fundEbInput, setFundEbInput] = useState('1000');
  const [fundCreditsInput, setFundCreditsInput] = useState('2000');
  const [notification, setNotification] = useState<string | null>(null);

  if (!isOpen) return null;

  const stats = calculateProfileStats(profile);

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleToggleEquip = (itemId: string) => {
    playCyberClick();
    const updated = toggleEquipItem(profile.id, itemId);
    if (updated) {
      onUpdateProfile(updated);
      showNotice('Statut d’équipement mis à jour.');
    }
  };

  const handleToggleStash = (itemId: string) => {
    playCyberClick();
    const updated = toggleStashItem(profile.id, itemId);
    if (updated) {
      onUpdateProfile(updated);
      showNotice('Objet transféré entre le paquetage et la planque.');
    }
  };

  const handleSell = (itemId: string, currency: 'eb' | 'credits') => {
    playCyberFavorite();
    const res = sellItem(profile.id, itemId, currency, 0.6);
    if (res.success && res.updatedProfile) {
      onUpdateProfile(res.updatedProfile);
      showNotice(res.message);
      setSellingItemId(null);
    }
  };

  const handleAddFunds = (e: React.FormEvent) => {
    e.preventDefault();
    playCyberFavorite();
    const eb = parseInt(fundEbInput, 10) || 0;
    const creds = parseInt(fundCreditsInput, 10) || 0;
    const updated = adjustWallet(profile.id, eb, creds);
    if (updated) {
      onUpdateProfile(updated);
      showNotice(`Fonds crédités : +${eb.toLocaleString('fr-FR')} €$ et +${creds.toLocaleString('fr-FR')} c$`);
      setIsAddFundsOpen(false);
    }
  };

  const handleExportSheet = () => {
    playCyberClick();
    const textContent = `
=====================================================
⚡ TECH COMPENDIUM // FICHE DE PERSONNAGE
=====================================================
NOM: ${profile.name}
HANDLE: ${profile.handle}
RÔLE / CLASSE: ${profile.role}
DATE: ${new Date().toLocaleDateString('fr-FR')}

--- SOLDE & PORTEFEUILLE ---
- Eurodollars (€$): ${profile.walletEb.toLocaleString('fr-FR')} €$
- Crédits IZ (c$): ${profile.walletCredits.toLocaleString('fr-FR')} c$
- Valeur totale de l'inventaire: ${stats.totalValueEb.toLocaleString('fr-FR')} €$ / ${stats.totalValueCredits.toLocaleString('fr-FR')} c$

--- ÉTAT TACTIQUE ---
- Poids transporté: ${stats.totalCarriedWeightKg} / ${profile.maxWeightKg} kg ${stats.isOverweight ? '[ENCOMBREMENT DÉPASSÉ]' : '[OK]'}
- Cybertension installée: ${stats.totalCybertension} / ${profile.maxCybertension} pts ${stats.isCyberOverloaded ? '[SURCHARGE CYBER]' : '[OK]'}
- Blindage SP cumulé: SP ${stats.equippedArmorSpTotal}
- Armes actives: ${stats.equippedWeaponsCount}

--- INVENTAIRE DU PAQUETAGE (${profile.inventory.length} objets) ---
${profile.inventory
  .map(
    (i, idx) =>
      `[${idx + 1}] ${i.item.name} (x${i.quantity})
     Statut: ${i.equipped ? 'ÉQUIPÉ' : i.slot === 'stash' ? 'À LA PLANQUE' : 'DANS LE SAC'}
     Catégorie: ${i.item.categoryLabel} | Rareté: ${i.item.rarityLabel}
     Prix: ${i.item.red.priceEb} €$ / ${i.item.iz.priceCredits} c$ | Poids: ${i.item.iz.weightKg} kg
     ${i.item.red.damage ? `Dégâts RED: ${i.item.red.damage} | ` : ''}${i.item.iz.damage ? `Dégâts SWADE: ${i.item.iz.damage} PA ${i.item.iz.ap || 0}` : ''}
`
  )
  .join('\n')}
=====================================================
`.trim();

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fiche-personnage-${profile.name.toLowerCase().replace(/\s+/g, '-')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showNotice('Fiche de personnage exportée en format texte.');
  };

  // Filter inventory
  const filteredInventory = profile.inventory.filter((inv) => {
    if (activeTab === 'equipped' && !inv.equipped) return false;
    if (activeTab === 'backpack' && (inv.equipped || inv.slot === 'stash')) return false;
    if (activeTab === 'stash' && inv.slot !== 'stash') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = inv.item.name.toLowerCase().includes(q);
      const matchMfg = inv.item.manufacturer.toLowerCase().includes(q);
      const matchCategory = inv.item.categoryLabel.toLowerCase().includes(q);
      return matchName || matchMfg || matchCategory;
    }

    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-[#0a0e17] border-2 border-cyan-500/80 rounded-lg shadow-[0_0_40px_rgba(0,240,255,0.25)] overflow-hidden font-mono text-cyan-100">
        {/* Header HUD */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#05080e] border-b border-cyan-500/50">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded border-2 border-cyan-400 flex items-center justify-center text-cyan-300 font-bold text-lg shadow-[0_0_12px_rgba(0,240,255,0.3)]"
              style={{ backgroundColor: `${profile.avatarColor}25` }}
            >
              <Package className="w-5 h-5 text-cyan-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold tracking-wider text-cyan-300 font-['Orbitron',sans-serif]">
                  {profile.name}
                </h2>
                <span className="text-[11px] px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/60 text-cyan-300 font-bold uppercase">
                  {profile.role}
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-['Rajdhani',sans-serif]">
                {profile.handle} // Inventaire actif et gestion tactique de paquetage
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportSheet}
              className="px-3 py-1.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-cyan-300 hover:border-cyan-400 transition-colors flex items-center gap-1.5 text-xs font-bold"
              title="Exporter le résumé de la fiche de personnage en fichier texte"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Exporter Fiche</span>
            </button>

            <button
              onClick={() => {
                playCyberClick();
                onClose();
              }}
              className="p-1.5 rounded text-zinc-400 hover:text-cyan-300 hover:bg-cyan-950/50 transition-colors"
              aria-label="Fermer la fenêtre d'inventaire"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Character Tactical Dashboard Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-4 bg-zinc-950/80 border-b border-cyan-900/40 text-xs">
          {/* Wallet */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded p-2.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-zinc-500 block uppercase font-bold">SOLDE DU PORTEFEUILLE</span>
              <div className="text-sm font-bold text-amber-300 mt-0.5">
                {profile.walletEb.toLocaleString('fr-FR')} €$
              </div>
              <div className="text-[11px] font-semibold text-cyan-300">
                {profile.walletCredits.toLocaleString('fr-FR')} c$
              </div>
            </div>
            <button
              onClick={() => {
                playCyberClick();
                setIsAddFundsOpen(true);
              }}
              className="p-1.5 rounded bg-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-black border border-amber-500/50 transition-all"
              title="Ajouter une récompense ou prime de mission"
            >
              <Coins className="w-4 h-4" />
            </button>
          </div>

          {/* Carry Weight */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded p-2.5">
            <span className="text-[10px] text-zinc-500 block uppercase font-bold">CHARGE / ENCOMBREMENT</span>
            <div className={`text-sm font-bold mt-0.5 ${stats.isOverweight ? 'text-red-400 animate-pulse' : 'text-zinc-100'}`}>
              {stats.totalCarriedWeightKg} / {profile.maxWeightKg} kg
            </div>
            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden mt-1.5">
              <div
                className={`h-full ${
                  stats.isOverweight ? 'bg-red-500' : 'bg-cyan-400'
                }`}
                style={{ width: `${Math.min(100, (stats.totalCarriedWeightKg / profile.maxWeightKg) * 100)}%` }}
              />
            </div>
          </div>

          {/* Cybertension */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded p-2.5">
            <span className="text-[10px] text-zinc-500 block uppercase font-bold">CYBERTENSION INSTALLEE</span>
            <div className={`text-sm font-bold mt-0.5 ${stats.isCyberOverloaded ? 'text-red-400 animate-pulse' : 'text-cyan-300'}`}>
              {stats.totalCybertension} / {profile.maxCybertension} pts
            </div>
            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden mt-1.5">
              <div
                className={`h-full ${
                  stats.isCyberOverloaded ? 'bg-red-500' : 'bg-fuchsia-400'
                }`}
                style={{ width: `${Math.min(100, (stats.totalCybertension / profile.maxCybertension) * 100)}%` }}
              />
            </div>
          </div>

          {/* Armor & Weapon Readiness */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded p-2.5">
            <span className="text-[10px] text-zinc-500 block uppercase font-bold">PROTECTION & COMBAT</span>
            <div className="flex items-center justify-between text-xs font-bold text-zinc-200 mt-0.5">
              <span className="text-emerald-400">SP {stats.equippedArmorSpTotal}</span>
              <span className="text-zinc-400">•</span>
              <span className="text-amber-400">{stats.equippedWeaponsCount} Arme(s)</span>
            </div>
            <span className="text-[10px] text-zinc-500 block mt-1 truncate">
              {profile.inventory.length} référence(s) en tout
            </span>
          </div>
        </div>

        {/* Status notification toast */}
        {notification && (
          <div className="bg-cyan-950/90 border-b border-cyan-500/50 px-5 py-2 text-xs text-cyan-300 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notification}</span>
          </div>
        )}

        {/* Quick Add Funds Sub-modal */}
        {isAddFundsOpen && (
          <form
            onSubmit={handleAddFunds}
            className="p-4 bg-amber-950/40 border-b border-amber-500/50 flex flex-wrap items-center gap-3 text-xs"
          >
            <span className="font-bold text-amber-300 flex items-center gap-1">
              <Coins className="w-4 h-4 text-amber-400" /> Ajouter Récompense de Mission :
            </span>
            <div className="flex items-center gap-1.5">
              <label htmlFor="fund-eb" className="text-zinc-400">€$ :</label>
              <input
                id="fund-eb"
                type="number"
                value={fundEbInput}
                onChange={(e) => setFundEbInput(e.target.value)}
                className="w-24 px-2 py-1 bg-zinc-900 border border-zinc-700 text-amber-300 font-bold rounded"
                min="0"
                step="50"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <label htmlFor="fund-credits" className="text-zinc-400">c$ :</label>
              <input
                id="fund-credits"
                type="number"
                value={fundCreditsInput}
                onChange={(e) => setFundCreditsInput(e.target.value)}
                className="w-24 px-2 py-1 bg-zinc-900 border border-zinc-700 text-cyan-300 font-bold rounded"
                min="0"
                step="100"
              />
            </div>
            <button
              type="submit"
              className="px-3 py-1 bg-amber-500 text-black font-bold rounded hover:bg-amber-400 transition-colors"
            >
              Valider Crédits
            </button>
            <button
              type="button"
              onClick={() => setIsAddFundsOpen(false)}
              className="px-2 py-1 text-zinc-400 hover:text-zinc-200"
            >
              Annuler
            </button>
          </form>
        )}

        {/* Filter Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between px-4 py-2 bg-zinc-950 border-b border-zinc-800 text-xs gap-2">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => {
                playCyberSelect();
                setActiveTab('all');
              }}
              className={`px-3 py-1.5 rounded font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                  : 'text-zinc-400 hover:text-cyan-300 bg-zinc-900'
              }`}
            >
              Tout ({profile.inventory.length})
            </button>
            <button
              onClick={() => {
                playCyberSelect();
                setActiveTab('equipped');
              }}
              className={`px-3 py-1.5 rounded font-bold transition-all ${
                activeTab === 'equipped'
                  ? 'bg-emerald-500 text-black shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                  : 'text-zinc-400 hover:text-emerald-300 bg-zinc-900'
              }`}
            >
              Équipé & Actif ({profile.inventory.filter((i) => i.equipped).length})
            </button>
            <button
              onClick={() => {
                playCyberSelect();
                setActiveTab('backpack');
              }}
              className={`px-3 py-1.5 rounded font-bold transition-all ${
                activeTab === 'backpack'
                  ? 'bg-amber-500 text-black shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                  : 'text-zinc-400 hover:text-amber-300 bg-zinc-900'
              }`}
            >
              Sac à dos ({profile.inventory.filter((i) => !i.equipped && i.slot !== 'stash').length})
            </button>
            <button
              onClick={() => {
                playCyberSelect();
                setActiveTab('stash');
              }}
              className={`px-3 py-1.5 rounded font-bold transition-all ${
                activeTab === 'stash'
                  ? 'bg-fuchsia-500 text-black shadow-[0_0_10px_rgba(217,70,239,0.3)]'
                  : 'text-zinc-400 hover:text-fuchsia-300 bg-zinc-900'
              }`}
            >
              Planque ({profile.inventory.filter((i) => i.slot === 'stash').length})
            </button>
          </div>

          <div className="w-full sm:w-auto">
            <input
              type="text"
              placeholder="Filtrer l'inventaire..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-48 px-2.5 py-1 bg-zinc-900/90 border border-zinc-700 rounded text-cyan-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Inventory Item List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3 flex-1 scrollbar-thin scrollbar-thumb-cyan-800">
          {filteredInventory.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-zinc-500 text-center">
              <Package className="w-12 h-12 text-zinc-700 mb-2 stroke-1" />
              <p className="text-sm font-bold text-zinc-400">Aucun équipement dans cette section</p>
              <p className="text-xs text-zinc-600 mt-1">
                Activez le Mode Boutique Virtuelle dans le catalogue pour acquérir des armes, cybermatériel ou armures !
              </p>
            </div>
          ) : (
            filteredInventory.map((inv) => {
              const item = inv.item;
              const isSelling = sellingItemId === inv.id;

              return (
                <div
                  key={inv.id}
                  className={`flex flex-col md:flex-row items-stretch md:items-center justify-between p-3.5 bg-zinc-950/80 border rounded transition-all gap-3 ${
                    inv.equipped
                      ? 'border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.12)]'
                      : inv.slot === 'stash'
                      ? 'border-fuchsia-800/40 bg-fuchsia-950/10'
                      : 'border-zinc-800 hover:border-cyan-800/60'
                  }`}
                >
                  {/* Left: Thumbnail & Main Info */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Visual schematic */}
                    <div
                      className="w-16 h-14 rounded overflow-hidden shrink-0 bg-black/60 border border-zinc-800 flex items-center justify-center cursor-pointer"
                      onClick={() => onSelectItemDetails(item)}
                      title="Voir les détails complets"
                    >
                      <img
                        src={getSafeImageUrl(item.imageUrl) || generateHologramBlueprint(item)}
                        alt={item.name}
                        onError={(e) => {
                          // Fallback immediately to procedural hologram
                          (e.target as HTMLImageElement).src = generateHologramBlueprint(item);
                        }}
                        className="w-full h-full object-contain p-1 opacity-90 hover:opacity-100 transition-opacity"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap mb-1">
                        {inv.equipped ? (
                          <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-emerald-500 text-black uppercase">
                            ✓ ÉQUIPÉ
                          </span>
                        ) : inv.slot === 'stash' ? (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-fuchsia-950 border border-fuchsia-500/60 text-fuchsia-300 uppercase">
                            PLANQUE
                          </span>
                        ) : (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-400 uppercase">
                            SAC À DOS
                          </span>
                        )}
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400">
                          {item.categoryLabel}
                        </span>
                        {inv.quantity > 1 && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-400 text-cyan-300">
                            x{inv.quantity}
                          </span>
                        )}
                      </div>

                      <h3
                        onClick={() => onSelectItemDetails(item)}
                        className="font-bold text-zinc-100 font-['Rajdhani',sans-serif] text-sm md:text-base hover:text-cyan-300 cursor-pointer truncate transition-colors"
                      >
                        {item.name}
                      </h3>

                      <div className="text-[11px] text-zinc-400 flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="text-cyan-400">{item.manufacturer}</span>
                        <span>•</span>
                        <span>{item.iz.weightKg} kg</span>
                        {item.red.damage && (
                          <>
                            <span>•</span>
                            <span className="text-red-400 font-semibold">{item.red.damage} (RED)</span>
                          </>
                        )}
                        {item.iz.damage && (
                          <>
                            <span>•</span>
                            <span className="text-amber-400 font-semibold">{item.iz.damage} PA {item.iz.ap || 0}</span>
                          </>
                        )}
                        {item.iz.cybertension !== undefined && item.iz.cybertension > 0 && (
                          <>
                            <span>•</span>
                            <span className="text-fuchsia-400">{item.iz.cybertension} pts cyber</span>
                          </>
                        )}
                        {item.red.sp !== undefined && item.red.sp > 0 && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-400">SP {item.red.sp}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-1.5 flex-wrap justify-end shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-zinc-800">
                    {/* Roll Dice Button (if weapon) */}
                    {(item.red.damage || item.iz.damage) && (
                      <button
                        onClick={() => {
                          playCyberClick();
                          onOpenDiceRoller(item);
                        }}
                        className="p-1.5 rounded bg-zinc-900 border border-zinc-700 text-amber-300 hover:bg-amber-950/60 hover:border-amber-400 transition-colors"
                        title="Lancer les dés d'attaque et de dégâts pour cette arme"
                        aria-label="Lancer les dés"
                      >
                        <Dices className="w-4 h-4" />
                      </button>
                    )}

                    {/* Equip / Unequip Toggle */}
                    <button
                      onClick={() => handleToggleEquip(inv.id)}
                      className={`px-2.5 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1 ${
                        inv.equipped
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500'
                          : 'bg-zinc-900 border border-zinc-700 text-zinc-300 hover:border-emerald-400 hover:text-emerald-300'
                      }`}
                      title={inv.equipped ? 'Déséquiper / Remettre dans le sac' : 'Équiper pour le combat'}
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span>{inv.equipped ? 'Déséquiper' : 'Équiper'}</span>
                    </button>

                    {/* Move to Stash Toggle */}
                    <button
                      onClick={() => handleToggleStash(inv.id)}
                      className={`p-1.5 rounded border transition-colors ${
                        inv.slot === 'stash'
                          ? 'bg-fuchsia-950 border-fuchsia-500 text-fuchsia-300 hover:bg-fuchsia-900'
                          : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-cyan-300 hover:border-cyan-500'
                      }`}
                      title={inv.slot === 'stash' ? 'Sortir de la planque vers le sac à dos' : 'Déposer dans la planque (pèse 0 kg)'}
                    >
                      <Archive className="w-4 h-4" />
                    </button>

                    {/* Sell Back Button */}
                    {!isSelling ? (
                      <button
                        onClick={() => setSellingItemId(inv.id)}
                        className="px-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-amber-300 hover:border-amber-400 transition-colors text-xs font-bold"
                        title="Revendre cet objet au marché noir"
                      >
                        Revendre
                      </button>
                    ) : (
                      <div className="flex items-center gap-1 bg-amber-950/60 border border-amber-500/70 p-1 rounded animate-in fade-in">
                        <span className="text-[10px] text-amber-300 font-bold px-1">Revendre à :</span>
                        <button
                          onClick={() => handleSell(inv.id, 'eb')}
                          className="px-2 py-0.5 bg-amber-500 text-black font-bold rounded text-[10px] hover:bg-amber-400"
                          title="Revendre en Eurodollars"
                        >
                          {Math.round(item.red.priceEb * 0.6).toLocaleString('fr-FR')} €$
                        </button>
                        <button
                          onClick={() => handleSell(inv.id, 'credits')}
                          className="px-2 py-0.5 bg-cyan-500 text-black font-bold rounded text-[10px] hover:bg-cyan-400"
                          title="Revendre en Crédits IZ"
                        >
                          {Math.round(item.iz.priceCredits * 0.6).toLocaleString('fr-FR')} c$
                        </button>
                        <button
                          onClick={() => setSellingItemId(null)}
                          className="p-1 text-zinc-400 hover:text-white"
                          title="Annuler"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Summary Bar */}
        <div className="flex items-center justify-between px-5 py-3 bg-[#05080e] border-t border-zinc-800 text-xs">
          <div className="flex items-center gap-2 text-zinc-400">
            <span>Valeur estimée du paquetage :</span>
            <span className="text-amber-400 font-bold">{stats.totalValueEb.toLocaleString('fr-FR')} €$</span>
            <span>/</span>
            <span className="text-cyan-400 font-bold">{stats.totalValueCredits.toLocaleString('fr-FR')} c$</span>
          </div>

          <button
            onClick={() => {
              playCyberClick();
              onClose();
            }}
            className="px-4 py-1.5 bg-cyan-500 text-black font-bold rounded hover:bg-cyan-400 transition-colors"
          >
            Fermer l'Inventaire
          </button>
        </div>
      </div>
    </div>
  );
};
