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

	const { subscribe, update, set } = writable(actors);

	return {
		subscribe,
		add: (actor) => {
			update((oldStore) => {
				return updateStore([...oldStore, actor]);
			});
		},
		remove: (actorId) => {
			update((oldStore) => {
				return updateStore(oldStore.filter((actor) => actorId !== actor.id));
			});
		},
		get: (actorId) => {
			return actors.find((a) => a.id === actorId);
		},
		all: () => {
			return actors;
		},
		updateActor: (actor) => {
			update((oldList) => {
				return updateStore([...oldList.filter((a) => a.id !== actor.id), actor]);
			});
		},
		removeEnemies: () => {
			update((oldList) => {
				return updateStore(oldList.filter((a) => a.type !== 'enemy'));
			});
		},
		longRest: () => {
			update((oldList) => {
				const players = oldList.filter((a) => a.type === 'player');
				for (const p of players) {
					p.longRest();
				}

				return updateStore(players);
			});
		},
		changePlayerInitiatives: (players) => {
			update((oldList) => {
				return updateStore([...oldList.filter((a) => a.type !== 'player'), ...players]);
			});
		},
		clear: () => {
			actors = [];
			set(actors);
			updateStore(actors);
		}
	};
}

function updateStore(actorsList) {
	actorsList.sort((a, b) => (a.initiative >= b.initiative ? -1 : 1));
	localStorage.setItem('actors', JSON.stringify(actorsList));
	updateServer('updateTracker', actorsList);
	return actorsList;
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
