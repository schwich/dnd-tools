import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { Actor } from '../Actor';

function createActorsStore() {
	let actors = [];
	if (localStorage.getItem('actors')) {
		actors = JSON.parse(localStorage.getItem('actors')).map((actorData) =>
			Actor.instantiateByType(actorData)
		);

		updateServer('updateTracker', actors);
	}

	const { subscribe, update } = writable(actors);

	return {
		subscribe,
		add: (actor) => {
			update((oldStore) => {
				if (browser) {
					const newStore = [...oldStore, actor].sort((a, b) =>
						a.initiative >= b.initiative ? a : b
					);
					localStorage.setItem('actors', JSON.stringify(newStore));

					updateServer('updateTracker', newStore);
					return newStore;
				}
			});
		},
		remove: (actorId) => {},
		updateActor: (actor) => {}
	};
}

function updateServer(action, payload) {
	fetch(`http://localhost:3001/${action}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(payload)
	});
}

export const actorsStore = createActorsStore();
