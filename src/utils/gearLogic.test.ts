import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterEquipment,
  sortEquipment,
  calculateLoadoutSummary,
  rollCyberpunkRedD10,
  getSwadeConversionSummary,
  createDefaultCustomEquipment,
  validateEquipment,
  mergeEquipmentList,
  getSafeImageUrl,
  normalizeGearName,
  deduplicateAndMergeEquipment,
  EquipmentItem,
} from './gearLogic.ts';

const mockItems: EquipmentItem[] = [
  {
    id: 'malorian-3516',
    name: 'Malorian Arms 3516',
    category: 'handguns',
    categoryLabel: 'Armes de poing',
    rarity: 'legendary',
    rarityLabel: 'Exotique / Légendaire',
    manufacturer: 'Malorian Arms',
    origin: 'Cyberpunk Wiki',
    description: 'Le pistolet emblématique personnalisé de Johnny Silverhand.',
    imageUrl: '',
    fallbackIcon: 'Crosshair',
    red: {
      priceEb: 10000,
      availability: 'Exotique',
      damage: '4d6',
      rof: 1,
      ammo: '14mm custom',
      magazine: 8,
      concealable: false,
    },
    iz: {
      priceCredits: 12000,
      quality: 'Milware',
      cybertension: 2,
      damage: '2d10',
      range: '15/30/60',
      weightKg: 3.2,
      ap: 4,
      notes: 'Arme lourde personnalisée, connecteur cyber-bras requis.',
    },
    tags: ['iconique', 'silverhand', 'semi-auto', '14mm'],
  },
  {
    id: 'bki-ghost-suit',
    name: 'Combinaison BKI Ghost',
    category: 'armor',
    categoryLabel: 'Armures & Protections',
    rarity: 'rare',
    rarityLabel: 'Rare',
    manufacturer: 'Black Knight Industries',
    origin: 'Interface Zéro 2.0',
    description: 'Tenue de dissimulation Caméléon à nanites électroluminescentes.',
    imageUrl: '',
    fallbackIcon: 'Shield',
    red: {
      priceEb: 1000,
      availability: 'Cher',
      sp: 11,
      concealable: true,
    },
    iz: {
      priceCredits: 950,
      quality: 'Hyperchrome',
      cybertension: 0,
      armorBonus: 2,
      weightKg: 7.5,
      notes: 'Système GhostCoat : -4 en perception pour détecter le porteur.',
    },
    tags: ['camouflage', 'furtivité', 'nanotissu'],
  },
  {
    id: 'cyberarm-heavy',
    name: 'Cyberbras Renforcé Gorilla',
    category: 'cyberware',
    categoryLabel: 'Cybermatériel',
    rarity: 'very_rare',
    rarityLabel: 'Très Rare',
    manufacturer: 'Arasaka',
    origin: 'Cyberpunk RED / IZ Hybrid',
    description: 'Prothèse cybernétique avec servomoteurs de classe industrielle.',
    imageUrl: '',
    fallbackIcon: 'Cpu',
    red: {
      priceEb: 2500,
      availability: 'Très Cher',
      humanityLoss: '2d6',
      damage: '3d6',
      concealable: false,
    },
    iz: {
      priceCredits: 5000,
      quality: 'Streetware',
      cybertension: 3,
      weightKg: 4.0,
      notes: 'Force +2 types de dés, permet d’arracher des portes blindées.',
    },
    tags: ['force', 'implants', 'corps-a-corps'],
  },
];

test('filterEquipment by category', () => {
  const result = filterEquipment(mockItems, { category: 'handguns' }, new Set());
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 'malorian-3516');
});

test('filterEquipment by search query across names and notes', () => {
  const result = filterEquipment(mockItems, { query: 'GhostCoat' }, new Set());
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 'bki-ghost-suit');
});

test('filterEquipment by rarity', () => {
  const result = filterEquipment(mockItems, { rarity: 'rare' }, new Set());
  assert.equal(result.length, 1);
  assert.equal(result[0].name, 'Combinaison BKI Ghost');
});

test('filterEquipment by favorites set', () => {
  const favorites = new Set(['bki-ghost-suit', 'cyberarm-heavy']);
  const result = filterEquipment(mockItems, { onlyFavorites: true }, favorites);
  assert.equal(result.length, 2);
});

