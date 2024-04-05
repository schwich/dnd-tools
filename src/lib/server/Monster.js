import { readFileSync } from 'node:fs';

const monsters = new Map();

// relative to root not this file
const potaJsonData = JSON.parse(readFileSync('./external-json/bestiary-pota.json'));
let monstersData = potaJsonData['monster'];

const mmJsonData = JSON.parse(readFileSync('./external-json/bestiary-mm.json'));
monstersData = monstersData.concat(mmJsonData['monster']);

for (const m of monstersData) {
	monsters.set(m.name.trim().toLowerCase(), m);
}

export function getMonster(name) {
	let n = name.trim().toLowerCase();
	return monsters.get(n);
}

export function searchMonster(search) {
	search = search.trim().toLowerCase();
	let r = new RegExp(search);

	return Array.from(monsters.values()).filter((m) => r.test(m.name.trim().toLowerCase()));
}
