import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Users,
  UserPlus,
  Trash2,
  Copy,
  Download,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Edit2,
  Coins,
  Shield,
  Sparkles,
  FileText,
  Dices,
  Package,
  Check,
  Zap,
  Info
} from 'lucide-react';
import { PlayerProfile } from '../types/playerProfile.ts';
import {
  createProfile,
  deleteProfile,
  updateProfile,
  exportProfileToJson,
  importProfileFromJson,
  calculateProfileStats,
  ARCHETYPE_PRESETS,
  ArchetypePreset,
  generateRandomCyberpunkIdentity,
  buildStarterInventory,
} from '../utils/profileService.ts';
import { playCyberClick, playCyberSelect, playCyberFavorite } from '../utils/audio.ts';

interface ProfileManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: PlayerProfile[];
  activeProfileId: string;
  onSelectProfile: (id: string) => void;
  onRefreshProfiles: () => void;
  startInCreateMode?: boolean;
}

export const ProfileManagerModal: React.FC<ProfileManagerModalProps> = ({
  isOpen,
  onClose,
  profiles,
  activeProfileId,
  onSelectProfile,
  onRefreshProfiles,
  startInCreateMode = false,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [selectedArchetypeId, setSelectedArchetypeId] = useState<string>('solo');
  const [includeStarterGear, setIncludeStarterGear] = useState(true);

  // New Profile Form State
  const [nameInput, setNameInput] = useState('');
  const [handleInput, setHandleInput] = useState('');
  const [roleInput, setRoleInput] = useState('Solo / Mercenaire');
  const [walletEbInput, setWalletEbInput] = useState('8500');
  const [walletCreditsInput, setWalletCreditsInput] = useState('16000');
  const [maxWeightInput, setMaxWeightInput] = useState('45');
  const [maxCyberInput, setMaxCyberInput] = useState('9');
  const [avatarColor, setAvatarColor] = useState('#ef4444');
  const [notesInput, setNotesInput] = useState('Mercenaire d\'élite de Night City. Équipement optimisé pour le combat.');

  const [notification, setNotification] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Open in create mode if requested by caller
  useEffect(() => {
    if (isOpen && startInCreateMode) {
      setIsCreating(true);
    }
  }, [isOpen, startInCreateMode]);

  if (!isOpen) return null;

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const applyArchetype = (preset: ArchetypePreset) => {
    playCyberSelect();
    setSelectedArchetypeId(preset.id);
    setRoleInput(preset.role);
    setWalletEbInput(String(preset.walletEb));
    setWalletCreditsInput(String(preset.walletCredits));
    setMaxWeightInput(String(preset.maxWeightKg));
    setMaxCyberInput(String(preset.maxCybertension));
    setAvatarColor(preset.avatarColor);
    setNotesInput(preset.notes);
    if (!handleInput || handleInput.includes('//')) {
      setHandleInput(preset.suggestedHandle);
    }
  };

  const handleRandomizeIdentity = () => {
    playCyberClick();
    const identity = generateRandomCyberpunkIdentity();
    setNameInput(identity.name);
    setHandleInput(identity.handle);
    showNotice(`Nom généré : ${identity.name}`);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;

    playCyberFavorite();

    // Prepare starter equipment if checked
    let starterInventory = undefined;
    if (includeStarterGear) {
      const preset = ARCHETYPE_PRESETS.find((p) => p.id === selectedArchetypeId) || ARCHETYPE_PRESETS[0];
      starterInventory = buildStarterInventory(preset.starterEquipmentIds);
    }

    const created = createProfile({
      name: nameInput.trim(),
      handle: handleInput.trim() || `${nameInput.trim()} // Edgerunner`,
      role: roleInput,
      walletEb: parseInt(walletEbInput, 10) || 5000,
      walletCredits: parseInt(walletCreditsInput, 10) || 10000,
      maxWeightKg: parseInt(maxWeightInput, 10) || 40,
      maxCybertension: parseInt(maxCyberInput, 10) || 8,
      avatarColor,
      notes: notesInput.trim(),
      inventory: starterInventory || [],
    });

    onRefreshProfiles();
    onSelectProfile(created.id);
    setIsCreating(false);
    resetForm();
    showNotice(`Nouveau profil "${created.name}" créé et activé avec succès !`);
  };

  const resetForm = () => {
    setNameInput('');
    setHandleInput('');
    setSelectedArchetypeId('solo');
    setRoleInput('Solo / Mercenaire');
    setWalletEbInput('8500');
    setWalletCreditsInput('16000');
    setMaxWeightInput('45');
    setMaxCyberInput('9');
    setAvatarColor('#ef4444');
    setNotesInput('Mercenaire d\'élite de Night City. Équipement optimisé pour le combat.');
    setIncludeStarterGear(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (profiles.length <= 1) {
      showNotice('Impossible de supprimer le dernier profil.');
      return;
    }
    if (window.confirm(`Confirmer la suppression définitive du profil "${name}" ?`)) {
      playCyberClick();
      const res = deleteProfile(id);
      onRefreshProfiles();
      onSelectProfile(res.nextActiveId);
      showNotice(`Profil "${name}" supprimé.`);
    }
  };

  const handleDuplicate = (profile: PlayerProfile) => {
    playCyberClick();
    const copy = createProfile({
      ...profile,
      name: `${profile.name} (Copie)`,
      handle: `${profile.handle} // Clone`,
    });
    onRefreshProfiles();
    onSelectProfile(copy.id);
    showNotice(`Profil dupliqué : "${copy.name}".`);
  };

  const handleExportProfile = (profile: PlayerProfile) => {
    playCyberClick();
    const jsonStr = exportProfileToJson(profile);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `profil-${profile.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showNotice(`Fichier de profil pour "${profile.name}" exporté.`);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const imported = importProfileFromJson(text);
        onRefreshProfiles();
        onSelectProfile(imported.id);
        showNotice(`Profil "${imported.name}" importé avec succès !`);
      } catch (err: any) {
        showNotice(`Erreur d'import : ${err?.message || 'Fichier JSON corrompu'}`);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const ROLES = [
    'Solo / Mercenaire',
    'Netrunner / Deep Dive',
    'Tech / Fabricant',
    'Fixer / Négociant',
    'Nomad / Pilote',
    'Medtech / Ripperdoc',
    'Rockerboy / Rebelle',
    'Cop / Détective',
    'Corpo / Agent Exécutif',
    'Edgerunner Hybride'
  ];

  const AVATAR_COLORS = ['#00f0ff', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#ef4444', '#38bdf8', '#e2e8f0'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-[#0b0f19] border-2 border-cyan-500/80 rounded-lg shadow-[0_0_35px_rgba(0,240,255,0.25)] overflow-hidden font-mono text-cyan-100">
        {/* Header Terminal */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#05070c] border-b border-cyan-500/40">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded bg-cyan-950/80 border border-cyan-400 text-cyan-300">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold tracking-wider text-cyan-300 font-['Orbitron',sans-serif]">
                GESTIONNAIRE DE PROFILS // NETRUNNER & SOLOS
              </h2>
              <p className="text-[11px] text-zinc-400 font-['Rajdhani',sans-serif]">
                Créez, sauvegardez et échangez vos fiches de personnages, portefeuilles et inventaires
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playCyberClick();
              onClose();
            }}
            className="p-1.5 rounded text-zinc-400 hover:text-cyan-300 hover:bg-cyan-950/50 transition-colors"
            aria-label="Fermer le gestionnaire de profils"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action bar: Create / Import */}
        <div className="flex flex-wrap items-center justify-between px-5 py-2.5 bg-zinc-950 border-b border-zinc-800 text-xs gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playCyberClick();
                setIsCreating(!isCreating);
              }}
              className="px-3 py-1.5 rounded bg-cyan-500 text-black font-bold flex items-center gap-1.5 hover:bg-cyan-400 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isCreating ? 'Fermer le Formulaire' : 'Nouveau Personnage'}</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-cyan-300 hover:border-cyan-400 transition-colors flex items-center gap-1.5 font-bold"
            >
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
              <span>Importer Profil JSON</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileImport}
              className="hidden"
            />
          </div>

          <span className="text-zinc-500 text-[11px]">
            {profiles.length} profil(s) enregistré(s) localement
          </span>
        </div>

        {/* Notification Toast */}
        {notification && (
          <div className="bg-cyan-950/90 border-b border-cyan-500/50 px-5 py-2 text-xs text-cyan-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notification}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 scrollbar-thin scrollbar-thumb-cyan-800 text-xs">
          {/* Create Form Collapse */}
          {isCreating && (
            <form
              onSubmit={handleCreate}
              className="p-4 bg-zinc-950 border-2 border-cyan-500/70 rounded-lg space-y-4 animate-in fade-in shadow-[0_0_20px_rgba(0,240,255,0.15)]"
            >
              <div className="flex flex-wrap items-center justify-between border-b border-zinc-800 pb-2.5 gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-cyan-950 border border-cyan-400 text-cyan-300">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-cyan-300 font-['Orbitron',sans-serif]">
                      CRÉER UN NOUVEAU PROFIL DE JOUEUR
                    </h3>
                    <p className="text-[10px] text-zinc-400">
                      Chaque profil conserve son inventaire, ses crédits et son équipement de façon indépendante.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRandomizeIdentity}
                  className="px-2.5 py-1 rounded bg-cyan-950/70 border border-cyan-500/60 text-cyan-300 hover:bg-cyan-900/60 hover:border-cyan-400 flex items-center gap-1.5 font-bold transition-all"
                  title="Générer aléatoirement un nom et handle cyberpunk"
                >
                  <Dices className="w-3.5 h-3.5 text-cyan-400" />
                  <span>🎲 Générer Nom Cyberpunk</span>
                </button>
              </div>

              {/* Archetypes 1-click quick-presets */}
              <div>
                <label className="block text-[11px] text-zinc-400 font-bold uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-amber-300">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Archétypes Cyberpunk Préréglés (1-Clic)
                  </span>
                  <span className="text-[10px] text-zinc-500 font-normal">Sélectionnez pour pré-remplir stats et matériel</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {ARCHETYPE_PRESETS.map((preset) => {
                    const isSelected = selectedArchetypeId === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => applyArchetype(preset)}
                        className={`px-2.5 py-1.5 rounded text-left border transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-cyan-950/80 border-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.25)]'
                            : 'bg-zinc-900/70 border-zinc-800 hover:border-zinc-600 text-zinc-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: preset.avatarColor }}
                          />
                          <span className={`text-xs truncate font-bold ${isSelected ? 'text-cyan-200' : 'text-zinc-200'}`}>
                            {preset.label.split('/')[0].trim()}
                          </span>
                        </div>
                        {isSelected && <Check className="w-3 h-3 text-cyan-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Selected Archetype Description */}
                {ARCHETYPE_PRESETS.find((p) => p.id === selectedArchetypeId) && (
                  <div className="mt-2 p-2 rounded bg-zinc-900/60 border border-zinc-800 text-[11px] text-zinc-400 flex items-start gap-2">
                    <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-zinc-200 font-bold">
                        {ARCHETYPE_PRESETS.find((p) => p.id === selectedArchetypeId)?.label} :
                      </span>{' '}
                      {ARCHETYPE_PRESETS.find((p) => p.id === selectedArchetypeId)?.description}
                    </div>
                  </div>
                )}
              </div>

              {/* Form Inputs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-zinc-300 mb-1 font-bold">Nom du Personnage *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Jax 'Ghost' Chen"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-700 rounded text-zinc-100 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 mb-1 font-bold">Handle / Pseudo de Rue</label>
                  <input
                    type="text"
                    placeholder="Ex: Ghost // Solo de Night City"
                    value={handleInput}
                    onChange={(e) => setHandleInput(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-700 rounded text-zinc-100 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 mb-1 font-bold">Rôle / Spécialisation</label>
                  <select
                    value={roleInput}
                    onChange={(e) => setRoleInput(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-700 rounded text-zinc-100 focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1 font-bold">Eurodollars Début (€$)</label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={walletEbInput}
                    onChange={(e) => setWalletEbInput(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-700 rounded text-amber-300 font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-bold">Crédits IZ Début (c$)</label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={walletCreditsInput}
                    onChange={(e) => setWalletCreditsInput(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-700 rounded text-cyan-300 font-bold focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-bold">Charge Max (kg)</label>
                  <input
                    type="number"
                    min="10"
                    value={maxWeightInput}
                    onChange={(e) => setMaxWeightInput(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-700 rounded text-zinc-200 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-bold">Limite Cybertension</label>
                  <input
                    type="number"
                    min="1"
                    value={maxCyberInput}
                    onChange={(e) => setMaxCyberInput(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-700 rounded text-fuchsia-300 font-bold focus:outline-none focus:border-fuchsia-400"
                  />
                </div>
              </div>

              {/* Starter Equipment Pack Checkbox */}
              <div className="p-2.5 rounded bg-cyan-950/40 border border-cyan-800/60 flex items-center justify-between gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeStarterGear}
                    onChange={(e) => setIncludeStarterGear(e.target.checked)}
                    className="w-4 h-4 text-cyan-500 bg-zinc-900 border-zinc-700 rounded focus:ring-cyan-400"
                  />
                  <div>
                    <span className="text-zinc-200 font-bold flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-cyan-400" />
                      Équiper le Pack de Matériel de Départ
                    </span>
                    <span className="text-[10px] text-zinc-400 block">
                      Attribue automatiquement les armes, armure et cyberware de départ correspondant à l'archétype sélectionné.
                    </span>
                  </div>
                </label>
              </div>

              {/* Color picker */}
              <div>
                <label className="block text-zinc-400 mb-1.5 font-bold">Couleur d'Avatar Holographique</label>
                <div className="flex items-center gap-2">
                  {AVATAR_COLORS.map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setAvatarColor(col)}
                      className={`w-6 h-6 rounded-full border-2 transition-transform ${
                        avatarColor === col ? 'scale-125 border-white shadow-[0_0_8px_rgba(255,255,255,0.6)]' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: col }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-bold">Notes & Historique</label>
                <textarea
                  rows={2}
                  placeholder="Antécédents corpo, affiliation de gang, implants favoris..."
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-700 rounded text-zinc-200 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-3 py-1.5 text-zinc-400 hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-cyan-500 text-black font-bold rounded hover:bg-cyan-400 transition-colors shadow-[0_0_12px_rgba(0,240,255,0.3)]"
                >
                  ✓ Créer et Activer le Profil
                </button>
              </div>
            </form>
          )}

          {/* Profile Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {profiles.map((p) => {
              const isActive = p.id === activeProfileId;
              const stats = calculateProfileStats(p);
              const itemCount = p.inventory.reduce((sum, i) => sum + (i.quantity || 1), 0);

              return (
                <div
                  key={p.id}
                  className={`relative p-4 rounded-lg border transition-all flex flex-col justify-between gap-3 bg-zinc-950/90 ${
                    isActive
                      ? 'border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.25)]'
                      : 'border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  {/* Top Bar */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-full border-2 border-cyan-400 flex items-center justify-center text-xs font-bold shrink-0"
                          style={{ backgroundColor: p.avatarColor || '#00f0ff', color: '#000' }}
                        >
                          {p.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-zinc-100 font-['Rajdhani',sans-serif]">
                              {p.name}
                            </h4>
                            {isActive && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500 text-black font-black uppercase tracking-wider">
                                ACTIF
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-zinc-400">{p.role}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleExportProfile(p)}
                          className="p-1 rounded text-zinc-500 hover:text-cyan-300 hover:bg-zinc-900 transition-colors"
                          title="Télécharger la fiche de ce profil en JSON"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(p)}
                          className="p-1 rounded text-zinc-500 hover:text-amber-300 hover:bg-zinc-900 transition-colors"
                          title="Dupliquer ce personnage"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        {profiles.length > 1 && (
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            className="p-1 rounded text-zinc-500 hover:text-red-400 hover:bg-zinc-900 transition-colors"
                            title="Supprimer ce profil"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-[11px] text-zinc-400 italic mb-2 line-clamp-1">
                      {p.handle}
                    </p>

                    {/* Stats pills */}
                    <div className="grid grid-cols-2 gap-1.5 bg-zinc-900/80 p-2 rounded text-[11px] mb-2">
                      <div>
                        <span className="text-zinc-500 text-[10px]">SOLDE €$ :</span>{' '}
                        <span className="text-amber-300 font-bold">{p.walletEb.toLocaleString('fr-FR')} €$</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 text-[10px]">SOLDE c$ :</span>{' '}
                        <span className="text-cyan-300 font-bold">{p.walletCredits.toLocaleString('fr-FR')} c$</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 text-[10px]">CHARGE :</span>{' '}
                        <span className={stats.isOverweight ? 'text-red-400 font-bold' : 'text-zinc-300'}>
                          {stats.totalCarriedWeightKg} / {p.maxWeightKg} kg
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-500 text-[10px]">CYBER :</span>{' '}
                        <span className={stats.isCyberOverloaded ? 'text-red-400 font-bold' : 'text-fuchsia-300'}>
                          {stats.totalCybertension} / {p.maxCybertension} pt
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-zinc-400">
                      <span>Objets possédés : <strong className="text-cyan-300">{itemCount}</strong></span>
                      <span>Armures SP : <strong className="text-emerald-400">{stats.equippedArmorSpTotal}</strong></span>
                    </div>
                  </div>

                  {/* Select button */}
                  <div>
                    {!isActive ? (
                      <button
                        onClick={() => {
                          playCyberClick();
                          onSelectProfile(p.id);
                          showNotice(`Profil actif basculé sur "${p.name}".`);
                        }}
                        className="w-full py-1.5 bg-zinc-900 border border-zinc-700 hover:border-cyan-400 hover:text-cyan-300 text-zinc-300 font-bold rounded transition-colors text-xs"
                      >
                        Sélectionner ce Personnage
                      </button>
                    ) : (
                      <div className="w-full py-1.5 bg-cyan-950/80 border border-cyan-400 text-cyan-300 font-bold rounded text-center text-xs">
                        ✓ Personnage Actif en Jeu
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#05070c] border-t border-zinc-800 flex items-center justify-end">
          <button
            onClick={() => {
              playCyberClick();
              onClose();
            }}
            className="px-4 py-1.5 bg-cyan-500 text-black font-bold rounded hover:bg-cyan-400 transition-colors text-xs"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
