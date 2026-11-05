import { EquipmentItem } from './gearLogic.ts';
import { EQUIPMENT_DATABASE } from '../data/equipmentData.ts';
import { PlayerProfile, InventoryItem, EquipmentSlot, ShopTransactionResult } from '../types/playerProfile.ts';

const PROFILES_STORAGE_KEY = 'tech_compendium_player_profiles_v1';
const ACTIVE_PROFILE_STORAGE_KEY = 'tech_compendium_active_profile_id_v1';

/**
 * Starter profiles so players can immediately test the virtual shop & gear management
 */
export const DEFAULT_PROFILES: PlayerProfile[] = [
  {
    id: 'profile-v-solo',
    name: 'Vincent "V" Valenti',
    handle: 'V // Solo de Night City',
    role: 'Solo / Mercenaire',
    avatarColor: '#00f0ff',
    systemPreference: 'both',
    walletEb: 12500,
    walletCredits: 22000,
    maxWeightKg: 45,
    maxCybertension: 10,
    maxHumanity: 60,
    currentHumanity: 52,
    inventory: [
      {
        id: 'inv-v-1',
        equipmentId: 'malorian-3516',
        item: EQUIPMENT_DATABASE.find((i) => i.id === 'malorian-3516') || {
          id: 'malorian-3516',
          name: 'Malorian Arms 3516',
          category: 'handguns',
          categoryLabel: 'Armes de poing',
          rarity: 'legendary',
          rarityLabel: 'Exotique / Légendaire',
          manufacturer: 'Malorian Arms',
          origin: 'Cyberpunk Wiki',
          description: 'Arme de poing iconique de Johnny Silverhand.',
          imageUrl: '',
          fallbackIcon: 'Crosshair',
          red: { priceEb: 10000, availability: 'Exotique', damage: '4d6+2', rof: 1, ammo: '14mm custom', magazine: 8, concealable: false },
          iz: { priceCredits: 12000, quality: 'Milware', cybertension: 2, damage: '2d10', range: '15/30/60', ap: 4, weightKg: 3.2, notes: 'PA 4, Semi-auto.' },
          tags: ['iconique'],
        },
        quantity: 1,
        equipped: true,
        slot: 'weapon_primary',
        purchasePriceEb: 10000,
        purchasePriceCredits: 12000,
        acquiredAt: new Date().toISOString(),
      },
      {
        id: 'inv-v-2',
        equipmentId: 'sandevistan-dynalar',
        item: EQUIPMENT_DATABASE.find((i) => i.id === 'sandevistan-dynalar') || {
          id: 'sandevistan-dynalar',
          name: 'Sandevistan Dynalar Mk.4',
          category: 'cyberware',
          categoryLabel: 'Cybermatériel & Implants',
          rarity: 'legendary',
          rarityLabel: 'Exotique / Légendaire',
          manufacturer: 'Dynalar Technologies',
          origin: 'Cyberpunk Wiki',
          description: 'Accélérateur neural cybernétique.',
          imageUrl: '',
          fallbackIcon: 'Zap',
          red: { priceEb: 5000, availability: 'Exotique', humanityLoss: '3d6 (10)', installReq: 'Clinique', concealable: true },
          iz: { priceCredits: 14000, quality: 'Milware', cybertension: 3, weightKg: 0.8, notes: 'Accélérateur de réflexes.' },
          tags: ['sandevistan'],
        },
        quantity: 1,
        equipped: true,
        slot: 'cyberware_neural',
        purchasePriceEb: 5000,
        purchasePriceCredits: 14000,
        acquiredAt: new Date().toISOString(),
      },
    ],
    notes: 'Mercenaire d’élite de Night City. Équipement optimisé pour les combats rapprochés et la vitesse pure.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'profile-lucy-netrunner',
    name: 'Kushinada "Lucy"',
    handle: 'DeepDive // Netrunner',
    role: 'Netrunner / Spécialiste Cyberespace',
    avatarColor: '#ec4899',
    systemPreference: 'both',
    walletEb: 18000,
    walletCredits: 35000,
    maxWeightKg: 30,
    maxCybertension: 8,
    maxHumanity: 65,
    currentHumanity: 58,
    inventory: [
      {
        id: 'inv-lucy-1',
        equipmentId: 'monowire-classic',
        item: EQUIPMENT_DATABASE.find((i) => i.id === 'monowire-classic') || {
          id: 'monowire-classic',
          name: 'Monocâble Cybernétique (Monowire)',
          category: 'melee',
          categoryLabel: 'Mêlée & Cyber-lames',
          rarity: 'rare',
          rarityLabel: 'Rare',
          manufacturer: 'Arasaka Cyber-Armory',
          origin: 'Cyberpunk Wiki',
          description: 'Fouet monomoléculaire dissimulé dans l’avant-bras.',
          imageUrl: '',
          fallbackIcon: 'Sword',
          red: { priceEb: 2500, availability: 'Rare', damage: '3d6+2', rof: 2, concealable: true },
          iz: { priceCredits: 5000, quality: 'Hyperchrome', cybertension: 1, damage: 'Str+d8', weightKg: 0.5, notes: 'PA 4.' },
          tags: ['monocable'],
        },
        quantity: 1,
        equipped: true,
        slot: 'weapon_primary',
        purchasePriceEb: 2500,
        purchasePriceCredits: 5000,
        acquiredAt: new Date().toISOString(),
      },
    ],
    notes: 'Spécialiste en intrusion informatique et neutralisation discrète par Monocâble.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'profile-dex-tech',
    name: 'Goro "Fixer" Tanaka',
    handle: 'Fixer & Tech d’Atlantica',
    role: 'Fixer / Fabricant Marché Noir',
    avatarColor: '#eab308',
    systemPreference: 'iz',
    walletEb: 30000,
    walletCredits: 75000,
    maxWeightKg: 50,
    maxCybertension: 12,
    maxHumanity: 55,
    currentHumanity: 50,
    inventory: [],
    notes: 'Négociant et armurier clandestin. Dispose de contacts avec Malmart 2090 et les corporations majeures.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/**
 * Load all profiles from localStorage
 */
export function loadProfiles(): PlayerProfile[] {
  try {
    const raw = localStorage.getItem(PROFILES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }
  // Initialize with defaults if empty
  saveProfiles(DEFAULT_PROFILES);
  return DEFAULT_PROFILES;
}

/**
 * Save all profiles to localStorage
 */
export function saveProfiles(profiles: PlayerProfile[]): void {
  try {
    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
  } catch {
    // ignore
  }
}

/**
 * Get active profile ID
 */
export function getActiveProfileId(): string {
  try {
    const active = localStorage.getItem(ACTIVE_PROFILE_STORAGE_KEY);
    if (active) return active;
  } catch {
    // ignore
  }
  return DEFAULT_PROFILES[0].id;
}

/**
 * Set active profile ID
 */
export function setActiveProfileId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_PROFILE_STORAGE_KEY, id);
  } catch {
    // ignore
  }
}

