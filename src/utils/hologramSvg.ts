import { EquipmentItem, GearCategory, GearRarity } from './gearLogic.ts';

/**
 * Returns RGB hex accent colors corresponding to equipment rarity
 */
export function getRarityColor(rarity: GearRarity): { primary: string; glow: string; text: string } {
  switch (rarity) {
    case 'common':
      return { primary: '#10b981', glow: 'rgba(16, 185, 129, 0.4)', text: '#34d399' };
    case 'uncommon':
      return { primary: '#0ea5e9', glow: 'rgba(14, 165, 233, 0.4)', text: '#38bdf8' };
    case 'rare':
      return { primary: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.45)', text: '#a78bfa' };
    case 'very_rare':
      return { primary: '#f59e0b', glow: 'rgba(245, 158, 11, 0.45)', text: '#fbbf24' };
    case 'legendary':
    default:
      return { primary: '#d946ef', glow: 'rgba(217, 70, 239, 0.5)', text: '#f472b6' };
  }
}

/**
 * Generates an SVG vector path silhouette based on item category
 */
function getCategoryVector(category: GearCategory, color: string): string {
  switch (category) {
    case 'handguns':
      return `
        <!-- Handgun silhouette -->
        <g stroke="${color}" stroke-width="2" fill="none" opacity="0.9">
          <!-- Slide & Barrel -->
          <rect x="70" y="85" width="160" height="35" rx="3" fill="${color}" fill-opacity="0.12" />
          <line x1="85" y1="92" x2="165" y2="92" stroke-dasharray="4 2" />
          <line x1="60" y1="100" x2="70" y2="100" stroke-width="4" />
          <!-- Ejection port & rear sight -->
          <rect x="145" y="80" width="25" height="5" fill="${color}" />
          <rect x="220" y="80" width="10" height="5" fill="${color}" />
          <!-- Trigger guard & trigger -->
          <path d="M 160 120 L 160 145 C 160 152 175 152 180 145 L 185 120" stroke-width="2" />
          <path d="M 172 125 C 170 135 174 138 177 140" stroke-width="2.5" />
          <!-- Grip / Handle -->
          <path d="M 185 120 L 210 185 C 212 190 200 195 180 190 L 160 135 Z" fill="${color}" fill-opacity="0.2" />
          <line x1="175" y1="145" x2="200" y2="180" stroke-dasharray="3 3" />
          <line x1="170" y1="155" x2="195" y2="188" stroke-dasharray="3 3" />
          <!-- Muzzle laser beam guide -->
          <line x1="20" y1="100" x2="60" y2="100" stroke="${color}" stroke-dasharray="2 4" opacity="0.6" />
        </g>
      `;

    case 'longarms':
      return `
        <!-- Assault Rifle / Longarm silhouette -->
        <g stroke="${color}" stroke-width="2" fill="none" opacity="0.9">
          <!-- Barrel & Handguard -->
          <line x1="30" y1="95" x2="70" y2="95" stroke-width="3" />
          <rect x="70" y="85" width="90" height="20" fill="${color}" fill-opacity="0.15" />
          <!-- Receiver & Rail -->
          <rect x="160" y="80" width="80" height="30" fill="${color}" fill-opacity="0.2" />
          <!-- Scope / Holosight -->
          <rect x="170" y="65" width="50" height="15" rx="2" stroke-width="1.5" />
          <line x1="195" y1="65" x2="195" y2="80" />
          <!-- Magazine -->
          <path d="M 170 110 L 160 160 C 158 165 175 168 180 160 L 195 110 Z" fill="${color}" fill-opacity="0.25" />
          <!-- Grip -->
          <path d="M 215 110 L 225 155 L 205 155 L 200 110 Z" fill="${color}" fill-opacity="0.2" />
          <!-- Stock -->
          <path d="M 240 85 L 285 80 L 285 130 L 255 110 Z" fill="${color}" fill-opacity="0.15" />
        </g>
      `;

    case 'heavy':
      return `
        <!-- Heavy Ordnance silhouette -->
        <g stroke="${color}" stroke-width="2" fill="none" opacity="0.9">
          <!-- Massive Twin Barrels -->
          <rect x="35" y="80" width="180" height="25" rx="2" fill="${color}" fill-opacity="0.2" />
          <rect x="35" y="108" width="180" height="20" rx="2" fill="${color}" fill-opacity="0.15" />
          <rect x="25" y="75" width="15" height="58" rx="3" fill="${color}" fill-opacity="0.4" />
          <!-- Receiver / Ammo drum -->
          <circle cx="205" cy="120" r="32" fill="${color}" fill-opacity="0.2" stroke-dasharray="6 3" />
          <circle cx="205" cy="120" r="12" fill="${color}" fill-opacity="0.5" />
          <!-- Heavy mount & handle -->
          <path d="M 120 75 L 145 55 L 175 55 L 165 75 Z" stroke-width="2" />
          <rect x="235" y="90" width="50" height="35" rx="4" fill="${color}" fill-opacity="0.3" />
        </g>
      `;

    case 'melee':
      return `
        <!-- Cyber Katana / Mantis Blade silhouette -->
        <g stroke="${color}" stroke-width="2" fill="none" opacity="0.9">
          <!-- Blade curve -->
          <path d="M 40 60 Q 150 75 230 115 L 225 125 Q 140 85 45 68 Z" fill="${color}" fill-opacity="0.3" />
          <path d="M 40 60 Q 150 75 230 115" stroke-width="3" />
          <!-- Energy edge glow -->
          <path d="M 45 63 Q 150 77 220 113" stroke="#ffffff" stroke-width="1" stroke-dasharray="8 4" opacity="0.8" />
          <!-- Tsuba / Guard -->
          <ellipse cx="230" cy="120" rx="6" ry="16" fill="${color}" transform="rotate(30 230 120)" />
          <!-- Handle / Tsuka -->
          <path d="M 233 123 L 275 155 L 268 163 L 226 131 Z" fill="${color}" fill-opacity="0.4" />
          <line x1="240" y1="130" x2="245" y2="138" stroke="#ffffff" />
          <line x1="250" y1="138" x2="255" y2="146" stroke="#ffffff" />
          <line x1="260" y1="146" x2="265" y2="154" stroke="#ffffff" />
        </g>
      `;

    case 'cyberware':
      return `
        <!-- Cyberware Neural Implant / Cyber-arm schematic -->
        <g stroke="${color}" stroke-width="1.8" fill="none" opacity="0.9">
          <!-- Central processor / Neural hub -->
          <rect x="110" y="70" width="80" height="70" rx="8" fill="${color}" fill-opacity="0.2" />
          <rect x="125" y="85" width="50" height="40" rx="4" stroke="${color}" stroke-width="2" fill="${color}" fill-opacity="0.4" />
          <!-- Neural bus traces -->
          <path d="M 110 90 L 70 90 L 55 70" stroke-width="2" />
          <circle cx="55" cy="70" r="4" fill="${color}" />
          <path d="M 110 115 L 60 115 L 45 135" stroke-width="2" />
          <circle cx="45" cy="135" r="4" fill="${color}" />
          <path d="M 190 90 L 230 90 L 250 65" stroke-width="2" />
          <circle cx="250" cy="65" r="4" fill="${color}" />
          <path d="M 190 115 L 235 115 L 255 140" stroke-width="2" />
          <circle cx="255" cy="140" r="4" fill="${color}" />
          <!-- Pin connectors top & bottom -->
          <line x1="130" y1="65" x2="130" y2="70" stroke-width="3" />
          <line x1="150" y1="65" x2="150" y2="70" stroke-width="3" />
          <line x1="170" y1="65" x2="170" y2="70" stroke-width="3" />
          <line x1="130" y1="140" x2="130" y2="145" stroke-width="3" />
          <line x1="150" y1="140" x2="150" y2="145" stroke-width="3" />
          <line x1="170" y1="140" x2="170" y2="145" stroke-width="3" />
          <!-- Activity pulses -->
          <circle cx="150" cy="105" r="8" fill="#ffffff" opacity="0.7" />
        </g>
      `;

    case 'armor':
      return `
        <!-- Tactical Armor Plate silhouette -->
        <g stroke="${color}" stroke-width="2" fill="none" opacity="0.9">
          <!-- Main Chest Plate -->
          <path d="M 100 65 L 200 65 L 220 95 L 210 155 L 150 175 L 90 155 L 80 95 Z" fill="${color}" fill-opacity="0.2" />
          <!-- Trauma honeycomb reinforcement -->
          <path d="M 115 80 L 185 80 L 195 105 L 150 145 L 105 105 Z" stroke-dasharray="4 3" stroke-width="1.5" />
          <line x1="150" y1="65" x2="150" y2="175" stroke-width="1.5" stroke-dasharray="3 3" />
          <!-- Ballistic collar & shoulder pads -->
          <rect x="65" y="75" width="25" height="40" rx="3" fill="${color}" fill-opacity="0.25" />
          <rect x="210" y="75" width="25" height="40" rx="3" fill="${color}" fill-opacity="0.25" />
        </g>
      `;

    case 'drones_vehicles':
      return `
        <!-- Combat Drone silhouette -->
        <g stroke="${color}" stroke-width="2" fill="none" opacity="0.9">
          <!-- Central pod -->
          <ellipse cx="150" cy="110" rx="35" ry="25" fill="${color}" fill-opacity="0.3" />
          <circle cx="150" cy="110" r="10" stroke="#ffffff" fill="${color}" />
          <!-- 4 Rotor Arms -->
          <line x1="120" y1="90" x2="70" y2="65" stroke-width="3" />
          <ellipse cx="70" cy="65" rx="22" ry="7" fill="${color}" fill-opacity="0.2" />
          <line x1="180" y1="90" x2="230" y2="65" stroke-width="3" />
          <ellipse cx="230" cy="65" rx="22" ry="7" fill="${color}" fill-opacity="0.2" />
          <line x1="120" y1="130" x2="70" y2="155" stroke-width="3" />
          <ellipse cx="70" cy="155" rx="22" ry="7" fill="${color}" fill-opacity="0.2" />
          <line x1="180" y1="130" x2="230" y2="155" stroke-width="3" />
          <ellipse cx="230" cy="155" rx="22" ry="7" fill="${color}" fill-opacity="0.2" />
        </g>
      `;

    case 'gear_tap':
      return `
        <!-- Cyberdeck Terminal silhouette -->
        <g stroke="${color}" stroke-width="2" fill="none" opacity="0.9">
          <!-- Body Deck -->
          <rect x="75" y="70" width="150" height="95" rx="6" fill="${color}" fill-opacity="0.18" />
          <!-- Display Screen -->
          <rect x="90" y="80" width="80" height="50" rx="3" fill="#000000" fill-opacity="0.6" stroke="${color}" stroke-width="1.5" />
          <line x1="95" y1="90" x2="150" y2="90" stroke="${color}" stroke-dasharray="3 2" />
          <line x1="95" y1="100" x2="160" y2="100" stroke="${color}" stroke-dasharray="4 2" />
          <line x1="95" y1="110" x2="135" y2="110" stroke="${color}" stroke-dasharray="2 2" />
          <!-- Keypad / Mod slots -->
          <rect x="180" y="80" width="35" height="75" rx="2" fill="${color}" fill-opacity="0.15" />
          <!-- Memory cables -->
          <path d="M 75 130 C 50 140 45 160 30 165" stroke-width="3" />
        </g>
      `;

    case 'pharma':
      return `
        <!-- Hypodermic Stim Injector silhouette -->
        <g stroke="${color}" stroke-width="2" fill="none" opacity="0.9">
          <!-- Cylinder Body -->
          <rect x="90" y="90" width="120" height="30" rx="5" fill="${color}" fill-opacity="0.2" />
          <!-- Fluid chamber -->
          <rect x="110" y="95" width="70" height="20" rx="2" fill="${color}" fill-opacity="0.5" />
          <line x1="125" y1="95" x2="125" y2="115" stroke="#ffffff" />
          <line x1="145" y1="95" x2="145" y2="115" stroke="#ffffff" />
          <line x1="165" y1="95" x2="165" y2="115" stroke="#ffffff" />
          <!-- Needle / Injector port -->
          <polygon points="90,105 50,105 50,103 40,105 50,107 50,105" fill="${color}" />
          <!-- Plunger -->
          <rect x="210" y="98" width="35" height="14" fill="${color}" fill-opacity="0.3" />
          <line x1="245" y1="90" x2="245" y2="120" stroke-width="4" />
        </g>
      `;

    case 'weapon_mods':
    default:
      return `
        <!-- Weapon Mod Scope / Attachment silhouette -->
        <g stroke="${color}" stroke-width="2" fill="none" opacity="0.9">
          <!-- Tubular Scope Body -->
          <rect x="70" y="90" width="160" height="30" rx="4" fill="${color}" fill-opacity="0.2" />
          <!-- Bell Objective Lens & Eyepiece -->
          <polygon points="70,90 55,80 55,130 70,120" fill="${color}" fill-opacity="0.3" />
          <polygon points="230,90 245,85 245,125 230,120" fill="${color}" fill-opacity="0.3" />
          <!-- Turrets -->
          <rect x="140" y="78" width="20" height="12" fill="${color}" />
          <!-- Crosshair internal glow -->
          <line x1="150" y1="95" x2="150" y2="115" stroke="#ffffff" stroke-width="1.5" />
          <line x1="135" y1="105" x2="165" y2="105" stroke="#ffffff" stroke-width="1.5" />
        </g>
      `;
  }
}

