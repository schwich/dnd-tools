import { writable } from 'svelte/store';
import { actorsStore } from './actor-store';

function createEncounterStore() {
	let encounter = {
		turnIndex: 0,
		running: false
	};
	if (localStorage.getItem('encounter')) {
		encounter = JSON.parse(localStorage.getItem('encounter'));
	}
	const { subscribe, update } = writable(encounter);

	return {
		subscribe,
		start: () => {
			update((oldState) => {
				return updateStore({ ...oldState, running: true });
			});
		},
		end: () => {
			update((oldState) => {
				return updateStore({ ...oldState, turnIndex: 0, running: false });
			});
		},
		nextTurn: () => {
			update((oldState) => {
				const actors = actorsStore.all();

				let turnIndex = oldState.turnIndex;
				turnIndex += 1;
				if (turnIndex >= actors.length) {
					turnIndex = 0;
				}

				while (
					actors[turnIndex].currentStatus === 'knockedOut' ||
					actors[turnIndex].currentStatus === 'dead'
				) {
					turnIndex += 1;
					if (turnIndex >= actors.length) {
						turnIndex = 0;
					}
				}

				return updateStore({ ...oldState, turnIndex });
			});
		}
	};
}

function updateStore(encounter) {
	localStorage.setItem('encounter', JSON.stringify(encounter));

	fetch('http://localhost:3001/updateEncounter', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(encounter)
	});

	return encounter;
}

export const encounterStore = createEncounterStore();
