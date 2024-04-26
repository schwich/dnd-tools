import { readFileSync } from 'node:fs';

const monsters = new Map();

// relative to root not this file
const potaJsonData = JSON.parse(readFileSync('./external-json/bestiary-pota.json'));
let monstersData = potaJsonData['monster'];

const mmJsonData = JSON.parse(readFileSync('./external-json/bestiary-mm.json'));
monstersData = monstersData.concat(mmJsonData['monster']);

const spellRegex = /{@spell\s(\w+\s*\w+)/;
for (const m of monstersData) {
	// parse spells and replace
	if (m.spellcasting) {
		console.log(m.spellcasting);
	}
	monsters.set(m.name.trim().toLowerCase(), m);
}

const phbSpells = JSON.parse(readFileSync('./external-json/spells-phb.json'));
let spellsData = phbSpells['spell'];
const tceSpells = JSON.parse(readFileSync('./external-json/spells-tce.json'));
spellsData = spellsData.concat(tceSpells);
const xgeSpells = JSON.parse(readFileSync('./external-json/spells-xge.json'));
spellsData = spellsData.concat(xgeSpells);

export function getMonster(name) {
	let n = name.trim().toLowerCase();
	return monsters.get(n);
}

export function searchMonster(search) {
	search = search.trim().toLowerCase();
	let r = new RegExp(search);

	return Array.from(monsters.values()).filter((m) => r.test(m.name.trim().toLowerCase()));
}