test('sortEquipment by price ascending and descending', () => {
  const asc = sortEquipment(mockItems, 'price-asc');
  assert.equal(asc[0].id, 'bki-ghost-suit');
  assert.equal(asc[2].id, 'malorian-3516');

  const desc = sortEquipment(mockItems, 'price-desc');
  assert.equal(desc[0].id, 'malorian-3516');
  assert.equal(desc[2].id, 'bki-ghost-suit');
});

test('calculateLoadoutSummary calculates weights, currencies and cybertension accurately', () => {
  const summary = calculateLoadoutSummary(mockItems);
  assert.equal(summary.totalItems, 3);
  assert.equal(summary.totalPriceEb, 13500);
  assert.equal(summary.totalPriceCredits, 17950);
  assert.equal(Math.round(summary.totalWeightKg * 10) / 10, 14.7);
  assert.equal(summary.totalCybertension, 5);
  assert.equal(summary.estimatedHumanityLossMax, 12); // 2d6 = 12 max
});

test('rollCyberpunkRedD10 handles regular and critical rolls with deterministic seed', () => {
  // Normal roll (roll 6 with stat 8 => 14)
  const norm = rollCyberpunkRedD10(8, [6]);
  assert.equal(norm.total, 14);
  assert.equal(norm.criticalSuccess, false);
  assert.equal(norm.criticalFailure, false);

  // Critical success (roll 10 followed by 4 with stat 8 => 10 + 4 + 8 = 22)
  const crit = rollCyberpunkRedD10(8, [10, 4]);
  assert.equal(crit.criticalSuccess, true);
  assert.equal(crit.total, 22);

  // Critical failure (roll 1 followed by 5 penalty with stat 8 => 1 - 5 + 8 = 4)
  const fumble = rollCyberpunkRedD10(8, [1, 5]);
  assert.equal(fumble.criticalFailure, true);
  assert.equal(fumble.total, 4);
});

test('getSwadeConversionSummary extracts SWADE properties accurately', () => {
  const summary = getSwadeConversionSummary(mockItems[0]); // malorian
  assert.equal(summary.damageAndAp, '2d10 (PA 4)');
  assert.equal(summary.rangeSquares, '15/30/60 cases (mètres x2)');
  assert.equal(summary.cybertensionText, '2 pts de Cybertension');
  assert.ok(summary.specialRules.some((r) => r.includes("PA 4")));
});

test('createDefaultCustomEquipment creates valid item with defaults', () => {
  const custom = createDefaultCustomEquipment('longarms');
  assert.equal(custom.category, 'longarms');
  assert.equal(custom.isCustom, true);
  assert.equal(custom.origin, 'Création Personnalisée');
  assert.ok(custom.id.startsWith('custom-'));
  const validation = validateEquipment(custom);
  assert.equal(validation.isValid, true);
  assert.equal(validation.errors.length, 0);
});

test('validateEquipment catches invalid names and negative values', () => {
  const invalid = validateEquipment({ name: '   ', category: 'handguns', red: { priceEb: -10, availability: '', concealable: false } });
  assert.equal(invalid.isValid, false);
  assert.ok(invalid.errors.some((e) => e.includes('nom')));
  assert.ok(invalid.errors.some((e) => e.includes('négatif')));
});

test('mergeEquipmentList prepends custom items and handles overrides', () => {
  const custom1 = createDefaultCustomEquipment('heavy');
  custom1.id = 'custom-test-1';
  custom1.name = 'Prototype Railgun';

  const merged = mergeEquipmentList(mockItems, [custom1]);
  assert.equal(merged.length, mockItems.length + 1);
  assert.equal(merged[0].id, 'custom-test-1');
  assert.equal(merged[0].name, 'Prototype Railgun');
});

