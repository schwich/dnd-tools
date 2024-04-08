import * as actors from '../../../lib/server/actors-store.js';
import { fail } from '@sveltejs/kit';

export function load() {
	return {
		actors: actors.getAll()
	};
}

export const actions = {
	changeInitiative: async ({ request }) => {
		const data = await request.formData();

		try {
			const actorId = data.get('actorId');
			const initiative = data.get('initiative');

			if (!initiative) {
				throw new Error('initiative must be a number');
			}
			if (!actorId) {
				throw new Error('actorId cannot be null');
			}

			actors.updateActor(actorId, 'initiative', initiative);
		} catch (error) {
			return fail(422, {
				error: error.message,
				initiative: data.get('initiative')
			});
		}
	},
	addPlayer: async ({ request }) => {
		const data = await request.formData();

		try {
			const name = data.get('playerName');
			const initiative = data.get('initiative') || 0;
			const maxHealth = data.get('maxHealth');

			if (!name) {
				throw new Error('player must have a name');
			}
			if (!maxHealth) {
				throw new Error('player must have a max health');
			}

			actors.add({
				id: crypto.randomUUID(),
				type: 'player',
				name: String(name),
				initiative: parseInt(initiative.toString()),
				maxHealth: parseInt(maxHealth.toString())
			});
		} catch (error) {
			return fail(422, {
				error: error.message,
				playerName: data.get('playerName'),
				initiative: data.get('initiative'),
				maxHealth: data.get('maxHealth')
			});
		}
	},
	deleteActor: async ({ request }) => {
		const data = await request.formData();
		actors.remove(data.get('actorId'));
	},
	changeActorHealth: async ({ request }) => {
		const data = await request.formData();
		actors.changeActorHealth(
			data.get('actorId'),
			data.get('changeType'),
			parseInt(data.get('amount'))
		);
	}
};
