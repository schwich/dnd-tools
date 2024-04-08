import { json } from '@sveltejs/kit';
import { getMonster } from '../../../../lib/server/Monster.js';
import { add } from '../../../../lib/server/actors-store.js';
import { abilityModifier, d20 } from '../../../../lib/dnd/calculate.js';

export async function POST({ request }) {
	const { monsterName } = await request.json();

	let m = getMonster(monsterName);

	add({
		id: crypto.randomUUID(),
		type: 'enemy',
		name: m.name,
		maxHealth: m.hp.average,
		initiative: d20() + abilityModifier(m.dex)
	});

	return json({}, { status: 201 });
}
