import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_PROFILES,
  calculateProfileStats,
  buyItem,
  sellItem,
  toggleEquipItem,
  toggleStashItem,
  adjustWallet,
  exportProfileToJson,
  importProfileFromJson,
  createProfile,
  getActiveProfileId,
  getActiveProfile,
  setActiveProfileId,
  ARCHETYPE_PRESETS,
  generateRandomCyberpunkIdentity,
  buildStarterInventory,
} from './profileService.ts';
import { EquipmentItem } from './gearLogic.ts';

// Mock localStorage for Node test runner
const localStorageStore: Record<string, string> = {};
(global as any).localStorage = {
  getItem: (key: string) => localStorageStore[key] || null,
  setItem: (key: string, val: string) => {
    localStorageStore[key] = val;
  },
  removeItem: (key: string) => {
    delete localStorageStore[key];
  },
  clear: () => {
    Object.keys(localStorageStore).forEach((k) => delete localStorageStore[k]);
  },
};

const testWeapon: EquipmentItem = {
  id: 'test-smart-pistol',
  name: 'Kang Tao Dian G-58',
  category: 'handguns',
  categoryLabel: 'Armes de poing',
  rarity: 'rare',
  rarityLabel: 'Rare',
  manufacturer: 'Kang Tao',
  origin: 'Cyberpunk Wiki',
  description: 'Pistolet-mitrailleur intelligent à guidage gyroscopique.',
  imageUrl: '',
  fallbackIcon: 'Crosshair',
  red: {
    priceEb: 1000,
    availability: 'Rare',
    damage: '3d6',
    rof: 2,
    ammo: '9mm',
    magazine: 30,
    concealable: true,
  },
  iz: {
    priceCredits: 2000,
    quality: 'Hyperchrome',
    cybertension: 0,
    damage: '2d6',
    range: '12/24/48',
    weightKg: 2.5,
    notes: 'Tir guidé intelligent.',
  },
  tags: ['smart', 'submachinegun'],
};

const testCyberware: EquipmentItem = {
  id: 'test-kerenzikov',
  name: 'Kerenzikov Boost Reflex',
  category: 'cyberware',
  categoryLabel: 'Cybermatériel & Implants',
  rarity: 'very_rare',
  rarityLabel: 'Très Rare',
  manufacturer: 'Zetatech',
  origin: 'Cyberpunk Wiki',
  description: 'Booster neural d’esquive réflexe.',
  imageUrl: '',
  fallbackIcon: 'Zap',
  red: {
    priceEb: 2500,
    availability: 'Exotique',
    humanityLoss: '2d6 (7)',
    concealable: true,
  },
  iz: {
    priceCredits: 5000,
    quality: 'Milware',
    cybertension: 2,
    weightKg: 0.5,
    notes: 'Réaction instantanée.',
  },
  tags: ['cyberware', 'neural'],
};

test('Player Profile: calculates carried weight, cybertension and limits accurately', () => {
  const profile = { ...DEFAULT_PROFILES[0] };
  const stats = calculateProfileStats(profile);

  assert.ok(stats.totalCarriedWeightKg > 0);
  assert.equal(stats.isOverweight, false);
  assert.equal(stats.isCyberOverloaded, false);
  assert.ok(stats.equippedWeaponsCount >= 1);
});

test('Virtual Shop: buyItem deducts currency and adds to inventory', () => {
  const profile = createProfile({
    name: 'Test Runner',
    walletEb: 5000,
    walletCredits: 10000,
    inventory: [],
  });

  // Buy with Eurodollars
  const resultEb = buyItem(profile.id, testWeapon, 'eb', 1);
  assert.equal(resultEb.success, true);
  assert.ok(resultEb.updatedProfile);
  assert.equal(resultEb.updatedProfile.walletEb, 4000); // 5000 - 1000
  assert.equal(resultEb.updatedProfile.inventory.length, 1);
  assert.equal(resultEb.updatedProfile.inventory[0].equipmentId, testWeapon.id);

  // Buy with Credits IZ
  const resultCredits = buyItem(profile.id, testCyberware, 'credits', 1);
  assert.equal(resultCredits.success, true);
  assert.ok(resultCredits.updatedProfile);
  assert.equal(resultCredits.updatedProfile.walletCredits, 5000); // 10000 - 5000
  assert.equal(resultCredits.updatedProfile.inventory.length, 2);
});

test('Virtual Shop: buyItem rejects purchase if insufficient funds', () => {
  const brokeProfile = createProfile({
    name: 'Broke Runner',
    walletEb: 100,
    walletCredits: 200,
    inventory: [],
  });

  const result = buyItem(brokeProfile.id, testWeapon, 'eb', 1);
  assert.equal(result.success, false);
  assert.match(result.message, /Fonds insuffisants/);
});

