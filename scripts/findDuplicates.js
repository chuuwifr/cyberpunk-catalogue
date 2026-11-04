import { EQUIPMENT_DATABASE } from '../src/data/equipmentData.ts';

const items = EQUIPMENT_DATABASE;
console.log('Total items in DB:', items.length);

const pairs = [];

for (let i = 0; i < items.length; i++) {
  for (let j = i + 1; j < items.length; j++) {
    const a = items[i];
    const b = items[j];

    const clean = (s) =>
      s.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter((w) => w.length > 2 && !['pour', 'avec', 'dans', 'sans', 'sous', 'vers', 'armes', 'arme', 'mods', 'mod'].includes(w));

    const wordsA = new Set(clean(a.name));
    const wordsB = new Set(clean(b.name));

    let commonWords = [];
    for (const w of wordsA) {
      if (wordsB.has(w)) commonWords.push(w);
    }

    // Identical image
    const imgA = a.imageUrl?.split('?')[0].replace(/\/revision\/latest.*$/, '');
    const imgB = b.imageUrl?.split('?')[0].replace(/\/revision\/latest.*$/, '');
    const sameImg = imgA && b.imageUrl && imgA === imgB;

    if (commonWords.length >= 2 || sameImg) {
      pairs.push({ a, b, commonWords, sameImg });
    }
  }
}

console.log(`Found ${pairs.length} candidate duplicate pairs:`);
for (const p of pairs) {
  console.log(`\nMatch (sameImg: ${p.sameImg}, common: ${p.commonWords.join(', ')})`);
  console.log(`  Item 1: [${p.a.category}] id="${p.a.id}" name="${p.a.name}"`);
  console.log(`  Item 2: [${p.b.category}] id="${p.b.id}" name="${p.b.name}"`);
}
