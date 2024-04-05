import { json } from '@sveltejs/kit';
import { getMonster } from '../../../../../lib/server/Monster.js';

export function GET({ params }) {
	return json(getMonster(params.name));
}
