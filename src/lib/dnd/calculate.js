export function abilityModifier(abilityScore) {
	return Math.floor((abilityScore - 10) / 2);
}

export function d20() {
	return getRandomIntInclusive(1, 20);
}

/**
 * Returns a random integer within the inclusive range min-max
 * @param {number} min
 * @param {number} max
 * @returns an integer i, where min <= i <= max
 */
export function getRandomIntInclusive(min, max) {
	const minCeiled = Math.ceil(min);
	const maxFloored = Math.floor(max);
	return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}
