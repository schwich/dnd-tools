import { Actor } from './Actor';
// todo support multiple encounters

let currentTurnActorIndex = 0;
let isRunning = false;

export function isEncounterRunning() {
	return isRunning;
}

export function currentTurn() {
	return currentTurnActorIndex;
}

export function startEncounter() {
	isRunning = true;
}

export function endEncounter() {
	isRunning = false;
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
