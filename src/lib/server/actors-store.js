import { postJsonToServer } from '../util';
import { Actor, Enemy, Player } from './Actor';
import { readFileSync, writeFileSync } from 'node:fs';

// relative to project root
const actorStorePath = 'src/lib/server/actors-data.json';

let actors = [];

export function getActor(actorId) {
	return actors.find((actor) => actor.id === actorId);
}

/**
 *
 * @returns array of actors parsed from JSON, so no access to methods
 */
export function getActors() {
	actors = JSON.parse(readFileSync(actorStorePath).toString());
	return actors;
}

export function addPlayer(playerData) {
	const p = new Player(playerData); // construct class to init all data correctly
	actors.push(Object.assign({}, p)); // sveltekit can't serialize classes

	updateStore();
}

export function addEnemy(enemyData) {
	const e = new Enemy(enemyData);
	actors.push(Object.assign({}, e));

	updateStore();
}

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

export function updateActor(actorId, field, value) {
	const a = getActor(actorId);
	a[field] = value;

	updateStore();
}

export function deleteActor(actorId) {
	const index = actors.findIndex((actor) => actor.id === actorId);
	if (index !== -1) {
		actors.splice(index, 1);
	}

	updateStore();
}

function updateStore() {
	writeFileSync(actorStorePath, JSON.stringify(actors));
	// postJsonToServer('tracker/addPlayer', actors);
}