/**
 * Get active player profile
 */
export function getActiveProfile(): PlayerProfile {
  const profiles = loadProfiles();
  const activeId = getActiveProfileId();
  const found = profiles.find((p) => p.id === activeId);
  if (found) return found;
  if (profiles.length > 0) {
    setActiveProfileId(profiles[0].id);
    return profiles[0];
  }
  const starter = DEFAULT_PROFILES[0];
  saveProfiles([starter]);
  setActiveProfileId(starter.id);
  return starter;
}

/**
 * Create a new player profile
 */
export function createProfile(data: Partial<PlayerProfile>): PlayerProfile {
  const profiles = loadProfiles();
  const id = `profile-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  const newProfile: PlayerProfile = {
    id,
    name: data.name?.trim() || 'Nouveau Mercenaire',
    handle: data.handle?.trim() || 'Edgerunner',
    role: data.role || 'Solo',
    avatarColor: data.avatarColor || '#00f0ff',
    systemPreference: data.systemPreference || 'both',
    walletEb: data.walletEb ?? 5000,
    walletCredits: data.walletCredits ?? 10000,
    maxWeightKg: data.maxWeightKg ?? 40,
    maxCybertension: data.maxCybertension ?? 8,
    maxHumanity: data.maxHumanity ?? 60,
    currentHumanity: data.currentHumanity ?? (data.maxHumanity ?? 60),
    inventory: data.inventory || [],
    notes: data.notes || '',
    createdAt: now,
    updatedAt: now,
  };

  const updated = [...profiles, newProfile];
  saveProfiles(updated);
  setActiveProfileId(id);
  return newProfile;
}

/**
 * Update an existing player profile
 */
export function updateProfile(id: string, updates: Partial<PlayerProfile>): PlayerProfile | null {
  const profiles = loadProfiles();
  const idx = profiles.findIndex((p) => p.id === id);
  if (idx === -1) return null;

  const current = profiles[idx];
  const updated: PlayerProfile = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  profiles[idx] = updated;
  saveProfiles(profiles);
  return updated;
}

/**
 * Delete a profile
 */
export function deleteProfile(id: string): { remaining: PlayerProfile[]; nextActiveId: string } {
  const profiles = loadProfiles();
  const filtered = profiles.filter((p) => p.id !== id);

  if (filtered.length === 0) {
    // Do not leave empty; restore default
    saveProfiles(DEFAULT_PROFILES);
    setActiveProfileId(DEFAULT_PROFILES[0].id);
    return { remaining: DEFAULT_PROFILES, nextActiveId: DEFAULT_PROFILES[0].id };
  }

  saveProfiles(filtered);
  const currentActive = getActiveProfileId();
  const nextActive = currentActive === id ? filtered[0].id : currentActive;
  setActiveProfileId(nextActive);
  return { remaining: filtered, nextActiveId: nextActive };
}

/**
 * Calculate live equipment stats for a profile
 */
export function calculateProfileStats(profile: PlayerProfile): {
  totalCarriedWeightKg: number;
  totalCybertension: number;
  totalHumanityLoss: number;
  equippedWeaponsCount: number;
  equippedArmorSpTotal: number;
  isOverweight: boolean;
  isCyberOverloaded: boolean;
  totalValueEb: number;
  totalValueCredits: number;
} {
  let totalCarriedWeightKg = 0;
  let totalCybertension = 0;
  let totalHumanityLoss = 0;
  let equippedWeaponsCount = 0;
  let equippedArmorSpTotal = 0;
  let totalValueEb = 0;
  let totalValueCredits = 0;

  profile.inventory.forEach((inv) => {
    const item = inv.item;
    const qty = inv.quantity || 1;
    const priceEb = (item.red?.priceEb || 0) * qty;
    const priceCredits = (item.iz?.priceCredits || 0) * qty;
    totalValueEb += priceEb;
    totalValueCredits += priceCredits;

    // Items in stash do NOT count toward carry weight
    if (inv.slot !== 'stash') {
      const weight = (item.iz?.weightKg || 0) * qty;
      totalCarriedWeightKg += weight;
    }

    // Only installed/equipped cyberware triggers cybertension & humanity loss
    if (inv.equipped && item.category === 'cyberware') {
      totalCybertension += (item.iz?.cybertension || 0) * qty;
      
      // Rough parse of humanity loss: e.g. "2d6 (7)" -> 7
      if (item.red?.humanityLoss) {
        const match = item.red.humanityLoss.match(/\((\d+)\)/);
        if (match && match[1]) {
          totalHumanityLoss += parseInt(match[1], 10) * qty;
        } else {
          totalHumanityLoss += 4 * qty;
        }
      }
    }

    if (inv.equipped && (item.category === 'handguns' || item.category === 'longarms' || item.category === 'heavy' || item.category === 'melee')) {
      equippedWeaponsCount += qty;
    }

    if (inv.equipped && item.category === 'armor') {
      equippedArmorSpTotal += (item.red?.sp || 0);
    }
  });

  return {
    totalCarriedWeightKg: Math.round(totalCarriedWeightKg * 10) / 10,
    totalCybertension,
    totalHumanityLoss,
    equippedWeaponsCount,
    equippedArmorSpTotal,
    isOverweight: totalCarriedWeightKg > profile.maxWeightKg,
    isCyberOverloaded: totalCybertension > profile.maxCybertension,
    totalValueEb,
    totalValueCredits,
  };
}

/**
 * Buy an item in the Virtual Shop
 */
export function buyItem(
  profileId: string,
  item: EquipmentItem,
  currency: 'eb' | 'credits' = 'eb',
  quantity = 1
): ShopTransactionResult {
  const profiles = loadProfiles();
  const profile = profiles.find((p) => p.id === profileId);
  if (!profile) {
    return { success: false, message: 'Profil introuvable.' };
  }

  const cost = currency === 'eb' ? (item.red.priceEb || 0) * quantity : (item.iz.priceCredits || 0) * quantity;
  const currentFunds = currency === 'eb' ? profile.walletEb : profile.walletCredits;

  if (currentFunds < cost) {
    const symbol = currency === 'eb' ? '€$' : 'c$';
    return {
      success: false,
      message: `Fonds insuffisants ! Solde actuel : ${currentFunds.toLocaleString('fr-FR')} ${symbol}, Coût : ${cost.toLocaleString('fr-FR')} ${symbol}.`,
    };
  }

  // Deduct funds
  const newWalletEb = currency === 'eb' ? profile.walletEb - cost : profile.walletEb;
  const newWalletCredits = currency === 'credits' ? profile.walletCredits - cost : profile.walletCredits;

  // Check if item already exists in inventory (stackable)
  const existingIdx = profile.inventory.findIndex(
    (inv) => inv.equipmentId === item.id && !inv.equipped && inv.slot !== 'stash'
  );

  let updatedInventory: InventoryItem[];

  if (existingIdx !== -1) {
    updatedInventory = [...profile.inventory];
    updatedInventory[existingIdx] = {
      ...updatedInventory[existingIdx],
      quantity: updatedInventory[existingIdx].quantity + quantity,
    };
  } else {
    // Determine default slot
    let slot: EquipmentSlot = 'backpack';
    if (item.category === 'handguns' || item.category === 'longarms' || item.category === 'heavy' || item.category === 'melee') {
      slot = 'weapon_primary';
    } else if (item.category === 'armor') {
      slot = 'armor_body';
    } else if (item.category === 'cyberware') {
      slot = 'cyberware_body';
    }

    const newInvItem: InventoryItem = {
      id: `inv-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      equipmentId: item.id,
      item,
      quantity,
      equipped: false,
      slot,
      purchasePriceEb: item.red.priceEb || 0,
      purchasePriceCredits: item.iz.priceCredits || 0,
      acquiredAt: new Date().toISOString(),
    };

    updatedInventory = [newInvItem, ...profile.inventory];
  }

  const updatedProfile = updateProfile(profileId, {
    walletEb: newWalletEb,
    walletCredits: newWalletCredits,
    inventory: updatedInventory,
  });

  return {
    success: true,
    message: `Acquisition réussie : ${item.name} (x${quantity}) ajouté à votre paquetage !`,
    updatedProfile: updatedProfile || undefined,
  };
}

