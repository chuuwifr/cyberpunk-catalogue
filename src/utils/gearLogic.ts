export type GearCategory =
  | 'all'
  | 'handguns'
  | 'longarms'
  | 'heavy'
  | 'melee'
  | 'cyberware'
  | 'armor'
  | 'drones_vehicles'
  | 'gear_tap'
  | 'pharma'
  | 'weapon_mods';

export type GearRarity =
  | 'common'
  | 'uncommon'
  | 'rare'
  | 'very_rare'
  | 'legendary';

export interface EquipmentItem {
  id: string;
  name: string;
  category: GearCategory;
  categoryLabel: string;
  rarity: GearRarity;
  rarityLabel: string;
  manufacturer: string;
  origin: 'Cyberpunk Wiki' | 'Interface Zéro 2.0' | 'Cyberpunk RED / IZ Hybrid' | 'Création Personnalisée';
  isCustom?: boolean;
  description: string;
  flavorQuote?: string;
  imageUrl: string;
  fallbackIcon: string;
  
  // Cyberpunk RED stats
  red: {
    priceEb: number;
    availability: string;
    damage?: string;
    rof?: number;
    ammo?: string;
    magazine?: number;
    concealable: boolean;
    sp?: number; // Stopping Power
    humanityLoss?: string;
    installReq?: string;
  };

  // Interface Zéro 2.0 / Savage Worlds stats
  iz: {
    priceCredits: number;
    quality: 'Gutterware' | 'Streetware' | 'Hyperchrome' | 'Milware' | 'Standard' | 'Corpware' | 'Bioware';
    cybertension?: number;
    damage?: string;
    range?: string;
    firewall?: number;
    weightKg: number;
    ap?: number; // Armor Piercing
    armorBonus?: number;
    notes: string;
  };

  tags: string[];
}

export interface FilterOptions {
  query?: string;
  category?: GearCategory;
  rarity?: GearRarity | 'all';
  manufacturer?: string | 'all';
  maxPriceEb?: number;
  maxCybertension?: number;
  onlyFavorites?: boolean;
  onlyCustom?: boolean;
}

export interface LoadoutSummary {
  totalItems: number;
  totalPriceEb: number;
  totalPriceCredits: number;
  totalWeightKg: number;
  totalCybertension: number;
  estimatedHumanityLossMax: number;
}

/**
 * Filter items based on active search criteria
 */
export function filterEquipment(
  items: EquipmentItem[],
  filters: FilterOptions,
  favoriteIds: Set<string>
): EquipmentItem[] {
  const query = filters.query?.trim().toLowerCase() || '';

  return items.filter((item) => {
    // Custom only filter
    if (filters.onlyCustom && !item.isCustom) {
      return false;
    }

    // Favorites only filter
    if (filters.onlyFavorites && !favoriteIds.has(item.id)) {
      return false;
    }

    // Category filter
    if (filters.category && filters.category !== 'all' && item.category !== filters.category) {
      return false;
    }

    // Rarity filter
    if (filters.rarity && filters.rarity !== 'all' && item.rarity !== filters.rarity) {
      return false;
    }

    // Manufacturer filter
    if (filters.manufacturer && filters.manufacturer !== 'all' && item.manufacturer !== filters.manufacturer) {
      return false;
    }

    // Price filter (Cyberpunk RED eb)
    if (filters.maxPriceEb && filters.maxPriceEb > 0 && item.red.priceEb > filters.maxPriceEb) {
      return false;
    }

    // Cybertension filter
    if (
      filters.maxCybertension !== undefined &&
      filters.maxCybertension >= 0 &&
      (item.iz.cybertension ?? 0) > filters.maxCybertension
    ) {
      return false;
    }

    // Search query
    if (query) {
      const matchName = item.name.toLowerCase().includes(query);
      const matchManufacturer = item.manufacturer.toLowerCase().includes(query);
      const matchCategory = item.categoryLabel.toLowerCase().includes(query);
      const matchDesc = item.description.toLowerCase().includes(query);
      const matchTags = item.tags.some((t) => t.toLowerCase().includes(query));
      const matchDmg = (item.red.damage?.toLowerCase().includes(query) || item.iz.damage?.toLowerCase().includes(query));
      const matchNotes = item.iz.notes.toLowerCase().includes(query);

      return matchName || matchManufacturer || matchCategory || matchDesc || matchTags || matchDmg || matchNotes;
    }

    return true;
  });
}