test('getSafeImageUrl safely proxies Fandom/Wikia images and preserves local/data URIs', () => {
  const fandomUrl = 'https://static.wikia.nocookie.net/cyberpunk/images/5/5d/Johnny_Silverhand%27s_Malorian_Database_CP2077.png/revision/latest';
  const proxied = getSafeImageUrl(fandomUrl);
  assert.ok(proxied.startsWith('/api/proxy-image?url='));
  assert.ok(proxied.includes(encodeURIComponent(fandomUrl)));

  const dataUri = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  assert.equal(getSafeImageUrl(dataUri), dataUri);

  const localPath = '/assets/sample.png';
  assert.equal(getSafeImageUrl(localPath), localPath);

  assert.equal(getSafeImageUrl(''), '');
  assert.equal(getSafeImageUrl(undefined), '');
});

test('EQUIPMENT_DATABASE integrity: all items have unique IDs, valid Fandom images, and SWADE conversion data', async () => {
  const { EQUIPMENT_DATABASE } = await import('../data/equipmentData.ts');
  assert.ok(EQUIPMENT_DATABASE.length >= 90, `Database should contain at least 90 items, found ${EQUIPMENT_DATABASE.length}`);

  const idSet = new Set<string>();
  for (const item of EQUIPMENT_DATABASE) {
    assert.ok(item.id && item.id.trim().length > 0, `Item without ID: ${item.name}`);
    assert.ok(!idSet.has(item.id), `Duplicate ID found: ${item.id}`);
    idSet.add(item.id);

    assert.ok(item.name && item.name.trim().length > 0, `Missing name for item ${item.id}`);
    assert.ok(item.category, `Missing category for item ${item.id}`);
    assert.ok(item.rarity, `Missing rarity for item ${item.id}`);
    assert.ok(item.description && item.description.length > 10, `Missing or too short description for ${item.id}`);

    // Verify Fandom/authentic image
    assert.ok(item.imageUrl && (item.imageUrl.startsWith('https://') || item.imageUrl.startsWith('/assets')), `Invalid imageUrl for ${item.id}`);

    // Verify Cyberpunk RED rules
    assert.ok(item.red, `Missing RED rules for ${item.id}`);
    assert.ok(item.red.priceEb >= 0, `Negative RED price for ${item.id}`);
    assert.ok(item.red.availability, `Missing RED availability for ${item.id}`);

    // Verify SWADE / Interface Zero rules
    assert.ok(item.iz, `Missing SWADE/IZ rules for ${item.id}`);
    assert.ok(item.iz.priceCredits >= 0, `Negative IZ price for ${item.id}`);
    assert.ok(item.iz.quality, `Missing IZ quality for ${item.id}`);
    assert.ok(typeof item.iz.cybertension === 'number', `Missing cybertension number for ${item.id}`);
    assert.ok(item.iz.notes && item.iz.notes.length > 5, `Missing SWADE conversion notes for ${item.id}`);
  }

  // Verify that all items in the database have unique normalized names (no duplicate entries)
  const normNames = new Set<string>();
  const duplicateNames: string[] = [];
  for (const item of EQUIPMENT_DATABASE) {
    const n = normalizeGearName(item.name);
    if (normNames.has(n)) {
      duplicateNames.push(`${item.name} (${item.id})`);
    }
    normNames.add(n);
  }
  assert.equal(duplicateNames.length, 0, `Found duplicate normalized names: ${duplicateNames.join(', ')}`);
});

test('deduplicateAndMergeEquipment detects and merges duplicate items seamlessly', () => {
  const item1: EquipmentItem = {
    ...mockItems[0],
    id: 'test-dup-1',
    name: 'Cyberdeck NetWatch Netdriver Mk.5',
    tags: ['cyberdeck', 'netwatch'],
    iz: { ...mockItems[0].iz, notes: 'Note A' },
  };
  const item2: EquipmentItem = {
    ...mockItems[0],
    id: 'test-dup-2',
    name: 'Cyberdeck NetWatch Netdriver Mk.5',
    tags: ['netrunning', 'os'],
    iz: { ...mockItems[0].iz, notes: 'Note B' },
  };

  const result = deduplicateAndMergeEquipment([item1, item2]);
  assert.equal(result.deduplicated.length, 1);
  assert.equal(result.mergedCount, 1);
  assert.ok(result.deduplicated[0].tags.includes('cyberdeck'));
  assert.ok(result.deduplicated[0].tags.includes('netrunning'));
  assert.ok(result.deduplicated[0].iz.notes.includes('Note A'));
  assert.ok(result.deduplicated[0].iz.notes.includes('Note B'));
});