/**
 * Sell an item back to the virtual shop
 */
export function sellItem(
  profileId: string,
  inventoryItemId: string,
  currency: 'eb' | 'credits' = 'eb',
  resellRate = 0.6 // 60% standard resell rate in Night City / Malmart
): ShopTransactionResult {
  const profiles = loadProfiles();
  const profile = profiles.find((p) => p.id === profileId);
  if (!profile) {
    return { success: false, message: 'Profil introuvable.' };
  }

  const invItem = profile.inventory.find((i) => i.id === inventoryItemId);
  if (!invItem) {
    return { success: false, message: 'Objet introuvable dans l’inventaire.' };
  }

  const basePrice = currency === 'eb' ? (invItem.item.red.priceEb || invItem.purchasePriceEb || 0) : (invItem.item.iz.priceCredits || invItem.purchasePriceCredits || 0);
  const payout = Math.max(1, Math.round(basePrice * resellRate));

  let updatedInventory: InventoryItem[];
  if (invItem.quantity > 1) {
    updatedInventory = profile.inventory.map((i) =>
      i.id === inventoryItemId ? { ...i, quantity: i.quantity - 1 } : i
    );
  } else {
    updatedInventory = profile.inventory.filter((i) => i.id !== inventoryItemId);
  }

  const newWalletEb = currency === 'eb' ? profile.walletEb + payout : profile.walletEb;
  const newWalletCredits = currency === 'credits' ? profile.walletCredits + payout : profile.walletCredits;

  const updatedProfile = updateProfile(profileId, {
    walletEb: newWalletEb,
    walletCredits: newWalletCredits,
    inventory: updatedInventory,
  });

  const symbol = currency === 'eb' ? '€$' : 'c$';
  return {
    success: true,
    message: `Vente effectuée : +${payout.toLocaleString('fr-FR')} ${symbol} crédités pour ${invItem.item.name} !`,
    updatedProfile: updatedProfile || undefined,
  };
}

