import { actorsStore } from '../../../../../lib/stores/actor-store.js';

export const ssr = false;

export function load({ params }) {
	const actor = actorsStore.get(params.actorId);
	return {
		actor
	};
}