/**
 * Generates an SVG Data URI containing a procedural tactical cyberpunk blueprint
 * that renders reliably on any environment (local, preview, and GitHub Pages).
 */
export function generateHologramBlueprint(item: EquipmentItem): string {
  const { primary, text } = getRarityColor(item.rarity);
  const categoryVector = getCategoryVector(item.category, primary);

  // Clean strings for SVG XML
  const cleanName = (item.name || 'SPEC').replace(/[<>&"]/g, '');
  const cleanMfg = (item.manufacturer || 'NIGHT CITY CORPO').toUpperCase().replace(/[<>&"]/g, '');
  const cleanCategory = (item.categoryLabel || item.category || '').toUpperCase().replace(/[<>&"]/g, '');
  const cleanRarity = (item.rarityLabel || item.rarity || '').toUpperCase().replace(/[<>&"]/g, '');
  const cleanOrigin = (item.origin || 'SPEC 2077').toUpperCase().replace(/[<>&"]/g, '');

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 210" width="100%" height="100%" style="background:#070a12; font-family:'Rajdhani','Orbitron',monospace,sans-serif;">
  <defs>
    <!-- Background Grid -->
    <pattern id="grid_${item.id}" width="15" height="15" patternUnits="userSpaceOnUse">
      <path d="M 15 0 L 0 0 0 15" fill="none" stroke="${primary}" stroke-width="0.5" stroke-opacity="0.12" />
    </pattern>
    <radialGradient id="vignette_${item.id}" cx="50%" cy="50%" r="65%">
      <stop offset="0%" stop-color="${primary}" stop-opacity="0.15" />
      <stop offset="70%" stop-color="#070a12" stop-opacity="0.85" />
      <stop offset="100%" stop-color="#04060a" stop-opacity="0.98" />
    </radialGradient>
    <filter id="glow_${item.id}" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background Layer -->
  <rect width="100%" height="100%" fill="#070a12" />
  <rect width="100%" height="100%" fill="url(#grid_${item.id})" />
  <rect width="100%" height="100%" fill="url(#vignette_${item.id})" />

  <!-- Outer HUD Frame -->
  <rect x="6" y="6" width="288" height="198" rx="4" fill="none" stroke="${primary}" stroke-width="1" stroke-opacity="0.4" />
  
  <!-- Tactical Corner Brackets -->
  <path d="M 6 20 L 6 6 L 20 6" fill="none" stroke="${primary}" stroke-width="2.5" />
  <path d="M 280 6 L 294 6 L 294 20" fill="none" stroke="${primary}" stroke-width="2.5" />
  <path d="M 6 190 L 6 204 L 20 204" fill="none" stroke="${primary}" stroke-width="2.5" />
  <path d="M 280 204 L 294 204 L 294 190" fill="none" stroke="${primary}" stroke-width="2.5" />

  <!-- Holographic Reticle / Scope Targets -->
  <circle cx="150" cy="110" r="68" fill="none" stroke="${primary}" stroke-width="0.8" stroke-opacity="0.25" stroke-dasharray="4 6" />
  <circle cx="150" cy="110" r="38" fill="none" stroke="${primary}" stroke-width="0.8" stroke-opacity="0.35" />
  <line x1="150" y1="36" x2="150" y2="184" stroke="${primary}" stroke-width="0.5" stroke-opacity="0.2" stroke-dasharray="3 3" />
  <line x1="76" y1="110" x2="224" y2="110" stroke="${primary}" stroke-width="0.5" stroke-opacity="0.2" stroke-dasharray="3 3" />

  <!-- Center Blueprint Vector Silhouette -->
  <g filter="url(#glow_${item.id})">
    ${categoryVector}
  </g>

  <!-- Header HUD Taglines -->
  <text x="14" y="22" fill="${text}" font-size="9" font-weight="700" letter-spacing="1.5">
    SCHÉMA MIL-SPEC // ${cleanOrigin}
  </text>
  <text x="286" y="22" text-anchor="end" fill="${primary}" font-size="8" font-weight="600" opacity="0.8" letter-spacing="1">
    [${cleanRarity}]
  </text>

  <!-- Central Watermark Hologram Label -->
  <text x="150" y="44" text-anchor="middle" fill="#ffffff" font-size="10" font-weight="800" opacity="0.85" letter-spacing="1">
    ${cleanName.slice(0, 32)}
  </text>
  
  <text x="150" y="176" text-anchor="middle" fill="${primary}" font-size="8" font-weight="700" opacity="0.75" letter-spacing="2">
    ${cleanMfg} // ${cleanCategory}
  </text>

  <!-- Bottom HUD Status Bar -->
  <line x1="12" y1="188" x2="288" y2="188" stroke="${primary}" stroke-width="0.7" stroke-opacity="0.3" />
  <text x="14" y="199" fill="${text}" font-size="7.5" font-family="monospace" opacity="0.7">
    SEC-ID: #${item.id.slice(0, 12).toUpperCase()}
  </text>
  <text x="286" y="199" text-anchor="end" fill="#22d3ee" font-size="7.5" font-weight="bold" font-family="monospace">
    HOLOGRAMME ACTIF ⚡
  </text>
</svg>
  `.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