/**
 * Toggle equip status of an inventory item
 */
export function toggleEquipItem(profileId: string, inventoryItemId: string): PlayerProfile | null {
  const profiles = loadProfiles();
  const profile = profiles.find((p) => p.id === profileId);
  if (!profile) return null;

  const invItem = profile.inventory.find((i) => i.id === inventoryItemId);
  if (!invItem) return null;

  const nextEquipped = !invItem.equipped;
  const updatedInventory = profile.inventory.map((i) => {
    if (i.id === inventoryItemId) {
      return {
        ...i,
        equipped: nextEquipped,
        // if moving to equipped, ensure slot is not stash
        slot: nextEquipped && i.slot === 'stash' ? 'backpack' : i.slot,
      };
    }
    return i;
  });

  return updateProfile(profileId, { inventory: updatedInventory });
}

/**
 * Move item between active inventory and personal stash / hideout
 */
export function toggleStashItem(profileId: string, inventoryItemId: string): PlayerProfile | null {
  const profiles = loadProfiles();
  const profile = profiles.find((p) => p.id === profileId);
  if (!profile) return null;

  const invItem = profile.inventory.find((i) => i.id === inventoryItemId);
  if (!invItem) return null;

  const isStash = invItem.slot === 'stash';
  const updatedInventory = profile.inventory.map((i) => {
    if (i.id === inventoryItemId) {
      return {
        ...i,
        equipped: false,
        slot: (isStash ? 'backpack' : 'stash') as EquipmentSlot,
      };
    }
    return i;
  });

  return updateProfile(profileId, { inventory: updatedInventory });
}

