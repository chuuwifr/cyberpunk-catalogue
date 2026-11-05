import { EquipmentItem, GearCategory } from '../utils/gearLogic.ts';

export type EquipmentSlot =
  | 'weapon_primary'
  | 'weapon_secondary'
  | 'armor_body'
  | 'cyberware_neural'
  | 'cyberware_body'
  | 'gear_tactical'
  | 'backpack'
  | 'stash';

export interface InventoryItem {
  id: string; // unique inventory instance id
  equipmentId: string; // reference to EquipmentItem.id
  item: EquipmentItem; // snapshot / reference
  quantity: number;
  equipped: boolean;
  slot: EquipmentSlot;
  purchasePriceEb: number;
  purchasePriceCredits: number;
  acquiredAt: string;
  customNotes?: string;
}

export interface PlayerProfile {
  id: string;
  name: string;
  handle: string; // Street name / callsign
  role: string; // Solo, Netrunner, Tech, Fixer, Nomad, Medtech, Rockerboy, etc.
  avatarColor: string;
  systemPreference: 'both' | 'red' | 'iz';
  
  // Wallet
  walletEb: number; // Eurodollars (€$)
  walletCredits: number; // Interface Zero credits (c$)
  
  // Attributes & Limits
  maxWeightKg: number; // Max carry weight (ex: 40 kg)
  maxCybertension: number; // Max cybertension limit (ex: 8 pts)
  maxHumanity: number; // Max humanity (ex: 60)
  currentHumanity: number; // Current humanity
  
  // Inventory
  inventory: InventoryItem[];
  
  // Metadata
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShopTransactionResult {
  success: boolean;
  message: string;
  updatedProfile?: PlayerProfile;
}
