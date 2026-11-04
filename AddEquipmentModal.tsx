import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  Check,
  AlertTriangle,
  Sparkles,
  Zap,
  Crosshair,
  Shield,
  Cpu,
  Flame,
  Sword,
  Activity,
  Truck,
  Terminal,
  RotateCcw
} from 'lucide-react';
import {
  EquipmentItem,
  GearCategory,
  GearRarity,
  createDefaultCustomEquipment,
  validateEquipment,
  getSafeImageUrl,
} from '../utils/gearLogic.ts';
import { playCyberClick, playCyberSelect } from '../utils/audio.ts';
import { useEscapeKey } from '../utils/useEscapeKey.ts';

interface AddEquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveEquipment: (item: EquipmentItem) => void;
  editingItem: EquipmentItem | null;
}

// Curated high quality cyberpunk thematic preset photos from Cyberpunk Fandom
const CYBER_PRESET_IMAGES = [
  {
    name: 'Pistolet Semi-Auto (Unity)',
    category: 'handguns',
    url: 'https://static.wikia.nocookie.net/cyberpunk/images/e/ec/Unity_Default.png/revision/latest',
  },
  {
    name: 'Malorian Arms 3516 (Silverhand)',
    category: 'handguns',
    url: 'https://static.wikia.nocookie.net/cyberpunk/images/5/5d/Johnny_Silverhand%27s_Malorian_Database_CP2077.png/revision/latest',
  },
  {
    name: 'Arme Lourde / Revolver Canon (Burya)',
    category: 'heavy',
    url: 'https://static.wikia.nocookie.net/cyberpunk/images/2/21/Burya_Comrade.png/revision/latest',
  },
  {
    name: 'Ba Xing Chong (Adam Smasher)',
    category: 'heavy',
    url: 'https://static.wikia.nocookie.net/cyberpunk/images/2/2a/Zhuo_Eight_Star.png/revision/latest',
  },
  {
    name: 'Fusil Tactique / Sniper (Nekomata)',
    category: 'longarms',
    url: 'https://static.wikia.nocookie.net/cyberpunk/images/2/25/Nekomata_Military.png/revision/latest',
  },
  {
    name: 'Fusil d’Assaut Ajax M251s',
    category: 'longarms',
    url: 'https://static.wikia.nocookie.net/cyberpunk/images/f/f3/Ajax_Default.png/revision/latest',
  },
  {
    name: 'Cyber-Lame / Katana (Satori)',
    category: 'melee',
    url: 'https://static.wikia.nocookie.net/cyberpunk/images/a/a9/Katana_Saburo.png/revision/latest',
  },
  {
    name: 'Katana Thermique (Errata)',
    category: 'melee',
    url: 'https://static.wikia.nocookie.net/cyberpunk/images/6/6e/Katana_E3.png/revision/latest',
  },
  {
    name: 'Implant Neural (Sandevistan Dynalar)',
    category: 'cyberware',
    url: 'https://static.wikia.nocookie.net/cyberpunk/images/6/62/SandevistanC2.png/revision/latest',
  },
  {
    name: 'Militech "Apogee" Sandevistan (Iconique)',
    category: 'cyberware',
    url: 'https://static.wikia.nocookie.net/cyberpunk/images/b/bb/SandevistanApogee.png/revision/latest',
  },
  {
    name: 'Militech Canto Mk.6 (Mur Noir)',
    category: 'cyberware',
    url: 'https://static.wikia.nocookie.net/cyberpunk/images/9/9d/HauntedCyberdeck.png/revision/latest',
  },
  {
    name: 'Lames Mantis MaxTac (Iconiques)',
    category: 'cyberware',
    url: 'https://static.wikia.nocookie.net/cyberpunk/images/8/89/MantisBlades.png/revision/latest',
  },
  {
    name: 'Kiroshi "Cockatrice" Optiques',
    category: 'cyberware',
    url: 'https://static.wikia.nocookie.net/cyberpunk/images/d/df/Iconic_KiroshiOpticsBare.png/revision/latest',
  },
  {
    name: 'Endosquelette Épimorphique',
    category: 'cyberware',
    url: 'https://static.wikia.nocookie.net/cyberpunk/images/c/cb/Endoskeleton.png/revision/latest',
  },
  {
    name: 'Deuxième Cœur Synthétique (Second Heart)',
    category: 'cyberware',
    url: 'https://static.wikia.nocookie.net/cyberpunk/images/1/1e/SecondHeart.png/revision/latest',
  },
  {
    name: 'Chitine Sous-Cutanée (Iconique)',
    category: 'cyberware',
    url: 'https://static.wikia.nocookie.net/cyberpunk/images/7/75/Chiton.png/revision/latest',
  },
  {
    name: 'Camouflage Optique Subdermal',
    category: 'cyberware',
    url: 'https://static.wikia.nocookie.net/cyberpunk/images/e/ec/OpticalCamo.png/revision/latest',
  },
  {
    name: 'Cyber-Optiques (Kiroshi)',
    category: 'cyberware',
    url: 'https://static.wikia.nocookie.net/cyberpunk/images/5/55/KiroshiOptics.png/revision/latest',
  },
  {
    name: 'Veste Edgerunner (David Martinez)',
    category: 'armor',
    url: 'https://static.wikia.nocookie.net/cyberpunk/images/1/1f/MQ049_martinez_jacketM.png/revision/latest',
  },
  {
    name: 'Cuirasse Lourde MaxTac',
    category: 'armor',
    url: 'https://static.wikia.nocookie.net/cyberpunk/images/d/d5/SQ030_MaxTac_ChestM_Icon_CP2077.png/revision/latest',
  },
  {
    name: 'Drone de Sécurité (Octant)',
    category: 'drones_vehicles',
    url: 'https://static.wikia.nocookie.net/cyberpunk/images/1/1a/Zetatech_Octant_Database_CP2077.png/revision/latest',
  },
  {
    name: 'Hypercar Rayfield Caliburn',
    category: 'drones_vehicles',
    url: 'https://static.wikia.nocookie.net/cyberpunk/images/f/fb/Rayfield_Caliburn_Database_CP2077.png/revision/latest',
  },
  {
    name: 'Véhicule de Sport / Moto (Kusanagi)',
    category: 'drones_vehicles',
    url: 'https://static.wikia.nocookie.net/cyberpunk/images/e/ed/Yaiba_Kusanagi_CT-3X_Database_CP2077.png/revision/latest',
  },
  {
    name: 'Cyberdeck NetWatch Netdriver Mk.5',
    category: 'gear_tap',
    url: 'https://static.wikia.nocookie.net/cyberpunk/images/d/d1/NetWatchNetdriver.png/revision/latest',
  },
  {
    name: 'Stimulant Médical / Nano-Soin (MaxDoc)',
    category: 'pharma',
    url: 'https://static.wikia.nocookie.net/cyberpunk/images/9/9b/FirstAidWhiff.png/revision/latest',
  },
];