/**
 * Adjust wallet directly (mission rewards, bribes, black market fees)
 */
export function adjustWallet(profileId: string, deltaEb: number, deltaCredits: number): PlayerProfile | null {
  const profiles = loadProfiles();
  const profile = profiles.find((p) => p.id === profileId);
  if (!profile) return null;

  const newEb = Math.max(0, profile.walletEb + deltaEb);
  const newCredits = Math.max(0, profile.walletCredits + deltaCredits);

  return updateProfile(profileId, { walletEb: newEb, walletCredits: newCredits });
}

/**
 * Export a profile to a standalone JSON file
 */
export function exportProfileToJson(profile: PlayerProfile): string {
  return JSON.stringify(
    {
      format: 'tech-compendium-player-profile',
      version: '2.0',
      exportedAt: new Date().toISOString(),
      profile,
    },
    null,
    2
  );
}

/**
 * Import a profile from JSON string
 */
export function importProfileFromJson(jsonStr: string): PlayerProfile {
  const parsed = JSON.parse(jsonStr);
  const profileData: Partial<PlayerProfile> = parsed.profile || parsed;

  if (!profileData.name) {
    throw new Error('Format de profil invalide : nom manquant.');
  }

  return createProfile({
    ...profileData,
    name: `${profileData.name} (Importé)`,
  });
}

/**
 * Cyberpunk Archetype Presets for rapid player profile creation
 */
export interface ArchetypePreset {
  id: string;
  label: string;
  role: string;
  suggestedHandle: string;
  walletEb: number;
  walletCredits: number;
  maxWeightKg: number;
  maxCybertension: number;
  avatarColor: string;
  starterEquipmentIds: string[];
  description: string;
  notes: string;
}

