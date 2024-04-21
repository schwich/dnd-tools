import { Actor } from './Actor';
import { browser } from '$app/environment';
import { writable } from 'svelte/store';
// todo support multiple encounters

// export function encounterStore() {
// 	const turnIndex = localStorage?.getItem('turnIndex') ?? 0;
// 	const isRunning = localStorage?.getItem('isRunning') ?? false;
// 	const store = writable({
// 		turnIndex,
// 		isRunning
// 	});

// 	// const { subscribe, set, update } = store;

// 	return {
// 		subscribe,
// 		start: () => {},
// 		end: () => {},
// 		nextTurn: () => {}
// 	};
// }

let currentTurnActorIndex = 0;
// if (window.localStorage.getItem('currentTurnActorIndex')) {
// 	currentTurnActorIndex = window.localStorage.getItem('currentTurnActorIndex');
// } else {
// 	window.localStorage.setItem('currentTurnActorIndex', currentTurnActorIndex);
// }

// let isRunning = false;
// if (localStorage.getItem('encounterIsRunning')) {
// 	isRunning = localStorage.getItem('encounterIsRunning');
// } else {
// 	localStorage.setItem('encounterIsRunning', currentTurnActorIndex);
// }

// export function isEncounterRunning() {
// 	return isRunning;
// }

export function currentTurn() {
	return currentTurnActorIndex;
}

export function startEncounter() {
	currentTurnActorIndex = 0;
	// isRunning = true;
	// localStorage.setItem('encounterIsRunning', currentTurnActorIndex);
	// localStorage.setItem('currentTurnActorIndex', currentTurnActorIndex);
}

export function endEncounter() {
	// isRunning = false;
	// localStorage.removeItem('currentTurnActorIndex');
	// localStorage.removeItem('encounterIsRunning');
}

export function nextTurn(encounterActorList) {
	incrementTurnIndex(encounterActorList.length);
	let keepGoing = true;
	while (keepGoing) {
		const actor = Actor.instantiateByType(encounterActorList[currentTurnActorIndex]);
		if (actor.currentStatus === 'knockedOut' || actor.currentStatus === 'dead') {
			incrementTurnIndex(encounterActorList.length);
		} else if (actor.hiddenInEncounter === true) {
			incrementTurnIndex(encounterActorList.length);
		} else {
			localStorage.setItem('currentTurnActorIndex', currentTurnActorIndex);
			return currentTurnActorIndex;
		}
	}
}

function incrementTurnIndex(actorListLength) {
	currentTurnActorIndex++;
	if (currentTurnActorIndex >= actorListLength) {
		currentTurnActorIndex = 0;
	}
}