/**
 * Creates a default custom equipment template ready to be customized by user
 */
export function createDefaultCustomEquipment(category: GearCategory = 'handguns'): EquipmentItem {
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

  const defaultIcons: Record<GearCategory, string> = {
    all: 'Layers',
    handguns: 'Crosshair',
    longarms: 'Zap',
    heavy: 'Flame',
    melee: 'Sword',
    cyberware: 'Cpu',
    armor: 'Shield',
    drones_vehicles: 'Truck',
    gear_tap: 'Terminal',
    pharma: 'Activity',
    weapon_mods: 'Sliders',
  };

  const id = `custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  return {
    id,
    name: 'Nouvel Équipement Prototype',
    category,
    categoryLabel: categoryLabels[category] || 'Matériel',
    rarity: 'rare',
    rarityLabel: 'Rare',
    manufacturer: 'Tech-Artisan Indépendant',
    origin: 'Création Personnalisée',
    isCustom: true,
    description: 'Prototype personnalisé conçu dans un atelier clandestin de Night City ou de la Sprawl.',
    flavorQuote: '« Si ce n’est pas sur le catalogue corpo, c’est que c’est encore plus dangereux. »',
    imageUrl: '',
    fallbackIcon: defaultIcons[category] || 'Crosshair',
    red: {
      priceEb: 500,
      availability: 'Coûteux',
      damage: '3d6+1',
      rof: 1,
      ammo: 'Standard',
      magazine: 12,
      concealable: true,
    },
    iz: {
      priceCredits: 600,
      quality: 'Streetware',
      cybertension: 1,
      damage: '2d6+1',
      range: '12/24/48',
      weightKg: 2.0,
      ap: 1,
      notes: 'Règles SWADE : Personnalisable, fiabilité modulaire.',
    },
    tags: ['custom', 'prototype', 'fait-main'],
  };
}

/**
 * Validates equipment payload before saving
 */
export function validateEquipment(item: Partial<EquipmentItem>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!item.name || item.name.trim().length === 0) {
    errors.push('Le nom de l’équipement est requis.');
  }
  if (!item.category) {
    errors.push('La catégorie est requise.');
  }
  if (item.red && item.red.priceEb < 0) {
    errors.push('Le prix en €$ ne peut pas être négatif.');
  }
  if (item.iz && item.iz.priceCredits < 0) {
    errors.push('Le prix en c$ ne peut pas être négatif.');
  }
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Normalizes item names for duplicate comparison (removes accents, punctuation, extra spaces)
 */
export function normalizeGearName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Detects and merges duplicate equipment items based on ID, alias, or normalized name
 */
export function deduplicateAndMergeEquipment(items: EquipmentItem[]): {
  deduplicated: EquipmentItem[];
  mergedCount: number;
  details: string[];
} {
  const aliasMap: Record<string, string> = {
    'mantis-blades': 'mantis-blades-standard',
    'monofouet-so': 'monowire-implant',
    'netwatch-netdriver-mk5': 'netwatch-netdriver-os',
    'tetratronic-rippler-mk4': 'tetratronic-rippler-os',
    'cyberdeck-raven': 'raven-microcyber-os',
  };

  const resultMap = new Map<string, EquipmentItem>();
  const nameToId = new Map<string, string>();
  const details: string[] = [];
  let mergedCount = 0;

  for (const rawItem of items) {
    const canonicalId = aliasMap[rawItem.id] || rawItem.id;
    const item: EquipmentItem = { ...rawItem, id: canonicalId };
    const normName = normalizeGearName(item.name);
    const existingById = resultMap.get(canonicalId);
    const existingIdByName = nameToId.get(normName);
    const existingByName = existingIdByName ? resultMap.get(existingIdByName) : undefined;

    const existing = existingById || existingByName;

    if (existing && existing.id !== item.id) {
      // Merge two different entries
      mergedCount++;
      details.push(`Fusion de « ${item.name} » avec « ${existing.name} »`);

      // Combine tags
      const combinedTags = Array.from(new Set([...existing.tags, ...item.tags]));

      // Combine notes
      const notes = existing.iz.notes.includes(item.iz.notes)
        ? existing.iz.notes
        : `${existing.iz.notes} // ${item.iz.notes}`.trim();

      // Better image (prefer https/webp/png over defaults)
      const bestImage =
        existing.imageUrl && !existing.imageUrl.includes('placeholder')
          ? existing.imageUrl
          : item.imageUrl;

      const merged: EquipmentItem = {
        ...existing,
        name: existing.name.length >= item.name.length ? existing.name : item.name,
        description:
          existing.description.length >= item.description.length
            ? existing.description
            : item.description,
        flavorQuote: existing.flavorQuote || item.flavorQuote,
        imageUrl: bestImage,
        tags: combinedTags,
        red: {
          ...item.red,
          ...existing.red,
          priceEb: Math.max(existing.red.priceEb, item.red.priceEb),
        },
        iz: {
          ...item.iz,
          ...existing.iz,
          notes,
          priceCredits: Math.max(existing.iz.priceCredits, item.iz.priceCredits),
        },
        isCustom: existing.isCustom || item.isCustom,
      };

      resultMap.set(existing.id, merged);
      nameToId.set(normName, existing.id);
    } else if (existingById) {
      // Same ID, custom override or exact duplicate
      mergedCount++;
      const merged: EquipmentItem = {
        ...existingById,
        ...item,
        tags: Array.from(new Set([...existingById.tags, ...item.tags])),
        isCustom: existingById.isCustom || item.isCustom,
      };
      resultMap.set(canonicalId, merged);
    } else {
      resultMap.set(canonicalId, item);
      nameToId.set(normName, canonicalId);
    }
  }

  return {
    deduplicated: Array.from(resultMap.values()),
    mergedCount,
    details,
  };
}