export const ARCHETYPE_PRESETS: ArchetypePreset[] = [
  {
    id: 'solo',
    label: 'Solo / Mercenaire',
    role: 'Solo / Mercenaire',
    suggestedHandle: 'Ironclad // Solo Assaut',
    walletEb: 8500,
    walletCredits: 16000,
    maxWeightKg: 45,
    maxCybertension: 9,
    avatarColor: '#ef4444',
    starterEquipmentIds: ['malorian-3516', 'rs-bulwark-riot', 'sandevistan-dynalar'],
    description: 'Spécialiste du combat lourd, maîtrise des armes à feu et réflexes cybernétiques augmentés.',
    notes: 'Mercenaire d\'élite de Night City. Réflexes augmentés par Sandevistan et blindage corporel renforcé.',
  },
  {
    id: 'netrunner',
    label: 'Netrunner / Deep Dive',
    role: 'Netrunner / Spécialiste Cyberespace',
    suggestedHandle: 'Ghost Protocol // Deep Dive',
    walletEb: 12000,
    walletCredits: 26000,
    maxWeightKg: 30,
    maxCybertension: 12,
    avatarColor: '#00f0ff',
    starterEquipmentIds: ['monowire-classic', 'arasaka-hjke11-yukimura'],
    description: 'Expert de la guerre électronique, intrusion de sous-réseaux corpos et manipulation de cyberware.',
    notes: 'Netrunner indépendant. Préfère l\'infiltration furtive, le piratage rapide et les éliminations au monocâble.',
  },
  {
    id: 'tech',
    label: 'Tech / Fabricant',
    role: 'Tech / Fabricant Marché Noir',
    suggestedHandle: 'NanoForge // Armurier Clandestin',
    walletEb: 10000,
    walletCredits: 20000,
    maxWeightKg: 50,
    maxCybertension: 8,
    avatarColor: '#f59e0b',
    starterEquipmentIds: ['kang-tao-dian', 'gorilla-arms-arasaka'],
    description: 'Ingénieur d\'armement clandestin, réparation de cyberware et optimisation balistique de pointe.',
    notes: 'Atelier mobile d\'armurier clandestin. Connaissances avancées en micro-électronique et cyber-implants.',
  },
  {
    id: 'fixer',
    label: 'Fixer / Négociant',
    role: 'Fixer / Négociant',
    suggestedHandle: 'NightCity Broker // Fixer',
    walletEb: 25000,
    walletCredits: 55000,
    maxWeightKg: 35,
    maxCybertension: 6,
    avatarColor: '#10b981',
    starterEquipmentIds: ['arasaka-hjke11-yukimura', 'rs-bulwark-riot'],
    description: 'Réseau d\'informateurs et intermédiaires entre corporations, gangs de rue et mercenaires.',
    notes: 'Opérateur d\'influence et banquier occulte. Dispose de multiples comptes offshore et d\'un carnet d\'adresses d\'or.',
  },
  {
    id: 'nomad',
    label: 'Nomad / Pilote',
    role: 'Nomad / Pilote des Badlands',
    suggestedHandle: 'DustStorm // Clan Aldecaldo',
    walletEb: 6500,
    walletCredits: 13000,
    maxWeightKg: 45,
    maxCybertension: 8,
    avatarColor: '#f97316',
    starterEquipmentIds: ['tsunami-nekomata', 'rs-bulwark-riot'],
    description: 'Expert de la survie dans le désert, convoyeur de blindés et tireur embusqué longue portée.',
    notes: 'Vétéran des routes des Badlands. Loyal envers le clan, survit grâce à son fusil Tech et sa moto modifiée.',
  },
  {
    id: 'medtech',
    label: 'Medtech / Ripperdoc',
    role: 'Medtech / Ripperdoc',
    suggestedHandle: 'Doc Scalpel // Ripper Clandestin',
    walletEb: 9500,
    walletCredits: 19000,
    maxWeightKg: 35,
    maxCybertension: 10,
    avatarColor: '#ec4899',
    starterEquipmentIds: ['gorilla-arms-arasaka', 'kang-tao-dian'],
    description: 'Chirurgien clandestin certifié, implantation d\'organes synthétiques et soins d\'urgence.',
    notes: 'Clinique de fortune dans Little China. Fournit du chrome de contrebande et soigne sans poser de questions.',
  },
  {
    id: 'corpo',
    label: 'Corpo / Agent Exécutif',
    role: 'Corpo / Agent Exécutif',
    suggestedHandle: 'BlackOps // Arasaka Special Ops',
    walletEb: 30000,
    walletCredits: 65000,
    maxWeightKg: 32,
    maxCybertension: 7,
    avatarColor: '#38bdf8',
    starterEquipmentIds: ['arasaka-hjke11-yukimura', 'sandevistan-dynalar'],
    description: 'Opérateur corpo avec accès aux matériels de pointe et budgets de mission illimités.',
    notes: 'Détaché des opérations spéciales corpo. Accès aux prototypes confidentiels et aux implants de grade militaire.',
  },
  {
    id: 'rockerboy',
    label: 'Rockerboy / Rebelle',
    role: 'Rockerboy / Rebelle',
    suggestedHandle: 'RiotVoice // Chrome Rebel',
    walletEb: 4500,
    walletCredits: 8500,
    maxWeightKg: 35,
    maxCybertension: 8,
    avatarColor: '#8b5cf6',
    starterEquipmentIds: ['malorian-3516', 'monowire-classic'],
    description: 'Artiste contestataire insurgé, galvanisant les foules contre la domination corporatiste.',
    notes: 'Porte-voix des exclus de Night City. Électrise les foules dans les clubs underground et défie l\'ordre établi.',
  },
];

