import { postJsonToServer } from '../util';
import { Actor } from '../Actor';
import { readFileSync, writeFileSync } from 'node:fs';

// relative to project root
const actorStorePath = 'src/lib/server/actors-data.json';

let actors = [];

export function getActor(actorId) {
	return actors.find((actor) => actor.id === actorId);
}

export function getAll() {
	actors = JSON.parse(readFileSync(actorStorePath).toString());
	return actors;
}

export function add(actorData) {
	const a = Actor.instantiateByType(actorData);
	actors.push(Object.assign({}, a));
	actors.sort((a, b) => {
		if (a.initiative === b.initiative) {
			return 0;
		} else {
			return a.initiative < b.initiative ? -1 : 1;
		}
	});

	updateStore();
}

// todo why is this here?
export function changeActorHealth(actorId, changeType, amount) {
	const actorData = getActor(actorId);
	let actor = Actor.instantiateByType(actorData);

	if (actor) {
		if (changeType === 'damage') {
			actor.damage(amount);
		} else if (changeType === 'heal') {
			actor.heal(amount);
		} else if (changeType === 'addTempHealth') {
			actor.addTempHealth(amount);
		}
		updateActor(actor.id, 'currentHealth', actor.currentHealth);
		updateActor(actor.id, 'tempHealth', actor.tempHealth);
	}
}

// todo take a map of field -> values
export function updateActor(actorId, field, value) {
	const a = getActor(actorId);
	a[field] = value;

	updateStore();
}

export function remove(actorId) {
	const index = actors.findIndex((actor) => actor.id === actorId);
	if (index !== -1) {
		actors.splice(index, 1);
	}

	updateStore();
}

function updateStore() {
	postJsonToServer('updateTracker', actors);
	writeFileSync(actorStorePath, JSON.stringify(actors));
}
