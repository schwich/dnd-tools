import { abilityModifier } from './calculate';

export function abilityModifierString(abilityScore) {
	const modifier = abilityModifier(abilityScore);
	if (modifier >= 0) {
		return `(+${modifier})`;
	} else {
		return `(${modifier})`;
	}
}