/**
 * Cyberpunk Random Identity Generator (first names, handles, family names)
 */
const CYBER_FIRST_NAMES = [
  'Alex', 'Jax', 'Kira', 'Raven', 'Rex', 'Nyx', 'Zack', 'Sora',
  'Caleb', 'Maya', 'Dante', 'Vex', 'Rin', 'Kai', 'Zero', 'Echo',
  'Blade', 'Nova', 'Morgan', 'Lexi', 'Jett', 'Aria', 'Kane', 'Silas'
];

const CYBER_STREET_HANDLES = [
  'Ghost', 'Chrome', 'Nova', 'Glitch', 'Hammer', 'Viper', 'Wire',
  'Phantom', 'Havoc', 'Apex', 'Spectre', 'Static', 'Cipher', 'Venom',
  'Rook', 'Zero', 'Razor', 'Reaper', 'Circuit', 'Flash'
];

const CYBER_LAST_NAMES = [
  'Chen', 'Mercer', 'Tanaka', 'Varga', 'Sterling', 'Kowalski',
  'Blackwood', 'Al-Mansur', 'O\'Connor', 'Rossi', 'Novak', 'Mendoza',
  'Sato', 'Vance', 'Cross', 'Valenti', 'Kushinada', 'Winter'
];

const CYBER_HANDLE_ROLES = [
  'Solo de Night City',
  'Netrunner Deep Dive',
  'Edgerunner Indépendant',
  'Tech de Combat',
  'Nomad des Badlands',
  'Fixer d\'Atlantica',
  'Ripperdoc Clandestin',
  'Opérateur Fantôme'
];

export function generateRandomCyberpunkIdentity(): { name: string; handle: string } {
  const first = CYBER_FIRST_NAMES[Math.floor(Math.random() * CYBER_FIRST_NAMES.length)];
  const street = CYBER_STREET_HANDLES[Math.floor(Math.random() * CYBER_STREET_HANDLES.length)];
  const last = CYBER_LAST_NAMES[Math.floor(Math.random() * CYBER_LAST_NAMES.length)];
  const role = CYBER_HANDLE_ROLES[Math.floor(Math.random() * CYBER_HANDLE_ROLES.length)];

  return {
    name: `${first} "${street}" ${last}`,
    handle: `${street} // ${role}`,
  };
}

/**
 * Build starter inventory items for a given archetype preset
 */
export function buildStarterInventory(equipmentIds: string[]): InventoryItem[] {
  const items: InventoryItem[] = [];

  equipmentIds.forEach((eqId, idx) => {
    const found = EQUIPMENT_DATABASE.find((e) => e.id === eqId);
    if (!found) return;

    let slot: EquipmentSlot = 'weapon_primary';
    if (found.category === 'handguns' || found.category === 'longarms' || found.category === 'heavy') {
      slot = idx === 0 ? 'weapon_primary' : 'weapon_secondary';
    } else if (found.category === 'melee') {
      slot = idx === 0 ? 'weapon_primary' : 'weapon_secondary';
    } else if (found.category === 'armor') {
      slot = 'armor_body';
    } else if (found.category === 'cyberware') {
      slot = found.name.toLowerCase().includes('sandevistan') ? 'cyberware_neural' : 'cyberware_body';
    }

    items.push({
      id: `inv-starter-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}-${idx}`,
      equipmentId: found.id,
      item: found,
      quantity: 1,
      equipped: true,
      slot,
      purchasePriceEb: found.red?.priceEb || 0,
      purchasePriceCredits: found.iz?.priceCredits || 0,
      acquiredAt: new Date().toISOString(),
    });
  });

  return items;
}