/**
 * Merges built-in equipment items with custom equipment items, placing custom items at top
 * and eliminating any duplicates.
 */
export function mergeEquipmentList(builtIn: EquipmentItem[], custom: EquipmentItem[]): EquipmentItem[] {
  const merged = deduplicateAndMergeEquipment([...custom, ...builtIn]);
  return merged.deduplicated;
}


/**
 * Sort items based on criteria
 */
export function sortEquipment(
  items: EquipmentItem[],
  sortBy: 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'rarity-desc' | 'weight-desc'
): EquipmentItem[] {
  const rarityRank: Record<GearRarity, number> = {
    common: 1,
    uncommon: 2,
    rare: 3,
    very_rare: 4,
    legendary: 5,
  };

  return [...items].sort((a, b) => {
    switch (sortBy) {
      case 'name-asc':
        return a.name.localeCompare(b.name, 'fr');
      case 'name-desc':
        return b.name.localeCompare(a.name, 'fr');
      case 'price-asc':
        return a.red.priceEb - b.red.priceEb;
      case 'price-desc':
        return b.red.priceEb - a.red.priceEb;
      case 'rarity-desc':
        return rarityRank[b.rarity] - rarityRank[a.rarity];
      case 'weight-desc':
        return b.iz.weightKg - a.iz.weightKg;
      default:
        return 0;
    }
  });
}

/**
 * Calculate total stats for a loadout / favorites list
 */
export function calculateLoadoutSummary(items: EquipmentItem[]): LoadoutSummary {
  return items.reduce(
    (acc, item) => {
      acc.totalItems += 1;
      acc.totalPriceEb += item.red.priceEb;
      acc.totalPriceCredits += item.iz.priceCredits;
      acc.totalWeightKg += item.iz.weightKg;
      acc.totalCybertension += item.iz.cybertension ?? 0;

      // Parse humanity loss if present like "2d6 (7)" or "1d6" or "2"
      if (item.red.humanityLoss) {
        const match = item.red.humanityLoss.match(/(\d+)d6/);
        if (match) {
          acc.estimatedHumanityLossMax += parseInt(match[1], 10) * 6;
        } else {
          const directNum = parseInt(item.red.humanityLoss, 10);
          if (!isNaN(directNum)) {
            acc.estimatedHumanityLossMax += directNum;
          }
        }
      }

      return acc;
    },
    {
      totalItems: 0,
      totalPriceEb: 0,
      totalPriceCredits: 0,
      totalWeightKg: 0,
      totalCybertension: 0,
      estimatedHumanityLossMax: 0,
    }
  );
}