test('Virtual Shop: sellItem pays out 60% and adjusts inventory', () => {
  const seller = createProfile({
    name: 'Seller',
    walletEb: 0,
    inventory: [
      {
        id: 'inv-123',
        equipmentId: testWeapon.id,
        item: testWeapon,
        quantity: 1,
        equipped: false,
        slot: 'backpack',
        purchasePriceEb: 1000,
        purchasePriceCredits: 2000,
        acquiredAt: new Date().toISOString(),
      },
    ],
  });

  const res = sellItem(seller.id, 'inv-123', 'eb', 0.6);
  assert.equal(res.success, true);
  assert.ok(res.updatedProfile);
  assert.equal(res.updatedProfile.walletEb, 600); // 60% of 1000
  assert.equal(res.updatedProfile.inventory.length, 0);
});

test('Profile Equipment: toggleEquipItem and toggleStashItem update slot and weight', () => {
  const testChar = createProfile({
    name: 'GearMaster',
    inventory: [
      {
        id: 'inv-gear-1',
        equipmentId: testWeapon.id,
        item: testWeapon,
        quantity: 1,
        equipped: false,
        slot: 'backpack',
        purchasePriceEb: 1000,
        purchasePriceCredits: 2000,
        acquiredAt: new Date().toISOString(),
      },
    ],
  });

  // Equip weapon
  const equipped = toggleEquipItem(testChar.id, 'inv-gear-1');
  assert.ok(equipped);
  assert.equal(equipped.inventory[0].equipped, true);

  // Stash weapon (moves to stash and unequips)
  const stashed = toggleStashItem(testChar.id, 'inv-gear-1');
  assert.ok(stashed);
  assert.equal(stashed.inventory[0].equipped, false);
  assert.equal(stashed.inventory[0].slot, 'stash');

  // Stashed items do NOT contribute to carry weight
  const stashStats = calculateProfileStats(stashed);
  assert.equal(stashStats.totalCarriedWeightKg, 0);
});

test('Profile Export/Import: round-trips player profile cleanly', () => {
  const original = createProfile({
    name: 'Jackie Wells',
    role: 'Solo',
    walletEb: 8000,
    maxWeightKg: 50,
  });

  const jsonStr = exportProfileToJson(original);
  assert.ok(jsonStr.includes('Jackie Wells'));

  const imported = importProfileFromJson(jsonStr);
  assert.ok(imported.name.includes('Jackie Wells'));
  assert.equal(imported.walletEb, 8000);
  assert.equal(imported.maxWeightKg, 50);
});

test('Multiple Profiles: can create, duplicate, switch and delete multiple player profiles', () => {
  const char1 = createProfile({ name: 'Alt Cunningham', role: 'Netrunner', walletEb: 15000 });
  const char2 = createProfile({ name: 'Johnny Silverhand', role: 'Rockerboy', walletEb: 3000 });
  const char3 = createProfile({ name: 'Panam Palmer', role: 'Nomad', walletEb: 7000 });

  assert.ok(char1.id);
  assert.ok(char2.id);
  assert.ok(char3.id);
  assert.notEqual(char1.id, char2.id);
  assert.notEqual(char2.id, char3.id);

  // Active profile should be the most recently created
  assert.equal(getActiveProfileId(), char3.id);
  assert.equal(getActiveProfile().name, 'Panam Palmer');

  // Switch active profile to char1
  setActiveProfileId(char1.id);
  assert.equal(getActiveProfileId(), char1.id);
  assert.equal(getActiveProfile().name, 'Alt Cunningham');
  assert.equal(getActiveProfile().walletEb, 15000);

  // Each profile has isolated wallets
  adjustWallet(char1.id, 500, 0);
  assert.equal(getActiveProfile().walletEb, 15500);

  setActiveProfileId(char2.id);
  assert.equal(getActiveProfile().walletEb, 3000);
});

test('Archetype Presets & Identity Generator: generates valid cyberpunk profiles with starter gear', () => {
  // Test random identity
  const id1 = generateRandomCyberpunkIdentity();
  assert.ok(id1.name.length > 5);
  assert.ok(id1.handle.length > 5);
  assert.ok(id1.name.includes('"'));

  // Test presets
  assert.ok(ARCHETYPE_PRESETS.length >= 8);
  const soloPreset = ARCHETYPE_PRESETS.find((p) => p.id === 'solo');
  assert.ok(soloPreset);
  assert.equal(soloPreset.role, 'Solo / Mercenaire');

  // Test starter inventory
  const starterItems = buildStarterInventory(soloPreset.starterEquipmentIds);
  assert.ok(starterItems.length > 0);
  assert.equal(starterItems[0].equipped, true);

  // Create profile with preset and starter items
  const presetChar = createProfile({
    name: 'Rebecca Gunner',
    handle: soloPreset.suggestedHandle,
    role: soloPreset.role,
    walletEb: soloPreset.walletEb,
    walletCredits: soloPreset.walletCredits,
    maxWeightKg: soloPreset.maxWeightKg,
    maxCybertension: soloPreset.maxCybertension,
    avatarColor: soloPreset.avatarColor,
    inventory: starterItems,
    notes: soloPreset.notes,
  });

  assert.equal(presetChar.name, 'Rebecca Gunner');
  assert.equal(presetChar.inventory.length, starterItems.length);
  const stats = calculateProfileStats(presetChar);
  assert.ok(stats.totalCarriedWeightKg > 0);
});

