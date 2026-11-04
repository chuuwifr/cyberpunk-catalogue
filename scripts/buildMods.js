import fs from "fs";

const raw = JSON.parse(fs.readFileSync("scripts/wiki_mods_raw.json", "utf-8"));

function getCleanUrl(title) {
  const item = raw[title];
  if (!item || !item.thumb) {
    throw new Error("Missing thumb for: " + title);
  }
  return item.thumb.replace(/\/revision\/latest\/.*$/, "/revision/latest");
}

const items = [
  // ==================== ATTACHMENTS: SHORT SCOPES (7) ====================
  {
    wikiTitle: "Add-Vantage",
    id: "att-add-vantage",
    name: "Viseur Court Add-Vantage",
    subType: "Viseur Court",
    rarity: "common",
    rarityLabel: "Commun",
    manufacturer: "Budget Arms",
    description: "Viseur reflex holographique économique produit par Budget Arms. Projette un réticule lumineux simple mais net, idéal pour l'acquisition rapide de cibles à courte et moyenne portée.",
    flavorQuote: "« Pas cher, pas compliqué, il met le point rouge là où la balle va frapper. »",
    fallbackIcon: "Crosshair",
    red: {
      priceEb: 100,
      availability: "Standard",
      concealable: true,
    },
    iz: {
      priceCredits: 200,
      quality: "Streetware",
      cybertension: 0,
      weightKg: 0.1,
      notes: "Viseur Reflex : Réduit de 1 point le malus de Tir Rapide et confère +1 aux jets de Tir à portée Courte.",
    },
    tags: ["accessoire", "viseur", "court", "budget arms", "optique", "weapon_mods"]
  },
  {
    wikiTitle: "CQO Kanone MINI Mk.72",
    id: "att-cqo-kanone-mini",
    name: "Viseur Tactique CQO Kanone MINI Mk.72",
    subType: "Viseur Court",
    rarity: "rare",
    rarityLabel: "Rare",
    manufacturer: "Kiroshi Optics",
    description: "Viseur holographique miniature haute clarté conçu par Kiroshi Optics pour les opérations en milieu clos (CQC). Son prisme à transmission quantique élimine toute réfraction lumineuse parasite.",
    flavorQuote: "« Conçu pour les couloirs étroits où chaque milliseconde décide de qui reste debout. »",
    fallbackIcon: "Crosshair",
    red: {
      priceEb: 300,
      availability: "Coûteux",
      concealable: true,
    },
    iz: {
      priceCredits: 600,
      quality: "Corpware",
      cybertension: 0,
      weightKg: 0.1,
      notes: "Optique CQC de précision : Confère +1 aux jets de Tir à portée Courte et Moyenne. Ignore 1 point de malus d'obscurité ou de fumée légère.",
    },
    tags: ["accessoire", "viseur", "cqc", "kiroshi", "optique", "weapon_mods"]
  },
  {
    wikiTitle: "ClearVue Mk.8",
    id: "att-clearvue-mk8",
    name: "Viseur Reflex ClearVue Mk.8",
    subType: "Viseur Court",
    rarity: "uncommon",
    rarityLabel: "Peu commun",
    manufacturer: "Zetatech",
    description: "Viseur panoramique tubulaire à cadre ultra-fin en fibre de carbone offrant un champ visuel dégagé sans angle mort pour armes de poing et pistolets-mitrailleurs.",
    fallbackIcon: "Crosshair",
    red: {
      priceEb: 150,
      availability: "Standard",
      concealable: true,
    },
    iz: {
      priceCredits: 350,
      quality: "Standard",
      cybertension: 0,
      weightKg: 0.1,
      notes: "Champ large : Confère +1 aux jets de Tir contre les cibles en mouvement rapide.",
    },
    tags: ["accessoire", "viseur", "court", "zetatech", "reflex", "weapon_mods"]
  },
  {
    wikiTitle: "Handyman",
    id: "att-handyman",
    name: "Viseur de Fortune « Handyman »",
    subType: "Viseur Court",
    rarity: "common",
    rarityLabel: "Commun",
    manufacturer: "Artisanal / Street Tech",
    description: "Viseur artisanal monté à partir de lentilles de récupération et de diodes LED industrielles. Rude et spartiate, mais redoutablement efficace entre les mains d'un edgerunner débrouillard.",
    fallbackIcon: "Crosshair",
    red: {
      priceEb: 50,
      availability: "Standard",
      concealable: true,
    },
    iz: {
      priceCredits: 100,
      quality: "Gutterware",
      cybertension: 0,
      weightKg: 0.2,
      notes: "Bricolage de rue : Réduit le malus de visée de 1 point à portée Courte.",
    },
    tags: ["accessoire", "viseur", "artisanal", "streetware", "weapon_mods"]
  },
  {
    wikiTitle: "Hyakume",
    id: "att-hyakume",
    name: "Viseur Point Rouge Tsunami « Hyakume »",
    subType: "Viseur Court",
    rarity: "rare",
    rarityLabel: "Rare",
    manufacturer: "Tsunami Defense Systems",
    description: "Viseur haut de gamme intégrant un calculateur de point d'impact laser gyrostabilisé conçu par Tsunami Defense Systems pour leurs armes de précision légères.",
    fallbackIcon: "Crosshair",
    red: {
      priceEb: 350,
      availability: "Coûteux",
      concealable: true,
    },
    iz: {
      priceCredits: 700,
      quality: "Corpware",
      cybertension: 0,
      weightKg: 0.15,
      notes: "Point rouge gyrostabilisé : +1 au Tir et élimine le premier point de malus de recul lors d'un tir simple.",
    },
    tags: ["accessoire", "viseur", "tsunami", "optique", "precision", "weapon_mods"]
  },
  {
    wikiTitle: "Kanetsugu",
    id: "att-kanetsugu",
    name: "Viseur Holographique Arasaka « Kanetsugu »",
    subType: "Viseur Court",
    rarity: "rare",
    rarityLabel: "Rare",
    manufacturer: "Arasaka",
    description: "Optique de standard corporatiste Arasaka équipant les officiers de sécurité d'élite. Projette une grille réticulaire multicouche intégrant télémétrie et estimation de distance.",
    fallbackIcon: "Crosshair",
    red: {
      priceEb: 400,
      availability: "Coûteux",
      concealable: true,
    },
    iz: {
      priceCredits: 800,
      quality: "Milware",
      cybertension: 0,
      weightKg: 0.15,
      notes: "Télémétrie militaire Arasaka : +1 au Tir à portée Courte et Moyenne. Confère +1 pour effectuer un Tir Ciblé (Coup Précis).",
    },
    tags: ["accessoire", "viseur", "arasaka", "holographique", "weapon_mods"]
  },
  {
    wikiTitle: "Type 2067",
    id: "att-type-2067",
    name: "Viseur Optique Kang Tao « Type 2067 »",
    subType: "Viseur Court",
    rarity: "uncommon",
    rarityLabel: "Peu commun",
    manufacturer: "Kang Tao",
    description: "Viseur robuste à calibration intelligente Kang Tao, spécialement synchronisé pour optimiser l'alignement balistique des armes cinétiques et intelligentes.",
    fallbackIcon: "Crosshair",
    red: {
      priceEb: 200,
      availability: "Standard",
      concealable: true,
    },
    iz: {
      priceCredits: 450,
      quality: "Corpware",
      cybertension: 0,
      weightKg: 0.15,
      notes: "Synchronisation Kang Tao : +1 au Tir lors de l'utilisation d'armes Smart ou cinétiques à haute cadence.",
    },
    tags: ["accessoire", "viseur", "kang tao", "optique", "weapon_mods"]
  },

  // ==================== ATTACHMENTS: LONG & SNIPER SCOPES (9) ====================
  {
    wikiTitle: "E255 Percipient",
    id: "att-e255-percipient",
    name: "Lunette Tactique Arasaka E255 Percipient",
    subType: "Lunette Longue",
    rarity: "uncommon",
    rarityLabel: "Peu commun",
    manufacturer: "Arasaka",
    description: "Lunette grossissement moyen 3x pour fusils d'assaut et carabines de tireur désigné, assurant une clarté optique exceptionnelle dans les engagements à moyenne distance.",
    fallbackIcon: "Crosshair",
    red: {
      priceEb: 250,
      availability: "Standard",
      concealable: false,
    },
    iz: {
      priceCredits: 500,
      quality: "Corpware",
      cybertension: 0,
      weightKg: 0.4,
      notes: "Grossissement 3x : Réduit de 2 points les malus de distance à portée Moyenne et Longue si le tireur effectue une action de Visée.",
    },
    tags: ["accessoire", "lunette", "longue", "arasaka", "zoom", "weapon_mods"]
  },
  {
    wikiTitle: "E305 Prospecta",
    id: "att-e305-prospecta",
    name: "Lunette Militaire Arasaka E305 Prospecta",
    subType: "Lunette Longue",
    rarity: "rare",
    rarityLabel: "Rare",
    manufacturer: "Arasaka",
    description: "Optique de combat à télémétrie laser intégrée et zoom variable 4x-8x pour fusils de précision et snipers de surveillance corporatiste.",
    fallbackIcon: "Crosshair",
    red: {
      priceEb: 500,
      availability: "Coûteux",
      concealable: false,
    },
    iz: {
      priceCredits: 1000,
      quality: "Milware",
      cybertension: 0,
      weightKg: 0.6,
      notes: "Télémètre laser Arasaka : +2 aux jets de Tir à portée Longue ou Extrême après une action de Visée.",
    },
    tags: ["accessoire", "lunette", "precision", "arasaka", "sniper", "weapon_mods"]
  },
  {
    wikiTitle: "Gaki",
    id: "att-gaki",
    name: "Lunette Sniper Arasaka « Gaki »",
    subType: "Lunette Sniper",
    rarity: "rare",
    rarityLabel: "Rare",
    manufacturer: "Arasaka",
    description: "Lunette pour fusils de sniper lourds intégrant un filtre antireflet thermique et un compensateur de dérive éolienne automatique.",
    fallbackIcon: "Crosshair",
    red: {
      priceEb: 600,
      availability: "Coûteux",
      concealable: false,
    },
    iz: {
      priceCredits: 1200,
      quality: "Milware",
      cybertension: 0,
      weightKg: 0.7,
      notes: "Compensateur éolien : Ignore les pénalités de vent et de météo défavorable lors des tirs à longue distance. +2 au Tir avec Visée.",
    },
    tags: ["accessoire", "lunette", "sniper", "arasaka", "vent", "weapon_mods"]
  },
  {
    wikiTitle: "HPO Kanone MAX Mk.77",
    id: "att-hpo-kanone-max",
    name: "Lunette Sniper Lourde HPO Kanone MAX Mk.77",
    subType: "Lunette Sniper",
    rarity: "very_rare",
    rarityLabel: "Très Rare",
    manufacturer: "Militech",
    description: "Le monstre optique de l'armée Militech : zoom 12x à stabilisation magnéto-inertielle conçu pour les snipers antichars et tirs au-delà du kilomètre.",
    flavorQuote: "« Si vous pouvez voir leur ombre à travers la brume, cette lunette placera la balle entre leurs deux yeux. »",
    fallbackIcon: "Crosshair",
    red: {
      priceEb: 1000,
      availability: "Très coûteux",
      concealable: false,
    },
    iz: {
      priceCredits: 2200,
      quality: "Milware",
      cybertension: 0,
      weightKg: 0.9,
      notes: "Stabilisation inertielle Militech : Permet d'ignorer entièrement les malus de portée Extrême lors d'une Visée. PA +1 sur tir visé.",
    },
    tags: ["accessoire", "lunette", "sniper", "militech", "lourd", "extreme", "weapon_mods"]
  },
  {
    wikiTitle: "Jue",
    id: "att-jue",
    name: "Lunette de Précision Kang Tao « Jue »",
    subType: "Lunette Longue",
    rarity: "rare",
    rarityLabel: "Rare",
    manufacturer: "Kang Tao",
    description: "Optique de précision à acquisition thermique Kang Tao, mettant automatiquement en surbrillance le profil thermique des tireurs embusqués.",
    fallbackIcon: "Crosshair",
    red: {
      priceEb: 500,
      availability: "Coûteux",
      concealable: false,
    },
    iz: {
      priceCredits: 1100,
      quality: "Corpware",
      cybertension: 0,
      weightKg: 0.5,
      notes: "Vision thermique intégrée : Ignore jusqu'à 4 points de malus d'obscurité, de brouillard ou de camouflage optique ennemi.",
    },
    tags: ["accessoire", "lunette", "thermique", "kang tao", "weapon_mods"]
  },
  {
    wikiTitle: "Kairo SA-1",
    id: "att-kairo-sa1",
    name: "Lunette Hybride Kairo SA-1",
    subType: "Lunette Longue",
    rarity: "uncommon",
    rarityLabel: "Peu commun",
    manufacturer: "Kiroshi Optics",
    description: "Système optique à bascule permettant d'alterner instantanément entre point rouge sans grossissement pour le CQC et zoom 4x pour le tir posé.",
    fallbackIcon: "Crosshair",
    red: {
      priceEb: 300,
      availability: "Standard",
      concealable: false,
    },
    iz: {
      priceCredits: 650,
      quality: "Hyperchrome",
      cybertension: 0,
      weightKg: 0.45,
      notes: "Optique à bascule : Le tireur peut choisir à chaque tour entre bonus de visée réflexe (+1 Tir courte portée) ou réduction de portée (Visée 4x).",
    },
    tags: ["accessoire", "lunette", "kiroshi", "hybride", "bascule", "weapon_mods"]
  },
  {
    wikiTitle: "Mk.2x Grandstand",
    id: "att-mk2x-grandstand",
    name: "Viseur Agrandisseur Mk.2x Grandstand",
    subType: "Lunette Longue",
    rarity: "common",
    rarityLabel: "Commun",
    manufacturer: "Budget Arms",
    description: "Module de grossissement 2x abordable s'alignant derrière un viseur holographique pour doubler la portée pratique sans encombrer l'arme.",
    fallbackIcon: "Crosshair",
    red: {
      priceEb: 150,
      availability: "Standard",
      concealable: false,
    },
    iz: {
      priceCredits: 300,
      quality: "Standard",
      cybertension: 0,
      weightKg: 0.3,
      notes: "Agrandisseur 2x : Réduit le malus de portée Moyenne de 1 point.",
    },
    tags: ["accessoire", "lunette", "budget arms", "2x", "weapon_mods"]
  },
  {
    wikiTitle: "OS-1 GimletEye",
    id: "att-os1-gimleteye",
    name: "Lunette d'Acquisition Rapide OS-1 GimletEye",
    subType: "Lunette Longue",
    rarity: "uncommon",
    rarityLabel: "Peu commun",
    manufacturer: "Zetatech",
    description: "Lunette compacte à prisme grand angle conçue pour les patrouilles de sécurité urbaine, alliant champ panoramique et zoom 3.5x.",
    fallbackIcon: "Crosshair",
    red: {
      priceEb: 250,
      availability: "Standard",
      concealable: false,
    },
    iz: {
      priceCredits: 550,
      quality: "Standard",
      cybertension: 0,
      weightKg: 0.4,
      notes: "Acquisition rapide : +1 au Tir contre les cibles situées à portée Moyenne.",
    },
    tags: ["accessoire", "lunette", "zetatech", "panoramique", "weapon_mods"]
  },
  {
    wikiTitle: "SO-21 Saika",
    id: "att-so21-saika",
    name: "Lunette de Tireur d'Élite SO-21 Saika",
    subType: "Lunette Sniper",
    rarity: "very_rare",
    rarityLabel: "Très Rare",
    manufacturer: "Tsunami Defense Systems",
    description: "Chef-d'œuvre de l'optique balistique japonaise intégrant des lentilles à nanocristaux synthétiques traitées au diamant pour une définition micrométrique.",
    fallbackIcon: "Crosshair",
    red: {
      priceEb: 800,
      availability: "Très coûteux",
      concealable: false,
    },
    iz: {
      priceCredits: 1800,
      quality: "Corpware",
      cybertension: 0,
      weightKg: 0.65,
      notes: "Optique de maître tireur : Confère l'Atout Tireur d'élite. Toute Relance sur un jet de Tir ciblé inflige +1d6 dégâts additionnels.",
    },
    tags: ["accessoire", "lunette", "tsunami", "sniper", "elite", "weapon_mods"]
  },

  // ==================== ATTACHMENTS: SILENCERS (4) ====================
  {
    wikiTitle: "CS-1 Taipan",
    id: "att-cs1-taipan",
    name: "Silencieux Militech CS-1 Taipan",
    subType: "Silencieux",
    rarity: "rare",
    rarityLabel: "Rare",
    manufacturer: "Militech",
    description: "Modérateur de son militaire compact pour armes de poing et fusils légers. Élimine 95% de la signature acoustique et flash de bouche tout en doublant les dégâts en attaque furtive.",
    flavorQuote: "« Les morts ne crient pas, et avec ce silencieux, leurs voisins n'entendent rien non plus. »",
    fallbackIcon: "Shield",
    red: {
      priceEb: 300,
      availability: "Coûteux",
      concealable: true,
    },
    iz: {
      priceCredits: 650,
      quality: "Milware",
      cybertension: 0,
      weightKg: 0.25,
      notes: "Suppression acoustique totale : +4 aux jets de Discrétion lors d'un tir embusqué. Attaque surprise inflige +2 dégâts supplémentaires.",
    },
    tags: ["accessoire", "silencieux", "militech", "furtivite", "discretion", "weapon_mods"]
  },
  {
    wikiTitle: "XC-10 Strix",
    id: "att-xc10-strix",
    name: "Silencieux Tactique XC-10 Strix",
    subType: "Silencieux",
    rarity: "uncommon",
    rarityLabel: "Peu commun",
    manufacturer: "Arasaka",
    description: "Silencieux multi-chambres avec déflecteurs en tungstène conçu pour absorber les ondes de choc des cartouches à haute pression sans altérer la vélocité balistique.",
    fallbackIcon: "Shield",
    red: {
      priceEb: 250,
      availability: "Standard",
      concealable: true,
    },
    iz: {
      priceCredits: 500,
      quality: "Corpware",
      cybertension: 0,
      weightKg: 0.3,
      notes: "Atténuation sonore avancée : Tir inaudible au-delà de 6 cases. Confère +2 aux tests d'Infiltration lors des tirs.",
    },
    tags: ["accessoire", "silencieux", "arasaka", "strix", "weapon_mods"]
  },
  {
    wikiTitle: "XC-10 Cetus",
    id: "att-xc10-cetus",
    name: "Modérateur de Son Lourd XC-10 Cetus",
    subType: "Silencieux",
    rarity: "rare",
    rarityLabel: "Rare",
    manufacturer: "Zetatech",
    description: "Silencieux lourd surdimensionné pour fusils d'assaut et mitraillettes de gros calibre, refroidissant les gaz de combustion grâce à un gel polymère dissipatif.",
    fallbackIcon: "Shield",
    red: {
      priceEb: 350,
      availability: "Coûteux",
      concealable: false,
    },
    iz: {
      priceCredits: 750,
      quality: "Hyperchrome",
      cybertension: 0,
      weightKg: 0.45,
      notes: "Dissipation de gros calibre : Réduit le recul de 1 point et supprime le flash lumineux nocturne.",
    },
    tags: ["accessoire", "silencieux", "lourd", "zetatech", "fusil", "weapon_mods"]
  },
  {
    wikiTitle: "TSX Tocororo",
    id: "att-tsx-tocororo",
    name: "Silencieux Furtif TSX Tocororo",
    subType: "Silencieux",
    rarity: "common",
    rarityLabel: "Commun",
    manufacturer: "Budget Arms",
    description: "Silencieux cylindrique basique mais très répandu dans les ruelles de Santo Domingo et Heywood, facile à visser sur n'importe quel canon fileté 9mm ou 11mm.",
    fallbackIcon: "Shield",
    red: {
      priceEb: 100,
      availability: "Standard",
      concealable: true,
    },
    iz: {
      priceCredits: 250,
      quality: "Streetware",
      cybertension: 0,
      weightKg: 0.2,
      notes: "Silencieux de rue : Réduit le bruit des tirs (inaudible à plus de 12 cases), +1 aux jets de Discrétion.",
    },
    tags: ["accessoire", "silencieux", "budget arms", "streetware", "weapon_mods"]
  },

  // ==================== ATTACHMENTS: MUZZLE BRAKES (10) ====================
  {
    wikiTitle: "RC-7 Strigoi",
    id: "att-rc7-strigoi",
    name: "Frein de Bouche RC-7 Strigoi",
    subType: "Frein de Bouche",
    rarity: "uncommon",
    rarityLabel: "Peu commun",
    manufacturer: "Militech",
    description: "Frein de bouche pour fusils d'assaut doté d'évents latéraux inclinés à 45° qui canalisent les gaz vers l'arrière pour neutraliser le recul horizontal.",
    fallbackIcon: "Sliders",
    red: {
      priceEb: 150,
      availability: "Standard",
      concealable: true,
    },
    iz: {
      priceCredits: 350,
      quality: "Milware",
      cybertension: 0,
      weightKg: 0.15,
      notes: "Compensation latérale : Réduit le malus de Tir Automatique de 1 point pour les fusils d'assaut et SMG.",
    },
    tags: ["accessoire", "frein de bouche", "militech", "recul", "weapon_mods"]
  },
  {
    wikiTitle: "RC-7 Zaar",
    id: "att-rc7-zaar",
    name: "Compensateur de Recul Lourd RC-7 Zaar",
    subType: "Frein de Bouche",
    rarity: "rare",
    rarityLabel: "Rare",
    manufacturer: "Militech",
    description: "Compensateur d'infanterie lourde Militech conçu pour dompter le recul féroce des mitrailleuses légères et des fusils de combat tactiques.",
    fallbackIcon: "Sliders",
    red: {
      priceEb: 250,
      availability: "Coûteux",
      concealable: true,
    },
    iz: {
      priceCredits: 600,
      quality: "Milware",
      cybertension: 0,
      weightKg: 0.25,
      notes: "Contrôle de recul lourd : Réduit de 2 points le malus de Recul sur toutes les armes automatiques.",
    },
    tags: ["accessoire", "compensateur", "militech", "lourd", "weapon_mods"]
  },
  {
    wikiTitle: "RC-7 Varkolak",
    id: "att-rc7-varkolak",
    name: "Frein de Bouche Anti-Relèvement RC-7 Varkolak",
    subType: "Frein de Bouche",
    rarity: "uncommon",
    rarityLabel: "Peu commun",
    manufacturer: "Arasaka",
    description: "Buse d'échappement verticale rejetant les gaz vers le haut pour coller le canon vers le bas lors des tirs en rafale continue.",
    fallbackIcon: "Sliders",
    red: {
      priceEb: 180,
      availability: "Standard",
      concealable: true,
    },
    iz: {
      priceCredits: 400,
      quality: "Corpware",
      cybertension: 0,
      weightKg: 0.15,
      notes: "Anti-relèvement : Permet d'effectuer des rafales de 3 coups sans subir de dispersion verticale.",
    },
    tags: ["accessoire", "frein de bouche", "arasaka", "rafale", "weapon_mods"]
  },
  {
    wikiTitle: "RC-7 Aswang",
    id: "att-rc7-aswang",
    name: "Compensateur Haute Vélocité RC-7 Aswang",
    subType: "Frein de Bouche",
    rarity: "rare",
    rarityLabel: "Rare",
    manufacturer: "Kang Tao",
    description: "Compensateur aérodynamique stabilisant la trajectoire des ogives dès leur sortie de bouche, maximisant la portée pratique.",
    fallbackIcon: "Sliders",
    red: {
      priceEb: 220,
      availability: "Coûteux",
      concealable: true,
    },
    iz: {
      priceCredits: 500,
      quality: "Corpware",
      cybertension: 0,
      weightKg: 0.15,
      notes: "Vélocité accrue : Augmente la portée Courte et Moyenne de l'arme de 2 cases.",
    },
    tags: ["accessoire", "compensateur", "kang tao", "portee", "weapon_mods"]
  },
  {
    wikiTitle: "RC-7 Ifrit",
    id: "att-rc7-ifrit",
    name: "Frein de Bouche Dissipateur RC-7 Ifrit",
    subType: "Frein de Bouche",
    rarity: "rare",
    rarityLabel: "Rare",
    manufacturer: "Zetatech",
    description: "Embout en alliage céramique aérospatial dissipant la chaleur des tirs continus et réduisant le flash aveuglant des cartouches magnum.",
    fallbackIcon: "Sliders",
    red: {
      priceEb: 200,
      availability: "Coûteux",
      concealable: true,
    },
    iz: {
      priceCredits: 480,
      quality: "Hyperchrome",
      cybertension: 0,
      weightKg: 0.2,
      notes: "Dissipation thermique : Empêche la surchauffe de l'arme et élimine tout risque d'enrayement lors de tirs soutenus.",
    },
    tags: ["accessoire", "frein de bouche", "zetatech", "chaleur", "weapon_mods"]
  },
  {
    wikiTitle: "RC-7 Yokai",
    id: "att-rc7-yokai",
    name: "Compensateur Tactique Arasaka RC-7 Yokai",
    subType: "Frein de Bouche",
    rarity: "rare",
    rarityLabel: "Rare",
    manufacturer: "Arasaka",
    description: "Compensateur de précision usiné dans un bloc de titane pour les armes de tireurs d'élite urbains de la corporation Arasaka.",
    fallbackIcon: "Sliders",
    red: {
      priceEb: 280,
      availability: "Coûteux",
      concealable: true,
    },
    iz: {
      priceCredits: 620,
      quality: "Corpware",
      cybertension: 0,
      weightKg: 0.18,
      notes: "Précision Arasaka : +1 à tous les jets de Tir lors d'un tir en semi-automatique posé.",
    },
    tags: ["accessoire", "compensateur", "arasaka", "precision", "weapon_mods"]
  },
  {
    wikiTitle: "RC-7 Kutrub",
    id: "att-rc7-kutrub",
    name: "Frein de Bouche SMG RC-7 Kutrub",
    subType: "Frein de Bouche",
    rarity: "common",
    rarityLabel: "Commun",
    manufacturer: "Budget Arms",
    description: "Frein de bouche compact conçu spécifiquement pour les pistolets-mitrailleurs à cadence effrénée pour resserrer le cône de dispersion.",
    fallbackIcon: "Sliders",
    red: {
      priceEb: 120,
      availability: "Standard",
      concealable: true,
    },
    iz: {
      priceCredits: 280,
      quality: "Standard",
      cybertension: 0,
      weightKg: 0.12,
      notes: "Contrôle SMG : +1 au toucher lors de l'utilisation d'une arme de catégorie Mitraillette en tir continu.",
    },
    tags: ["accessoire", "frein de bouche", "smg", "budget arms", "weapon_mods"]
  },
  {
    wikiTitle: "RC-7 Dybbuk",
    id: "att-rc7-dybbuk",
    name: "Compensateur Pistolet RC-7 Dybbuk",
    subType: "Frein de Bouche",
    rarity: "uncommon",
    rarityLabel: "Peu commun",
    manufacturer: "Nokota",
    description: "Compensateur de bouche ultra-léger pour armes de poing réduisant le fouet du canon lors des tirs à répétition rapide.",
    fallbackIcon: "Sliders",
    red: {
      priceEb: 140,
      availability: "Standard",
      concealable: true,
    },
    iz: {
      priceCredits: 320,
      quality: "Standard",
      cybertension: 0,
      weightKg: 0.1,
      notes: "Stabilité d'arme de poing : Permet de tirer 2 fois par tour avec un pistolet sans pénalité de recul cumulée.",
    },
    tags: ["accessoire", "compensateur", "pistolet", "nokota", "weapon_mods"]
  },
  {
    wikiTitle: "RC-7 Babaroga",
    id: "att-rc7-babaroga",
    name: "Compensateur Lourd Anti-Dispersion RC-7 Babaroga",
    subType: "Frein de Bouche",
    rarity: "very_rare",
    rarityLabel: "Très Rare",
    manufacturer: "Rostović",
    description: "Monstrueux compensateur d'origine néo-soviétique Rostović usiné pour les revolvers lourds et canons à main de calibre 12mm et plus.",
    flavorQuote: "« Quand vous tirez du calibre lourd, le Babaroga s'assure que le recul brise les cibles, pas votre poignet. »",
    fallbackIcon: "Sliders",
    red: {
      priceEb: 400,
      availability: "Très coûteux",
      concealable: false,
    },
    iz: {
      priceCredits: 900,
      quality: "Milware",
      cybertension: 0,
      weightKg: 0.35,
      notes: "Maîtrise des calibres lourds : Annule la condition de Force minimale pour tirer avec les armes de poing très lourdes (ex: Burya, Overture).",
    },
    tags: ["accessoire", "compensateur", "rostovic", "revolver", "lourd", "weapon_mods"]
  },
  {
    wikiTitle: "RC-7 Liger",
    id: "att-rc7-liger",
    name: "Compensateur Balistique RC-7 Liger",
    subType: "Frein de Bouche",
    rarity: "uncommon",
    rarityLabel: "Peu commun",
    manufacturer: "Constitutional Arms",
    description: "Compensateur équilibré pour fusils à pompe et armes de poing de défense personnelle, améliorant la reprise de visée après chaque coup.",
    fallbackIcon: "Sliders",
    red: {
      priceEb: 160,
      availability: "Standard",
      concealable: true,
    },
    iz: {
      priceCredits: 360,
      quality: "Standard",
      cybertension: 0,
      weightKg: 0.15,
      notes: "Reprise de visée : Confère +1 au Tir sur la seconde attaque consécutive contre la même cible.",
    },
    tags: ["accessoire", "compensateur", "constitutional arms", "weapon_mods"]
  },

  // ==================== MODS: CHIMERA CORE (4 ICONIC PHANTOM LIBERTY) ====================
  {
    wikiTitle: "Firecracker",
    id: "mod-firecracker",
    name: "Pétard Explosif (Firecracker) [Mod Chimère]",
    subType: "Mod d'Arme Cinétique",
    rarity: "legendary",
    rarityLabel: "Iconique / Légendaire",
    manufacturer: "Militech (Noyau de Chimère)",
    description: "Mod d'arme légendaire forgé à partir du noyau du blindé expérimental Chimère de Dogtown. Convertit instantanément tous les projectiles d'armes cinétiques (Power) en micro-ogives explosives à fragmentation dévastatrice.",
    flavorQuote: "« Chaque balle tirée claque comme une grenade artisanale au visage de l'ennemi. »",
    fallbackIcon: "Flame",
    red: {
      priceEb: 5000,
      availability: "Exotique",
      damage: "+2d6 Explosif",
      concealable: true,
    },
    iz: {
      priceCredits: 8000,
      quality: "Milware",
      cybertension: 0,
      weightKg: 0.2,
      damage: "+1d6",
      ap: 2,
      notes: "Munitions explosives Chimère : Tous les tirs infligent +1d6 dégâts de zone (Petit Gabarit) à l'impact et PA 2. Les cibles doivent réussir un jet de Vigueur ou être Secouées par l'onde de choc.",
    },
    tags: ["mod", "chimere", "iconique", "explosif", "cinetique", "phantom liberty", "weapon_mods"]
  },
  {
    wikiTitle: "Wallpuncher",
    id: "mod-wallpuncher",
    name: "Perce-Mur Absolu (Wallpuncher) [Mod Chimère]",
    subType: "Mod d'Arme Tech",
    rarity: "legendary",
    rarityLabel: "Iconique / Légendaire",
    manufacturer: "Militech (Noyau de Chimère)",
    description: "Module supraconducteur extrait du canon à rail de la Chimère. Permet aux armes Tech de surcharger leur capacité à 200% sans allonger le temps de charge, transperçant blindages et murs sans aucune déperdition de dégâts.",
    flavorQuote: "« Le béton armé, les portes de coffre-fort... pour cette balle, rien de tout cela n'existe. »",
    fallbackIcon: "Zap",
    red: {
      priceEb: 5000,
      availability: "Exotique",
      damage: "Perfore tous les abris",
      concealable: true,
    },
    iz: {
      priceCredits: 8000,
      quality: "Milware",
      cybertension: 0,
      weightKg: 0.2,
      ap: 6,
      notes: "Perforation absolue Chimère : Charge 200% instantanée. Ignore totalement les abris physiques solides (murs de béton, blindages) et confère PA 6.",
    },
    tags: ["mod", "chimere", "iconique", "tech", "perforation", "phantom liberty", "weapon_mods"]
  },
  {
    wikiTitle: "Hackatomy",
    id: "mod-hackatomy",
    name: "Hackatomie Neuronale (Hackatomy) [Mod Chimère]",
    subType: "Mod d'Arme Smart",
    rarity: "legendary",
    rarityLabel: "Iconique / Légendaire",
    manufacturer: "Militech (Noyau de Chimère)",
    description: "Puce d'injection virale militaire programmée à partir des protocoles d'attaque de la Chimère. Chaque balle intelligente qui pénètre un ennemi injecte un quickhack aléatoire (Court-circuit, Surchauffe ou Cyberdysfonctionnement).",
    flavorQuote: "« Pourquoi choisir entre tirer et hacker quand vos balles font les deux à la fois ? »",
    fallbackIcon: "Zap",
    red: {
      priceEb: 5000,
      availability: "Exotique",
      concealable: true,
    },
    iz: {
      priceCredits: 8000,
      quality: "Milware",
      cybertension: 0,
      weightKg: 0.2,
      notes: "Injection virale Smart : Sur un jet de dégâts réussi, la cible subit immédiatement l'effet d'un Court-circuit IEM (dégâts électriques 2d6 ignorant armure) ou désactivation d'un implant cybernétique.",
    },
    tags: ["mod", "chimere", "iconique", "smart", "quickhack", "phantom liberty", "weapon_mods"]
  },
  {
    wikiTitle: "Severance",
    id: "mod-severance",
    name: "Sectionnement Net (Severance) [Mod Chimère]",
    subType: "Mod de Lame / Mêlée",
    rarity: "legendary",
    rarityLabel: "Iconique / Légendaire",
    manufacturer: "Militech (Noyau de Chimère)",
    description: "Revêtement plasmique monomoléculaire conçu à partir des broyeurs de la Chimère. Les attaques de lames découpent les membres avec une facilité chirurgicale, tranchant les ennemis affaiblis en une seule frappe.",
    flavorQuote: "« Une coupe si pure que la cible ne réalise qu'elle est démembrée que quand elle touche le sol. »",
    fallbackIcon: "Sword",
    red: {
      priceEb: 5000,
      availability: "Exotique",
      damage: "Démembrement instantané",
      concealable: true,
    },
    iz: {
      priceCredits: 8000,
      quality: "Milware",
      cybertension: 0,
      weightKg: 0.2,
      ap: 4,
      notes: "Sectionnement absolu : En cas de coup porté contre un ennemi déjà Blessé ou sur une Relance de Combat, sectionne un membre ou décapite instantanément la cible.",
    },
    tags: ["mod", "chimere", "iconique", "lames", "melee", "demembrement", "phantom liberty", "weapon_mods"]
  },

  // ==================== MODS: BALLES, BALISTIQUE & COMBAT (24) ====================
  {
    wikiTitle: "Big Mag",
    id: "mod-big-mag",
    name: "Chargeur Étendu (Big Mag)",
    subType: "Mod d'Arme à Feu",
    rarity: "uncommon",
    rarityLabel: "Peu commun",
    manufacturer: "Budget Arms",
    description: "Puits de chargement et ressorts à tension constante élargissant la capacité d'emport de cartouches de 50% pour les fusils d'assaut, pistolets-mitrailleurs et mitrailleuses.",
    fallbackIcon: "Sliders",
    red: {
      priceEb: 200,
      availability: "Standard",
      concealable: true,
    },
    iz: {
      priceCredits: 400,
      quality: "Standard",
      cybertension: 0,
      weightKg: 0.3,
      notes: "Augmente la capacité du chargeur de 50% (ex: 30 balles passe à 45 balles), réduisant la fréquence des rechargements en combat.",
    },
    tags: ["mod", "chargeur", "capacite", "munition", "weapon_mods"]
  },
  {
    wikiTitle: "Ready Steady",
    id: "mod-ready-steady",
    name: "Stabilisateur de Tir Mobile (Ready Steady)",
    subType: "Mod d'Arme à Feu",
    rarity: "uncommon",
    rarityLabel: "Peu commun",
    manufacturer: "Militech",
    description: "Système de masselottes internes compensant les mouvements de marche et de course pour maintenir le réticule stable pendant les déplacements tactiques.",
    fallbackIcon: "Sliders",
    red: {
      priceEb: 250,
      availability: "Standard",
      concealable: true,
    },
    iz: {
      priceCredits: 500,
      quality: "Milware",
      cybertension: 0,
      weightKg: 0.2,
      notes: "Tir en mouvement : Élimine la pénalité de Course (-2) lors d'un jet de Tir.",
    },
    tags: ["mod", "stabilite", "mouvement", "course", "weapon_mods"]
  },
  {
    wikiTitle: "Focus Fire",
    id: "mod-focus-fire",
    name: "Tir Focalisé (Focus Fire)",
    subType: "Mod d'Arme à Feu",
    rarity: "rare",
    rarityLabel: "Rare",
    manufacturer: "Arasaka",
    description: "Puce de contrôle de cadence resserrant la dispersion des tirs continus, concentrant l'impact des rafales successives sur le même point de pénétration.",
    fallbackIcon: "Crosshair",
    red: {
      priceEb: 350,
      availability: "Coûteux",
      concealable: true,
    },
    iz: {
      priceCredits: 750,
      quality: "Corpware",
      cybertension: 0,
      weightKg: 0.1,
      notes: "Concentration balistique : Chaque balle touchée consécutivement lors d'une même action ajoute +1 point de dégâts (jusqu'à +4).",
    },
    tags: ["mod", "rafale", "concentration", "arasaka", "weapon_mods"]
  },
  {
    wikiTitle: "Pax",
    id: "mod-pax",
    name: "Convertisseur Pacificateur Non-Létal (Pax)",
    subType: "Mod d'Arme Polyvalent",
    rarity: "common",
    rarityLabel: "Commun",
    manufacturer: "Trauma Team / Street Tech",
    description: "Modulateur de force cinétique et chemisage en polymère amortissant transformant n'importe quelle arme à feu ou arme blanche en moyen d'action non-létal neutralisant sans tuer.",
    flavorQuote: "« Parce que parfois, le contrat stipule que la cible doit respirer encore quand vous la livrez. »",
    fallbackIcon: "Shield",
    red: {
      priceEb: 100,
      availability: "Standard",
      concealable: true,
    },
    iz: {
      priceCredits: 200,
      quality: "Standard",
      cybertension: 0,
      weightKg: 0.1,
      notes: "Rend toutes les attaques de l'arme Non-Létales sans infliger de pénalité de dégâts. Idéal pour les captures de primes vivantes.",
    },
    tags: ["mod", "non-letal", "pax", "capture", "primes", "weapon_mods"]
  },
  {
    wikiTitle: "Pinpoint",
    id: "mod-pinpoint",
    name: "Pointeur Gyroscopique de Précision (Pinpoint)",
    subType: "Mod d'Arme de Poing",
    rarity: "rare",
    rarityLabel: "Rare",
    manufacturer: "Kiroshi Optics",
    description: "Micro-laser et capteurs haptiques indiquant la trajectoire parfaite pour toucher les organes vitaux et points articulaires fragiles.",
    fallbackIcon: "Crosshair",
    red: {
      priceEb: 300,
      availability: "Coûteux",
      concealable: true,
    },
    iz: {
      priceCredits: 650,
      quality: "Hyperchrome",
      cybertension: 0,
      weightKg: 0.1,
      notes: "+1 aux jets de Tir Ciblé visant la tête ou les membres. Réduit de 1 point le malus de Coup Précis.",
    },
    tags: ["mod", "precision", "kiroshi", "laser", "weapon_mods"]
  },
  {
    wikiTitle: "Zenith",
    id: "mod-zenith",
    name: "Accélérateur de Percussion Zénith (Zenith)",
    subType: "Mod d'Arme à Feu",
    rarity: "rare",
    rarityLabel: "Rare",
    manufacturer: "Midnight Arms",
    description: "Mécanisme de percuteur au silicium déclenchant les tirs avec une latence quasi-nulle dès que la détente commence sa course.",
    fallbackIcon: "Zap",
    red: {
      priceEb: 350,
      availability: "Coûteux",
      concealable: true,
    },
    iz: {
      priceCredits: 700,
      quality: "Hyperchrome",
      cybertension: 0,
      weightKg: 0.1,
      notes: "Déclenchement instantané : Confère +2 à l'Initiative lorsque le personnage dégaine et tire au même tour.",
    },
    tags: ["mod", "initiation", "vitesse", "percussion", "weapon_mods"]
  },
  {
    wikiTitle: "Parallax",
    id: "mod-parallax",
    name: "Correcteur de Parallaxe (Parallax)",
    subType: "Mod d'Arme de Précision",
    rarity: "uncommon",
    rarityLabel: "Peu commun",
    manufacturer: "Kang Tao",
    description: "Micro-processeur corrigeant l'alignement entre le plan focal de l'optique et la trajectoire balistique réelle du canon.",
    fallbackIcon: "Crosshair",
    red: {
      priceEb: 200,
      availability: "Standard",
      concealable: true,
    },
    iz: {
      priceCredits: 450,
      quality: "Corpware",
      cybertension: 0,
      weightKg: 0.1,
      notes: "Élimine le malus de parallaxe : +1 au Tir à portée Moyenne.",
    },
    tags: ["mod", "parallaxe", "kang tao", "optique", "weapon_mods"]
  },
  {
    wikiTitle: "Airstrike",
    id: "mod-airstrike",
    name: "Frappe Aérienne (Airstrike)",
    subType: "Mod d'Arme Polyvalent",
    rarity: "rare",
    rarityLabel: "Rare",
    manufacturer: "Dynalar Technologies",
    description: "Capteurs barométriques amplifiant la force d'impact des tirs effectués lorsque le tireur est en l'air (sauts, double-sauts ou chutes).",
    fallbackIcon: "Flame",
    red: {
      priceEb: 300,
      availability: "Coûteux",
      concealable: true,
    },
    iz: {
      priceCredits: 650,
      quality: "Hyperchrome",
      cybertension: 0,
      weightKg: 0.15,
      notes: "Dégâts accrus en vol : Confère +2 dégâts et PA +1 lors des tirs effectués en suspension, double saut ou depuis une position surélevée.",
    },
    tags: ["mod", "aerien", "saut", "dynalar", "weapon_mods"]
  },
  {
    wikiTitle: "Cyclone",
    id: "mod-cyclone",
    name: "Cycleur Rapide Cyclone",
    subType: "Mod d'Arme Automatique",
    rarity: "uncommon",
    rarityLabel: "Peu commun",
    manufacturer: "Zetatech",
    description: "Casse de culasse fluide et roulements à billes en céramique augmentant la cadence de tir mécanique de l'arme de 20%.",
    fallbackIcon: "Sliders",
    red: {
      priceEb: 250,
      availability: "Standard",
      concealable: true,
    },
    iz: {
      priceCredits: 500,
      quality: "Standard",
      cybertension: 0,
      weightKg: 0.2,
      notes: "Cadence accrue : Permet d'ajouter +1 dé lors des jets de tir en Rafale ou Tir Automatique.",
    },
    tags: ["mod", "cadence", "cyclone", "zetatech", "weapon_mods"]
  },
  {
    wikiTitle: "Silencio",
    id: "mod-silencio",
    name: "Chambre d'Insonorisation Silencio",
    subType: "Mod d'Arme à Feu",
    rarity: "uncommon",
    rarityLabel: "Peu commun",
    manufacturer: "Street Tech",
    description: "Gaine interne de canon garnie de micro-chambres acoustiques étouffant la détonation sans nécessiter de silencieux externe encombrant.",
    fallbackIcon: "Shield",
    red: {
      priceEb: 200,
      availability: "Standard",
      concealable: true,
    },
    iz: {
      priceCredits: 450,
      quality: "Streetware",
      cybertension: 0,
      weightKg: 0.15,
      notes: "Atténuation intégrée : Réduit le bruit de détonation de 50% sans allonger le canon de l'arme.",
    },
    tags: ["mod", "silence", "discretion", "insonorisation", "weapon_mods"]
  },
  {
    wikiTitle: "Pyro",
    id: "mod-pyro",
    name: "Munitions Incendiaires Pyro",
    subType: "Mod de Munition",
    rarity: "rare",
    rarityLabel: "Rare",
    manufacturer: "Midnight Arms",
    description: "Module de chauffe par induction et micro-capsules de phosphore blanc enflammant les cibles au contact des impacts balistiques.",
    fallbackIcon: "Flame",
    red: {
      priceEb: 400,
      availability: "Coûteux",
      damage: "+1d6 Feu",
      concealable: true,
    },
    iz: {
      priceCredits: 850,
      quality: "Hyperchrome",
      cybertension: 0,
      weightKg: 0.2,
      notes: "Dégâts de feu : Inflige le statut Enflammé sur un résultat de 5 ou 6 sur le dé de dégâts. La cible subit 1d6 dégâts de brûlure à son tour.",
    },
    tags: ["mod", "incendiaire", "feu", "pyro", "weapon_mods"]
  },
  {
    wikiTitle: "Swiss Cheese",
    id: "mod-swiss-cheese",
    name: "Noyau Perforant « Gruyère » (Swiss Cheese)",
    subType: "Mod de Munition",
    rarity: "rare",
    rarityLabel: "Rare",
    manufacturer: "Militech",
    description: "Ogives au carbure de tungstène usinées au laser et poudre à combustion ultra-dense transformant les blindages corporels en véritable passoire.",
    fallbackIcon: "Crosshair",
    red: {
      priceEb: 350,
      availability: "Coûteux",
      concealable: true,
    },
    iz: {
      priceCredits: 800,
      quality: "Milware",
      cybertension: 0,
      weightKg: 0.1,
      ap: 2,
      notes: "Perforation de blindage : Ajoute PA 2 à toutes les attaques effectuées avec l'arme (se cumule avec le PA de base).",
    },
    tags: ["mod", "perforant", "pa", "militech", "blindage", "weapon_mods"]
  },
  {
    wikiTitle: "Critochet",
    id: "mod-critochet",
    name: "Module de Ricochet Critique (Critochet)",
    subType: "Mod d'Arme Cinétique",
    rarity: "rare",
    rarityLabel: "Rare",
    manufacturer: "Kiroshi Optics",
    description: "Capsule d'ogives à déformation contrôlée qui conserve son énergie cinétique lors des rebonds et explose violemment sur la cible indirecte.",
    fallbackIcon: "Crosshair",
    red: {
      priceEb: 350,
      availability: "Coûteux",
      concealable: true,
    },
    iz: {
      priceCredits: 750,
      quality: "Hyperchrome",
      cybertension: 0,
      weightKg: 0.1,
      notes: "Ricochet dévastateur : Les tirs avec ricochet réussis infligent +2 dégâts et bénéficient de l'Atout Coup Précis.",
    },
    tags: ["mod", "ricochet", "cinetique", "kiroshi", "weapon_mods"]
  },
  {
    wikiTitle: "Stabilizer",
    id: "mod-stabilizer",
    name: "Stabilisateur Gyroscopique Interne",
    subType: "Mod d'Arme Polyvalent",
    rarity: "uncommon",
    rarityLabel: "Peu commun",
    manufacturer: "Constitutional Arms",
    description: "Micro-gyroscopes électriques intégrés dans la carcasse réduisant la déviation et le tremblement naturel du tireur.",
    fallbackIcon: "Sliders",
    red: {
      priceEb: 200,
      availability: "Standard",
      concealable: true,
    },
    iz: {
      priceCredits: 450,
      quality: "Standard",
      cybertension: 0,
      weightKg: 0.25,
      notes: "Stabilité générale : +1 à tous les jets de Tir lorsque le tireur n'a pas bougé pendant son tour.",
    },
    tags: ["mod", "stabilisateur", "gyroscope", "weapon_mods"]
  },
  {
    wikiTitle: "Headtoll",
    id: "mod-headtoll",
    name: "Péage Crânien (Headtoll)",
    subType: "Mod d'Arme de Précision",
    rarity: "very_rare",
    rarityLabel: "Très Rare",
    manufacturer: "Arasaka",
    description: "Calculateur balistique programmé pour maximiser la cavitation hydrostatique lors des impacts touchant la boîte crânienne.",
    flavorQuote: "« Un tir à la tête doit être une sentence sans appel. »",
    fallbackIcon: "Crosshair",
    red: {
      priceEb: 600,
      availability: "Très coûteux",
      damage: "+4d6 sur Tir Tête",
      concealable: true,
    },
    iz: {
      priceCredits: 1300,
      quality: "Corpware",
      cybertension: 0,
      weightKg: 0.1,
      notes: "Tir à la tête dévastateur : Tout Tir Ciblé réussi à la tête inflige +4 dégâts supplémentaires en plus des modificateurs habituels.",
    },
    tags: ["mod", "headshot", "arasaka", "precision", "létal", "weapon_mods"]
  },
  {
    wikiTitle: "Fleetshot",
    id: "mod-fleetshot",
    name: "Tir Agile (Fleetshot)",
    subType: "Mod d'Arme Légère",
    rarity: "uncommon",
    rarityLabel: "Peu commun",
    manufacturer: "Dynalar Technologies",
    description: "Équilibrage dynamique et poignée ultra-légère permettant de sprinter et esquiver sans être ralenti par le poids de l'arme.",
    fallbackIcon: "Activity",
    red: {
      priceEb: 200,
      availability: "Standard",
      concealable: true,
    },
    iz: {
      priceCredits: 450,
      quality: "Hyperchrome",
      cybertension: 0,
      weightKg: 0.1,
      notes: "Mobilité accrue : Allure +2 lorsque l'arme est en main et prête à tirer.",
    },
    tags: ["mod", "vitesse", "dynalar", "mobilite", "weapon_mods"]
  },
  {
    wikiTitle: "Better Half",
    id: "mod-better-half",
    name: "Meilleure Moitié (Better Half)",
    subType: "Mod d'Arme à Feu",
    rarity: "rare",
    rarityLabel: "Rare",
    manufacturer: "Midnight Arms",
    description: "Système de surpression s'activant automatiquement dès que le chargeur est vidé de sa première moitié, surchauffant les cartouches restantes pour doubler leur pénétration.",
    flavorQuote: "« Plus le combat dure, plus le canon devient furieux. »",
    fallbackIcon: "Flame",
    red: {
      priceEb: 400,
      availability: "Coûteux",
      concealable: true,
    },
    iz: {
      priceCredits: 850,
      quality: "Hyperchrome",
      cybertension: 0,
      weightKg: 0.15,
      notes: "Seconde moitié létale : Dès que le chargeur est à 50% ou moins de sa capacité, l'arme inflige +2 dégâts et PA +2.",
    },
    tags: ["mod", "chargeur", "finition", "degats", "weapon_mods"]
  },
  {
    wikiTitle: "Shuffler",
    id: "mod-shuffler",
    name: "Mélangeur Tactique Éjecteur (Shuffler)",
    subType: "Mod d'Arme à Feu",
    rarity: "uncommon",
    rarityLabel: "Peu commun",
    manufacturer: "Budget Arms",
    description: "Éjecteur de chargeur pneumatique et guide biseauté permettant un rechargement d'urgence en un clin d'œil.",
    fallbackIcon: "Sliders",
    red: {
      priceEb: 150,
      availability: "Standard",
      concealable: true,
    },
    iz: {
      priceCredits: 350,
      quality: "Standard",
      cybertension: 0,
      weightKg: 0.15,
      notes: "Rechargement éclair : Recharger l'arme compte comme une Action Gratuite une fois par combat.",
    },
    tags: ["mod", "recharge", "vitesse", "weapon_mods"]
  },
  {
    wikiTitle: "Equalizer",
    id: "mod-equalizer",
    name: "Égaliseur de Menaces (Equalizer)",
    subType: "Mod d'Arme Polyvalent",
    rarity: "rare",
    rarityLabel: "Rare",
    manufacturer: "Arasaka",
    description: "Système d'évaluation de menace biométrique sur-calibrant les impacts balistiques contre les ennemis cybernétisés lourdement armés et blindés.",
    fallbackIcon: "Crosshair",
    red: {
      priceEb: 450,
      availability: "Coûteux",
      concealable: true,
    },
    iz: {
      priceCredits: 950,
      quality: "Corpware",
      cybertension: 0,
      weightKg: 0.15,
      notes: "Anti-élite : Confère +2 aux dégâts contre les boss, lieutenants corpo et adversaires ayant une Résistance de 10 ou plus.",
    },
    tags: ["mod", "elite", "boss", "arasaka", "weapon_mods"]
  },
  {
    wikiTitle: "Vivisector",
    id: "mod-vivisector",
    name: "Vivisecteur (Vivisector)",
    subType: "Mod d'Arme Polyvalent",
    rarity: "rare",
    rarityLabel: "Rare",
    manufacturer: "BioDyne",
    description: "Micro-capteurs biométriques ciblant spécifiquement les chairs meurtries pour aggraver les plaies ouvertes.",
    fallbackIcon: "Activity",
    red: {
      priceEb: 350,
      availability: "Coûteux",
      concealable: true,
    },
    iz: {
      priceCredits: 750,
      quality: "Bioware",
      cybertension: 0,
      weightKg: 0.1,
      notes: "Achèvement : +1d6 dégâts contre les cibles ayant déjà subi au moins 1 Blessure.",
    },
    tags: ["mod", "blessure", "vivisecteur", "biodyne", "weapon_mods"]
  },
  {
    wikiTitle: "Kneel!",
    id: "mod-kneel",
    name: "À Genoux ! (Kneel!) [Mod Pompe]",
    subType: "Mod de Fusil à Pompe",
    rarity: "very_rare",
    rarityLabel: "Très Rare",
    manufacturer: "Constitutional Arms",
    description: "Mod exclusif aux fusils à pompe concentrant la gerbe de chevrotines sur les articulations des genoux des adversaires pour les faucher instantanément.",
    flavorQuote: "« Visez les jambes. Même les cyberpsys tombent quand ils n'ont plus d'appuis. »",
    fallbackIcon: "Flame",
    red: {
      priceEb: 600,
      availability: "Très coûteux",
      damage: "Fauchage critique",
      concealable: true,
    },
    iz: {
      priceCredits: 1400,
      quality: "Milware",
      cybertension: 0,
      weightKg: 0.25,
      notes: "Fauchage de jambes : Tout tir de fusil à pompe réussi visant les jambes jette la cible à terre et l'immobilise (Secouée + À terre, -2 pour se relever).",
    },
    tags: ["mod", "shotgun", "pompe", "fauchage", "jambes", "weapon_mods"]
  },
  {
    wikiTitle: "Condenser",
    id: "mod-condenser",
    name: "Condensateur Électromagnétique (Condenser)",
    subType: "Mod d'Arme Tech",
    rarity: "uncommon",
    rarityLabel: "Peu commun",
    manufacturer: "Kang Tao",
    description: "Condensateur d'énergie compact augmentant l'accélération magnétique des barres d'armature dans les canons à rail.",
    fallbackIcon: "Zap",
    red: {
      priceEb: 250,
      availability: "Standard",
      concealable: true,
    },
    iz: {
      priceCredits: 550,
      quality: "Corpware",
      cybertension: 0,
      weightKg: 0.2,
      notes: "Accélération Tech : Augmente la vitesse de charge des armes Tech de 25% et confère PA +1.",
    },
    tags: ["mod", "tech", "condensateur", "kang tao", "weapon_mods"]
  },
  {
    wikiTitle: "Headhopper",
    id: "mod-headhopper",
    name: "Saut de Tête (Headhopper)",
    subType: "Mod d'Arme de Précision",
    rarity: "rare",
    rarityLabel: "Rare",
    manufacturer: "Arasaka",
    description: "Module de calcul balistique enchaînant les tirs à la tête : chaque élimination critique d'un coup à la tête réaligne le viseur sur la tête de la cible suivante.",
    fallbackIcon: "Crosshair",
    red: {
      priceEb: 450,
      availability: "Coûteux",
      concealable: true,
    },
    iz: {
      priceCredits: 950,
      quality: "Corpware",
      cybertension: 0,
      weightKg: 0.15,
      notes: "Enchaînement critique : Tuer un adversaire d'un Tir à la tête confère immédiatement une attaque gratuite de Tir sur une cible adjacente.",
    },
    tags: ["mod", "enchainement", "headshot", "arasaka", "weapon_mods"]
  },
  {
    wikiTitle: "Gambiteer",
    id: "mod-gambiteer",
    name: "Gambiteur Audacieux (Gambiteer)",
    subType: "Mod d'Arme Légère",
    rarity: "rare",
    rarityLabel: "Rare",
    manufacturer: "Zetatech",
    description: "Système de compensation inertielle récompensant les manœuvres risquées et glissades sous le feu ennemi.",
    fallbackIcon: "Activity",
    red: {
      priceEb: 300,
      availability: "Coûteux",
      concealable: true,
    },
    iz: {
      priceCredits: 650,
      quality: "Hyperchrome",
      cybertension: 0,
      weightKg: 0.1,
      notes: "Audace tactique : Réussir une esquive ou glissade au sol confère +2 au jet de Tir et +2 aux dégâts lors de la prochaine attaque ce tour-ci.",
    },
    tags: ["mod", "esquive", "glissade", "gambiteer", "weapon_mods"]
  },

  // ==================== MODS: TECH & SMART (4) ====================
  {
    wikiTitle: "Disjunctor",
    id: "mod-disjunctor",
    name: "Disjoncteur IEM (Disjunctor)",
    subType: "Mod d'Arme Tech",
    rarity: "rare",
    rarityLabel: "Rare",
    manufacturer: "Militech",
    description: "Modulateur haute tension convertissant le faisceau des armes Tech en onde de choc électrostatique neutralisant les drones et prothèses bioniques.",
    fallbackIcon: "Zap",
    red: {
      priceEb: 400,
      availability: "Coûteux",
      damage: "IEM / Choc",
      concealable: true,
    },
    iz: {
      priceCredits: 850,
      quality: "Milware",
      cybertension: 0,
      weightKg: 0.2,
      notes: "Choc IEM Tech : Inflige 2d6 dégâts électriques additionnels aux cyborgs et drones, avec jet de Vigueur requis sous peine de court-circuit.",
    },
    tags: ["mod", "tech", "iem", "disjoncteur", "militech", "weapon_mods"]
  },
  {
    wikiTitle: "Supercharger",
    id: "mod-supercharger",
    name: "Surchargé (Supercharger)",
    subType: "Mod d'Arme Tech",
    rarity: "rare",
    rarityLabel: "Rare",
    manufacturer: "Arasaka",
    description: "Surchargeur de bobines inductives décuplant la vélocité terminale des munitions Tech lorsqu'elles sont tirées à pleine charge.",
    fallbackIcon: "Zap",
    red: {
      priceEb: 450,
      availability: "Coûteux",
      concealable: true,
    },
    iz: {
      priceCredits: 950,
      quality: "Corpware",
      cybertension: 0,
      weightKg: 0.25,
      damage: "+1d6 à pleine charge",
      notes: "Tir Tech surchargé : À pleine charge, ajoute +1d6 dégâts et PA +2 au projectile.",
    },
    tags: ["mod", "tech", "surcharge", "arasaka", "weapon_mods"]
  },
  {
    wikiTitle: "Panorama",
    id: "mod-panorama",
    name: "Panorama Smart Élargi (Panorama)",
    subType: "Mod d'Arme Smart",
    rarity: "rare",
    rarityLabel: "Rare",
    manufacturer: "Kang Tao",
    description: "Antenne réseau matricielle élargissant le cône de détection et de verrouillage des armes intelligentes pour engager des cibles sur les flancs.",
    fallbackIcon: "Crosshair",
    red: {
      priceEb: 350,
      availability: "Coûteux",
      concealable: true,
    },
    iz: {
      priceCredits: 750,
      quality: "Corpware",
      cybertension: 0,
      weightKg: 0.15,
      notes: "Verrouillage à 180° : Permet aux armes Smart d'engager des cibles sans avoir besoin de leur faire face directement, ignorant les angles morts.",
    },
    tags: ["mod", "smart", "kang tao", "panorama", "verrouillage", "weapon_mods"]
  },
  {
    wikiTitle: "C-Thru",
    id: "mod-c-thru",
    name: "Transperçant C-Thru (C-Thru)",
    subType: "Mod d'Arme Tech",
    rarity: "rare",
    rarityLabel: "Rare",
    manufacturer: "Militech",
    description: "Ogives stabilisées au bore enrichi conçues pour traverser plusieurs couches successives de cloisons sans dévier de leur axe balistique.",
    fallbackIcon: "Crosshair",
    red: {
      priceEb: 400,
      availability: "Coûteux",
      concealable: true,
    },
    iz: {
      priceCredits: 850,
      quality: "Milware",
      cybertension: 0,
      weightKg: 0.2,
      notes: "Perforation de murs : Ignore jusqu'à 4 points de malus d'Abri à travers les parois légères ou moyennes.",
    },
    tags: ["mod", "tech", "murs", "militech", "perforation", "weapon_mods"]
  },

  // ==================== MODS: MÊLÉE, LAMES & ARMES DE JET (10) ====================
  {
    wikiTitle: "Bleedout",
    id: "mod-bleedout",
    name: "Hémorragie Continue (Bleedout)",
    subType: "Mod de Mêlée / Lame",
    rarity: "uncommon",
    rarityLabel: "Peu commun",
    manufacturer: "Street Tech",
    description: "Gouttière d'écoulement et tranchant cranté micro-denté infligeant des lacérations profondes qui provoquent une perte de sang continue.",
    fallbackIcon: "Sword",
    red: {
      priceEb: 200,
      availability: "Standard",
      damage: "Saignement continu",
      concealable: true,
    },
    iz: {
      priceCredits: 450,
      quality: "Streetware",
      cybertension: 0,
      weightKg: 0.1,
      notes: "Hémorragie sévère : Sur un coup réussi, la cible subit l'effet Saignement (jet de Vigueur chaque tour sous peine de subir 1 niveau de Fatigue).",
    },
    tags: ["mod", "mêlée", "lames", "saignement", "hemorragie", "weapon_mods"]
  },
  {
    wikiTitle: "Slice 'Em Up",
    id: "mod-slice-em-up",
    name: "Tranchage Net (Slice 'Em Up)",
    subType: "Mod de Lame",
    rarity: "rare",
    rarityLabel: "Rare",
    manufacturer: "Arasaka",
    description: "Affûtage au laser moléculaire et traitement thermique au diamant décuplant le tranchant des katanas et lames d'avant-bras.",
    fallbackIcon: "Sword",
    red: {
      priceEb: 350,
      availability: "Coûteux",
      damage: "+2d6 sur critique",
      concealable: true,
    },
    iz: {
      priceCredits: 750,
      quality: "Corpware",
      cybertension: 0,
      weightKg: 0.1,
      ap: 2,
      notes: "Tranchant monomoléculaire : Ajoute PA 2 à l'arme et confère +2 aux dégâts tranchants sur une Relance au jet de Combat.",
    },
    tags: ["mod", "lames", "katana", "arasaka", "tranchant", "weapon_mods"]
  },
  {
    wikiTitle: "Haemocide",
    id: "mod-haemocide",
    name: "Hémocide Anticoagulant (Haemocide)",
    subType: "Mod de Lame / Couteau",
    rarity: "rare",
    rarityLabel: "Rare",
    manufacturer: "BioDyne",
    description: "Réservoir microscopique dans le manche diffusant un anticoagulant synthétique foudroyant qui empêche les plaies de se refermer.",
    fallbackIcon: "Activity",
    red: {
      priceEb: 400,
      availability: "Coûteux",
      concealable: true,
    },
    iz: {
      priceCredits: 850,
      quality: "Bioware",
      cybertension: 0,
      weightKg: 0.1,
      notes: "Poison anticoagulant : Les blessures infligées ne peuvent pas être soignées par les nanites d'urgence ou stims médicaux pendant 3 rounds.",
    },
    tags: ["mod", "lames", "anticoagulant", "biodyne", "weapon_mods"]
  },
  {
    wikiTitle: "K.O.",
    id: "mod-ko",
    name: "Commotion Brutale K.O. (K.O.)",
    subType: "Mod d'Arme Contondante",
    rarity: "uncommon",
    rarityLabel: "Peu commun",
    manufacturer: "Budget Arms",
    description: "Insert en plomb haute densité logé dans la tête de frappe des battes, masses et marteaux pour asséner des coups commotionnants.",
    fallbackIcon: "Activity",
    red: {
      priceEb: 150,
      availability: "Standard",
      damage: "Étourdissement",
      concealable: true,
    },
    iz: {
      priceCredits: 350,
      quality: "Streetware",
      cybertension: 0,
      weightKg: 0.4,
      notes: "Commotion cinétique : Toute frappe réussie force la cible à réussir un jet de Vigueur à -2 sous peine d'être immédiatement Secouée.",
    },
    tags: ["mod", "contondant", "etourdissement", "ko", "weapon_mods"]
  },
  {
    wikiTitle: "Bloodbruiser",
    id: "mod-bloodbruiser",
    name: "Meurtrisseur de Crânes (Bloodbruiser)",
    subType: "Mod d'Arme Contondante",
    rarity: "rare",
    rarityLabel: "Rare",
    manufacturer: "Rostović",
    description: "Bague de frappe en carbure de tungstène conçue pour fracturer les os et causer des traumatismes internes massifs.",
    fallbackIcon: "Activity",
    red: {
      priceEb: 300,
      availability: "Coûteux",
      concealable: true,
    },
    iz: {
      priceCredits: 650,
      quality: "Standard",
      cybertension: 0,
      weightKg: 0.35,
      damage: "+2",
      notes: "Fracture osseuse : +2 aux dégâts de mêlée et réduit l'Armure de la cible de 1 point sur un coup violent.",
    },
    tags: ["mod", "contondant", "marteau", "degats", "weapon_mods"]
  },
  {
    wikiTitle: "Barbarian",
    id: "mod-barbarian",
    name: "Fureur Barbare (Barbarian)",
    subType: "Mod de Mêlée Polyvalent",
    rarity: "rare",
    rarityLabel: "Rare",
    manufacturer: "Midnight Arms",
    description: "Grip à pointes transmettant un micro-choc d'adrénaline au combattant quand la fatigue s'accumule, transformant l'épuisement en rage destructrice.",
    flavorQuote: "« Plus vous perdez de sang, plus chaque frappe frappe fort. »",
    fallbackIcon: "Flame",
    red: {
      priceEb: 400,
      availability: "Coûteux",
      concealable: true,
    },
    iz: {
      priceCredits: 800,
      quality: "Hyperchrome",
      cybertension: 0,
      weightKg: 0.2,
      notes: "Rage du berserker : Si le personnage a au moins 1 Blessure, il gagne +2 aux dégâts de mêlée et ignore 1 point de malus de blessure.",
    },
    tags: ["mod", "mêlée", "barbare", "rage", "adrenalinique", "weapon_mods"]
  },
  {
    wikiTitle: "Spinetickler",
    id: "mod-spinetickler",
    name: "Chatouilleur d'Épine Électrostatique (Spinetickler)",
    subType: "Mod de Mêlée",
    rarity: "uncommon",
    rarityLabel: "Peu commun",
    manufacturer: "Militech",
    description: "Électrodes de surface envoyant une décharge de 20 000 volts à travers la lame ou la matraque lors de l'impact physique.",
    fallbackIcon: "Zap",
    red: {
      priceEb: 250,
      availability: "Standard",
      damage: "+1d6 Électrique",
      concealable: true,
    },
    iz: {
      priceCredits: 550,
      quality: "Milware",
      cybertension: 0,
      weightKg: 0.25,
      notes: "Décharge électrique : Ajoute +1d6 dégâts électriques à chaque frappe de mêlée. Efficace contre les drones et cyborgs.",
    },
    tags: ["mod", "electrique", "mêlée", "militech", "choc", "weapon_mods"]
  },
  {
    wikiTitle: "Boomerang",
    id: "mod-boomerang",
    name: "Rappel Magnétique Boomerang",
    subType: "Mod d'Arme de Jet",
    rarity: "rare",
    rarityLabel: "Rare",
    manufacturer: "Kiroshi Optics",
    description: "Micro-émetteur magnétique et gyroscope de retour rappelant instantanément le couteau ou la hache de lancer dans la main du lanceur.",
    flavorQuote: "« Ne courez plus après vos lames. Laissez-les revenir d'elles-mêmes. »",
    fallbackIcon: "Activity",
    red: {
      priceEb: 500,
      availability: "Coûteux",
      concealable: true,
    },
    iz: {
      priceCredits: 1000,
      quality: "Hyperchrome",
      cybertension: 0,
      weightKg: 0.1,
      notes: "Rappel automatique : L'arme de jet revient instantanément dans la main du tireur après son lancer en Action Gratuite.",
    },
    tags: ["mod", "lancer", "couteau", "boomerang", "rappel", "weapon_mods"]
  },
  {
    wikiTitle: "Zero-G",
    id: "mod-zero-g",
    name: "Balistique Zéro-G (Zero-G)",
    subType: "Mod d'Arme de Jet",
    rarity: "uncommon",
    rarityLabel: "Peu commun",
    manufacturer: "Zetatech",
    description: "Ailerons aérodynamiques microscopiques annulant la retombée gravitationnelle pour une trajectoire de lancer parfaitement tendue.",
    fallbackIcon: "Crosshair",
    red: {
      priceEb: 200,
      availability: "Standard",
      concealable: true,
    },
    iz: {
      priceCredits: 450,
      quality: "Standard",
      cybertension: 0,
      weightKg: 0.05,
      notes: "Trajectoire tendue : Double la portée de lancer de l'arme (portée 6/12/24 cases) sans malus gravitationnel.",
    },
    tags: ["mod", "lancer", "portee", "zero-g", "zetatech", "weapon_mods"]
  },
  {
    wikiTitle: "Javelin",
    id: "mod-javelin",
    name: "Pointe Perforante Javelot (Javelin)",
    subType: "Mod d'Arme de Jet",
    rarity: "rare",
    rarityLabel: "Rare",
    manufacturer: "Arasaka",
    description: "Pointe en alliage d'uranium appauvri perforant les casques pare-balles et gilets tactiques lors des attaques de lancer silencieuses.",
    fallbackIcon: "Sword",
    red: {
      priceEb: 350,
      availability: "Coûteux",
      concealable: true,
    },
    iz: {
      priceCredits: 750,
      quality: "Corpware",
      cybertension: 0,
      weightKg: 0.1,
      ap: 4,
      notes: "Perforation de lancer : Confère PA 4 à toutes les attaques de lancer avec ce couteau ou projectile.",
    },
    tags: ["mod", "lancer", "couteau", "perforant", "arasaka", "weapon_mods"]
  }
];

