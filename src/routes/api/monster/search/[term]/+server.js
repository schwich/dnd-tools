import { json } from '@sveltejs/kit';
import { searchMonster } from '../../../../../lib/server/Monster.js';

export function GET({ params }) {
	return json(searchMonster(params.term));
}