/**
 * Dice rolling helpers for Cyberpunk RED (1d10 + skill) and Savage Worlds / IZ2.0 (exploding dice)
 */
export function rollCyberpunkRedD10(statPlusSkill: number, customSeed?: number[]): {
  baseRoll: number;
  total: number;
  criticalSuccess: boolean;
  criticalFailure: boolean;
  explodedRolls: number[];
} {
  let index = 0;
  const getRand = () => {
    if (customSeed && index < customSeed.length) {
      return customSeed[index++];
    }
    return Math.floor(Math.random() * 10) + 1;
  };

  const initial = getRand();
  const explodedRolls: number[] = [initial];
  let currentTotal = initial + statPlusSkill;
  let criticalSuccess = false;
  let criticalFailure = false;

  if (initial === 10) {
    criticalSuccess = true;
    let extra = getRand();
    explodedRolls.push(extra);
    currentTotal += extra;
    while (extra === 10) {
      extra = getRand();
      explodedRolls.push(extra);
      currentTotal += extra;
    }
  } else if (initial === 1) {
    criticalFailure = true;
    const penalty = getRand();
    explodedRolls.push(-penalty);
    currentTotal -= penalty;
  }

  return {
    baseRoll: initial,
    total: currentTotal,
    criticalSuccess,
    criticalFailure,
    explodedRolls,
  };
}

/**
 * Format currency with cyber styling
 */
export function formatCurrency(amount: number, type: 'eb' | 'credits'): string {
  const formatted = new Intl.NumberFormat('fr-FR').format(amount);
  return type === 'eb' ? `${formatted} €$` : `${formatted} c$`;
}

/**
 * Returns a structured SWADE (Savage Worlds Adventure Edition) rule conversion summary
 */
export function getSwadeConversionSummary(item: EquipmentItem): {
  systemLabel: string;
  damageAndAp: string;
  rangeSquares: string;
  weightText: string;
  armorOrDefense: string;
  cybertensionText: string;
  specialRules: string[];
} {
  const specialRules: string[] = [];

  if (item.iz.ap && item.iz.ap > 0) {
    specialRules.push(`Pénétration d'Armure : PA ${item.iz.ap}`);
  }
  if (item.iz.notes.includes('Arme Lourde') || item.iz.notes.includes('(AL)')) {
    specialRules.push('Arme Lourde (AL) : affecte les véhicules et blindages lourds');
  }
  if (item.iz.notes.includes('Tir automatique') || item.iz.notes.includes('Auto')) {
    specialRules.push('Tir Automatique (SWADE) : -2 Recul sauf si bipied/stabilisé');
  }
  if (item.iz.notes.includes('rafale') || item.iz.notes.includes('3RB')) {
    specialRules.push('Tir en Rafale : +1 Toucher et +1 Dégâts');
  }

  return {
    systemLabel: 'SWADE / Interface Zéro 2.0',
    damageAndAp: item.iz.damage
      ? `${item.iz.damage}${item.iz.ap ? ` (PA ${item.iz.ap})` : ''}`
      : 'N/A',
    rangeSquares: item.iz.range ? `${item.iz.range} cases (mètres x2)` : 'Contact / Personnel',
    weightText: `${item.iz.weightKg} kg`,
    armorOrDefense: item.iz.armorBonus ? `+${item.iz.armorBonus} Armure` : 'Aucun bonus d\'armure',
    cybertensionText:
      item.iz.cybertension !== undefined ? `${item.iz.cybertension} pts de Cybertension` : '0 pt',
    specialRules,
  };
}

/**
 * Safely resolves equipment image URLs, routing Fandom/Wikia images through
 * a same-origin proxy to eliminate CORS/CORP header blocks while preserving base64/custom URLs.
 */
export function getSafeImageUrl(url: string | undefined): string {
  if (!url) return '';
  if (url.startsWith('data:') || url.startsWith('blob:') || url.startsWith('/')) {
    return url;
  }
  if (url.includes('wikia.nocookie.net') || url.includes('fandom.com')) {
    return `/api/proxy-image?url=${encodeURIComponent(url)}`;
  }
  return url;
}