console.log("Total defined weapon mods & attachments:", items.length);

let out = `import { EquipmentItem } from '../utils/gearLogic.ts';\n\n`;
out += `/**\n * Base de données exhaustive de tous les Accessoires et Modifications d'armes de Cyberpunk 2077\n`;
out += ` * Viseurs courts, Lunettes de sniper, Silencieux, Freins de bouche et Mods (dont Mods Chimère de Dogtown)\n`;
out += ` * Convertis pour Savage Worlds / Interface Zéro 2.0 et Cyberpunk RED\n`;
out += ` * Images officielles issues du Fandom Cyberpunk Wiki\n */\n`;
out += `export const WEAPON_MODS_DATABASE: EquipmentItem[] = [\n`;

for (const it of items) {
  const img = getCleanUrl(it.wikiTitle);
  out += `  {\n`;
  out += `    id: ${JSON.stringify(it.id)},\n`;
  out += `    name: ${JSON.stringify(it.name)},\n`;
  out += `    category: 'weapon_mods',\n`;
  out += `    categoryLabel: "Accessoires & Mods d'armes",\n`;
  out += `    rarity: ${JSON.stringify(it.rarity)},\n`;
  out += `    rarityLabel: ${JSON.stringify(it.rarityLabel)},\n`;
  out += `    manufacturer: ${JSON.stringify(it.manufacturer)},\n`;
  out += `    origin: 'Cyberpunk Wiki',\n`;
  out += `    description: ${JSON.stringify(it.description)},\n`;
  if (it.flavorQuote) {
    out += `    flavorQuote: ${JSON.stringify(it.flavorQuote)},\n`;
  }
  out += `    imageUrl: ${JSON.stringify(img)},\n`;
  out += `    fallbackIcon: ${JSON.stringify(it.fallbackIcon)},\n`;
  out += `    red: {\n`;
  out += `      priceEb: ${it.red.priceEb},\n`;
  out += `      availability: ${JSON.stringify(it.red.availability)},\n`;
  if (it.red.damage) out += `      damage: ${JSON.stringify(it.red.damage)},\n`;
  out += `      humanityLoss: '0',\n`;
  out += `      concealable: ${it.red.concealable},\n`;
  out += `    },\n`;
  out += `    iz: {\n`;
  out += `      priceCredits: ${it.iz.priceCredits},\n`;
  out += `      quality: ${JSON.stringify(it.iz.quality)},\n`;
  out += `      cybertension: ${it.iz.cybertension},\n`;
  if (it.iz.damage) out += `      damage: ${JSON.stringify(it.iz.damage)},\n`;
  if (it.iz.ap) out += `      ap: ${it.iz.ap},\n`;
  out += `      weightKg: ${it.iz.weightKg},\n`;
  out += `      notes: ${JSON.stringify(it.iz.notes)},\n`;
  out += `    },\n`;
  out += `    tags: ${JSON.stringify(it.tags)},\n`;
  out += `  },\n`;
}

out += `];\n`;

fs.writeFileSync("src/data/modsData.ts", out);
console.log("Successfully generated src/data/modsData.ts with " + items.length + " items!");