export const AddEquipmentModal: React.FC<AddEquipmentModalProps> = ({
  isOpen,
  onClose,
  onSaveEquipment,
  editingItem,
}) => {
  const [formData, setFormData] = useState<EquipmentItem>(() => createDefaultCustomEquipment('handguns'));
  const [imageMode, setImageMode] = useState<'url' | 'upload' | 'presets'>('upload');
  const [tagInput, setTagInput] = useState<string>('');
  const [errors, setErrors] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingItem) {
      setFormData(editingItem);
      setTagInput(editingItem.tags.join(', '));
      setImageMode(editingItem.imageUrl.startsWith('data:') ? 'upload' : 'url');
    } else {
      setFormData(createDefaultCustomEquipment('handguns'));
      setTagInput('custom, prototype, fait-main');
      setImageMode('upload');
    }
    setErrors([]);
    setUploadError(null);
  }, [editingItem, isOpen]);

  useEscapeKey(isOpen, onClose);

  if (!isOpen) return null;

  // File upload to base64
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError(null);
    if (!file) return;

    // Check size limit: max 2MB
    if (file.size > 2 * 1024 * 1024) {
      setUploadError('Le fichier image est trop volumineux (max 2 Mo). Veuillez choisir une image compressée.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setFormData((prev) => ({ ...prev, imageUrl: result }));
        playCyberSelect();
      }
    };
    reader.onerror = () => {
      setUploadError('Erreur de lecture du fichier image.');
    };
    reader.readAsDataURL(file);
  };

  const handleCategoryChange = (cat: GearCategory) => {
    playCyberClick();
    const categoryLabels: Record<GearCategory, string> = {
      all: 'Tout',
      handguns: 'Armes de poing',
      longarms: 'Fusils & Mitraillettes',
      heavy: 'Armes Lourdes & Exotiques',
      melee: 'Mêlée & Cyber-lames',
      cyberware: 'Cybermatériel & Implants',
      armor: 'Armures & Protections',
      drones_vehicles: 'Drones & Véhicules',
      gear_tap: 'Netrunning & T-APP',
      pharma: 'Drogues & Soins',
      weapon_mods: "Accessoires & Mods d'armes",
    };

    setFormData((prev) => ({
      ...prev,
      category: cat,
      categoryLabel: categoryLabels[cat] || 'Matériel',
    }));
  };

  const handleRarityChange = (rarity: GearRarity) => {
    playCyberClick();
    const rarityLabels: Record<GearRarity, string> = {
      common: 'Commun',
      uncommon: 'Peu commun',
      rare: 'Rare',
      very_rare: 'Très Rare',
      legendary: 'Exotique / Légendaire',
    };

    setFormData((prev) => ({
      ...prev,
      rarity,
      rarityLabel: rarityLabels[rarity],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedTags = tagInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    const completeItem: EquipmentItem = {
      ...formData,
      isCustom: true,
      origin: 'Création Personnalisée',
      tags: parsedTags.length > 0 ? parsedTags : ['custom'],
    };

    const validation = validateEquipment(completeItem);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    playCyberSelect();
    onSaveEquipment(completeItem);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-equipment-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl my-6 bg-[#0a0d16] border border-cyan-400 rounded shadow-[0_0_50px_rgba(0,240,255,0.25)] text-zinc-200 font-mono overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#050810] border-b border-cyan-500/40 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-cyan-950 border border-cyan-400/60 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest block">
                FORGE DE MATÉRIEL // NIGHT CITY &amp; MALMART 2090
              </span>
              <h2 id="add-equipment-title" className="text-lg font-bold font-['Orbitron',sans-serif] text-zinc-100">
                {editingItem ? `Modifier : ${editingItem.name}` : 'Ajouter un Nouvel Équipement ou Arme'}
              </h2>
            </div>
          </div>
          <button
            onClick={() => {
              playCyberClick();
              onClose();
            }}
            className="p-1.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white"
            aria-label="Fermer la fenêtre d'ajout d'équipement"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6 max-h-[78vh] overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-800">
          {/* Validation errors */}
          {errors.length > 0 && (
            <div className="p-3 bg-red-950/70 border border-red-500 rounded text-xs text-red-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-red-400">
                <AlertTriangle className="w-4 h-4" />
                Veuillez corriger les erreurs suivantes :
              </div>
              <ul className="list-disc pl-5">
                {errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Section 1: Identification & Photo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Left: General Info */}
            <div className="space-y-4">
              <div>
                <label htmlFor="eq-name" className="text-xs font-bold text-cyan-300 block mb-1">
                  Nom de l'équipement *
                </label>
                <input
                  id="eq-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="ex: Arasaka Tsunami Prototype..."
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 focus:border-cyan-400 rounded text-sm text-zinc-100 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="eq-category" className="text-xs font-bold text-cyan-300 block mb-1">Catégorie *</label>
                  <select
                    id="eq-category"
                    value={formData.category}
                    onChange={(e) => handleCategoryChange(e.target.value as GearCategory)}
                    className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-700 rounded text-xs text-zinc-200"
                  >
                    <option value="handguns">Armes de poing</option>
                    <option value="longarms">Fusils &amp; Mitraillettes</option>
                    <option value="heavy">Armes Lourdes &amp; Exotiques</option>
                    <option value="melee">Mêlée &amp; Cyber-lames</option>
                    <option value="weapon_mods">Accessoires &amp; Mods d'armes</option>
                    <option value="cyberware">Cybermatériel &amp; Implants</option>
                    <option value="armor">Armures &amp; Protections</option>
                    <option value="drones_vehicles">Drones &amp; Véhicules</option>
                    <option value="gear_tap">Netrunning &amp; T-APP</option>
                    <option value="pharma">Drogues &amp; Soins</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="eq-rarity" className="text-xs font-bold text-cyan-300 block mb-1">Rareté *</label>
                  <select
                    id="eq-rarity"
                    value={formData.rarity}
                    onChange={(e) => handleRarityChange(e.target.value as GearRarity)}
                    className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-700 rounded text-xs text-zinc-200"
                  >
                    <option value="common">Commun</option>
                    <option value="uncommon">Peu commun</option>
                    <option value="rare">Rare</option>
                    <option value="very_rare">Très Rare</option>
                    <option value="legendary">Exotique / Légendaire</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="eq-manufacturer" className="text-xs font-bold text-cyan-300 block mb-1">
                  Fabricant / Mégacorporation
                </label>
                <input
                  id="eq-manufacturer"
                  type="text"
                  value={formData.manufacturer}
                  onChange={(e) => setFormData((prev) => ({ ...prev, manufacturer: e.target.value }))}
                  placeholder="ex: Arasaka, Militech, Act of God, Atelier Clandestin..."
                  className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-700 rounded text-xs text-zinc-100"
                />
              </div>

              <div>
                <label htmlFor="eq-desc" className="text-xs font-bold text-cyan-300 block mb-1">Description Technique</label>
                <textarea
                  id="eq-desc"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Détails du châssis, fonctionnement mécanique, histoire de l'arme..."
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded text-xs text-zinc-200"
                />
              </div>

              <div>
                <label htmlFor="eq-quote" className="text-xs font-bold text-zinc-400 block mb-1">Citation d'ambiance (Optionnel)</label>
                <input
                  id="eq-quote"
                  type="text"
                  value={formData.flavorQuote || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, flavorQuote: e.target.value }))}
                  placeholder="« Tirer d'abord, négocier ensuite... »"
                  className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-xs text-zinc-400 italic"
                />
              </div>
            </div>

            {/* Right: PHOTO & IMAGE MANAGEMENT */}
            <div className="bg-zinc-950 border border-cyan-900/60 rounded p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-cyan-400" />
                  PHOTO DE L'ÉQUIPEMENT
                </span>
                <div className="flex items-center gap-1 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setImageMode('upload')}
                    className={`px-2 py-0.5 rounded ${
                      imageMode === 'upload' ? 'bg-cyan-500 text-black font-bold' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Fichier
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageMode('presets')}
                    className={`px-2 py-0.5 rounded ${
                      imageMode === 'presets' ? 'bg-cyan-500 text-black font-bold' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Presets
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageMode('url')}
                    className={`px-2 py-0.5 rounded ${
                      imageMode === 'url' ? 'bg-cyan-500 text-black font-bold' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Lien URL
                  </button>
                </div>
              </div>

              {/* Image Preview Window */}
              <div className="relative h-44 rounded overflow-hidden border border-zinc-800 bg-[#05070a] flex items-center justify-center">
                {formData.imageUrl ? (
                  <img
                    src={getSafeImageUrl(formData.imageUrl)}
                    alt="Aperçu photo"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <div className="text-center p-4 text-zinc-600">
                    <ImageIcon className="w-10 h-10 mx-auto mb-1 stroke-1" />
                    <span className="text-xs block">AUCUNE PHOTO ASSIGNÉE</span>
                    <span className="text-[10px] text-zinc-700">Choisissez un fichier, un lien ou un preset</span>
                  </div>
                )}
                {formData.imageUrl && (
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, imageUrl: '' }))}
                    className="absolute top-2 right-2 p-1 rounded bg-black/80 text-zinc-400 hover:text-red-400 border border-zinc-700"
                    title="Supprimer la photo"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Upload mode */}
              {imageMode === 'upload' && (
                <div className="space-y-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-photo-upload"
                  />
                  <label
                    htmlFor="file-photo-upload"
                    className="w-full py-2.5 px-3 rounded bg-zinc-900 border border-dashed border-cyan-500/60 hover:border-cyan-400 text-cyan-300 hover:text-cyan-200 cursor-pointer flex items-center justify-center gap-2 text-xs transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Sélectionner une photo depuis votre appareil</span>
                  </label>
                  {uploadError && <p className="text-[11px] text-red-400">{uploadError}</p>}
                  <p className="text-[10px] text-zinc-500">
                    Formats acceptés : PNG, JPEG, WebP, GIF (max 2 Mo). L'image est automatiquement encodée et sauvegardée en local.
                  </p>
                </div>
              )}

              {/* Presets mode */}
              {imageMode === 'presets' && (
                <div className="space-y-2">
                  <div className="text-[11px] text-zinc-400 mb-1">
                    Sélectionnez un visuel cyberpunk prédéfini :
                  </div>
                  <div className="grid grid-cols-3 gap-2 max-h-36 overflow-y-auto p-1 border border-zinc-800 rounded scrollbar-thin scrollbar-thumb-zinc-700">
                    {CYBER_PRESET_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, imageUrl: preset.url }));
                          playCyberClick();
                        }}
                        className={`relative rounded overflow-hidden border text-left group p-1 transition-all ${
                          formData.imageUrl === preset.url
                            ? 'border-cyan-400 ring-1 ring-cyan-400 bg-cyan-950/40'
                            : 'border-zinc-800 hover:border-zinc-600 bg-zinc-900'
                        }`}
                      >
                        <img
                          src={getSafeImageUrl(preset.url)}
                          alt={preset.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-12 object-contain bg-black/40 rounded p-1"
                        />
                        <span className="text-[9px] text-zinc-300 truncate block mt-1">
                          {preset.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* URL mode */}
              {imageMode === 'url' && (
                <div className="space-y-2">
                  <label htmlFor="image-url-input" className="text-[11px] text-zinc-400 block">URL directe de l'image</label>
                  <input
                    id="image-url-input"
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))}
                    placeholder="https://... (PNG, JPG, WebP)"
                    className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-700 rounded text-xs text-zinc-200"
                  />
                  <p className="text-[10px] text-zinc-500">
                    Collez une URL d'image publique (ex: Cyberpunk Fandom Wiki, Unsplash...).
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Dual Game Rules Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Cyberpunk RED Config */}
            <div className="bg-gradient-to-b from-[#12080c] to-zinc-950 border border-red-500/40 rounded p-4 space-y-3">
              <div className="text-xs font-bold text-red-400 uppercase tracking-wider border-b border-red-950 pb-1.5 flex items-center justify-between">
                <span>RÈGLES CYBERPUNK RED</span>
                <span className="text-[10px] text-zinc-500">Night City 2045-2077</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="red-price" className="text-[11px] text-zinc-400 block mb-0.5">Prix (€$ Eurodollars)</label>
                  <input
                    id="red-price"
                    type="number"
                    min="0"
                    value={formData.red.priceEb}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        red: { ...prev.red, priceEb: parseInt(e.target.value, 10) || 0 },
                      }))
                    }
                    className="w-full px-2.5 py-1.5 bg-black border border-red-900 rounded text-xs text-amber-300 font-bold"
                  />
                </div>
                <div>
                  <label htmlFor="red-avail" className="text-[11px] text-zinc-400 block mb-0.5">Disponibilité</label>
                  <input
                    id="red-avail"
                    type="text"
                    value={formData.red.availability}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        red: { ...prev.red, availability: e.target.value },
                      }))
                    }
                    placeholder="Partout, Coûteux, Cher..."
                    className="w-full px-2.5 py-1.5 bg-black border border-red-900 rounded text-xs text-zinc-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="red-damage" className="text-[11px] text-zinc-400 block mb-0.5">Dégâts RED (ex: 3d6, 5d6)</label>
                  <input
                    id="red-damage"
                    type="text"
                    value={formData.red.damage || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        red: { ...prev.red, damage: e.target.value },
                      }))
                    }
                    placeholder="3d6, 4d6, 5d6..."
                    className="w-full px-2.5 py-1.5 bg-black border border-red-900 rounded text-xs text-red-300 font-bold"
                  />
                </div>
                <div>
                  <label htmlFor="red-rof" className="text-[11px] text-zinc-400 block mb-0.5">Cadence (ROF)</label>
                  <select
                    id="red-rof"
                    value={formData.red.rof ?? 1}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        red: { ...prev.red, rof: parseInt(e.target.value, 10) },
                      }))
                    }
                    className="w-full px-2.5 py-1.5 bg-black border border-red-900 rounded text-xs text-zinc-200"
                  >
                    <option value="1">ROF 1 (1 coup/tour)</option>
                    <option value="2">ROF 2 (2 coups/tour)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label htmlFor="red-mag" className="text-[10px] text-zinc-400 block mb-0.5">Chargeur</label>
                  <input
                    id="red-mag"
                    type="number"
                    min="1"
                    value={formData.red.magazine || 10}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        red: { ...prev.red, magazine: parseInt(e.target.value, 10) || 1 },
                      }))
                    }
                    className="w-full px-2 py-1 bg-black border border-zinc-800 rounded text-xs text-zinc-200"
                  />
                </div>
                <div>
                  <label htmlFor="red-sp" className="text-[10px] text-zinc-400 block mb-0.5">SP (Armure)</label>
                  <input
                    id="red-sp"
                    type="number"
                    min="0"
                    value={formData.red.sp || 0}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        red: { ...prev.red, sp: parseInt(e.target.value, 10) || undefined },
                      }))
                    }
                    placeholder="SP 11..."
                    className="w-full px-2 py-1 bg-black border border-zinc-800 rounded text-xs text-emerald-400 font-bold"
                  />
                </div>
                <div>
                  <label htmlFor="red-ph" className="text-[10px] text-zinc-400 block mb-0.5">PH (Humanité)</label>
                  <input
                    id="red-ph"
                    type="text"
                    value={formData.red.humanityLoss || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        red: { ...prev.red, humanityLoss: e.target.value },
                      }))
                    }
                    placeholder="2d6 (7)..."
                    className="w-full px-2 py-1 bg-black border border-zinc-800 rounded text-xs text-fuchsia-400 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
                  <input
                    type="checkbox"
                    checked={formData.red.concealable}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        red: { ...prev.red, concealable: e.target.checked },
                      }))
                    }
                    className="accent-red-500 rounded"
                  />
                  <span>Dissimulable sous veste / manteau</span>
                </label>
              </div>
            </div>

            {/* SWADE / Interface Zéro 2.0 Config */}
            <div className="bg-gradient-to-b from-[#141008] to-zinc-950 border border-amber-500/40 rounded p-4 space-y-3">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider border-b border-amber-950 pb-1.5 flex items-center justify-between">
                <span>RÈGLES SWADE &amp; INTERFACE ZÉRO</span>
                <span className="text-[10px] text-zinc-500">Malmart 2090</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="iz-price" className="text-[11px] text-zinc-400 block mb-0.5">Prix (c$ Crédits)</label>
                  <input
                    id="iz-price"
                    type="number"
                    min="0"
                    value={formData.iz.priceCredits}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        iz: { ...prev.iz, priceCredits: parseInt(e.target.value, 10) || 0 },
                      }))
                    }
                    className="w-full px-2.5 py-1.5 bg-black border border-amber-900 rounded text-xs text-cyan-300 font-bold"
                  />
                </div>
                <div>
                  <label htmlFor="iz-qual" className="text-[11px] text-zinc-400 block mb-0.5">Qualité SWADE</label>
                  <select
                    id="iz-qual"
                    value={formData.iz.quality}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        iz: {
                          ...prev.iz,
                          quality: e.target.value as 'Gutterware' | 'Streetware' | 'Hyperchrome' | 'Milware' | 'Standard' | 'Corpware' | 'Bioware',
                        },
                      }))
                    }
                    className="w-full px-2.5 py-1.5 bg-black border border-amber-900 rounded text-xs text-zinc-200"
                  >
                    <option value="Streetware">Streetware (Standard)</option>
                    <option value="Corpware">Corpware (Haute Corpo)</option>
                    <option value="Milware">Milware (Militaire)</option>
                    <option value="Hyperchrome">Hyperchrome (Luxe)</option>
                    <option value="Bioware">Bioware (Biologique)</option>
                    <option value="Gutterware">Gutterware (Bas étage)</option>
                    <option value="Standard">Standard</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label htmlFor="iz-dmg" className="text-[10px] text-zinc-400 block mb-0.5">Dégâts SWADE</label>
                  <input
                    id="iz-dmg"
                    type="text"
                    value={formData.iz.damage || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        iz: { ...prev.iz, damage: e.target.value },
                      }))
                    }
                    placeholder="2d6, 2d8+1..."
                    className="w-full px-2 py-1 bg-black border border-amber-900 rounded text-xs text-amber-300 font-bold"
                  />
                </div>
                <div>
                  <label htmlFor="iz-ap" className="text-[10px] text-zinc-400 block mb-0.5">PA (Armor Piercing)</label>
                  <input
                    id="iz-ap"
                    type="number"
                    min="0"
                    value={formData.iz.ap || 0}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        iz: { ...prev.iz, ap: parseInt(e.target.value, 10) || 0 },
                      }))
                    }
                    className="w-full px-2 py-1 bg-black border border-amber-900 rounded text-xs text-orange-400 font-bold"
                  />
                </div>
                <div>
                  <label htmlFor="iz-weight" className="text-[10px] text-zinc-400 block mb-0.5">Poids (kg)</label>
                  <input
                    id="iz-weight"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.iz.weightKg}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        iz: { ...prev.iz, weightKg: parseFloat(e.target.value) || 0 },
                      }))
                    }
                    className="w-full px-2 py-1 bg-black border border-zinc-800 rounded text-xs text-zinc-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="iz-range" className="text-[11px] text-zinc-400 block mb-0.5">Portée (cases)</label>
                  <input
                    id="iz-range"
                    type="text"
                    value={formData.iz.range || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        iz: { ...prev.iz, range: e.target.value },
                      }))
                    }
                    placeholder="12/24/48 ou Mêlée..."
                    className="w-full px-2 py-1 bg-black border border-zinc-800 rounded text-xs text-zinc-200"
                  />
                </div>
                <div>
                  <label htmlFor="iz-cyb" className="text-[11px] text-zinc-400 block mb-0.5">Cybertension (Vigueur)</label>
                  <input
                    id="iz-cyb"
                    type="number"
                    min="0"
                    value={formData.iz.cybertension || 0}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        iz: { ...prev.iz, cybertension: parseInt(e.target.value, 10) || 0 },
                      }))
                    }
                    className="w-full px-2 py-1 bg-black border border-zinc-800 rounded text-xs text-purple-400 font-bold"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="iz-notes" className="text-[11px] text-zinc-400 block mb-0.5">Notes de règles SWADE</label>
                <input
                  id="iz-notes"
                  type="text"
                  value={formData.iz.notes}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      iz: { ...prev.iz, notes: e.target.value },
                    }))
                  }
                  placeholder="Règles SWADE : PA 2, Tir auto, Arme lourde, etc."
                  className="w-full px-2.5 py-1.5 bg-black border border-zinc-800 rounded text-xs text-zinc-300"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Tags */}
          <div>
            <label htmlFor="eq-tags" className="text-xs font-bold text-zinc-400 block mb-1">Tags (séparés par des virgules)</label>
            <input
              id="eq-tags"
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="smartgun, titan, sur-mesure, militech..."
              className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-xs text-zinc-300"
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-zinc-800 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                playCyberClick();
                onClose();
              }}
              className="px-4 py-2 rounded text-xs text-zinc-400 hover:text-white border border-zinc-800 hover:bg-zinc-900 transition-colors"
            >
              Annuler
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black border border-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.3)] flex items-center gap-2 transition-all"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{editingItem ? 'Enregistrer les Modifications' : 'Sauvegarder l’Équipement dans le Compendium'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
