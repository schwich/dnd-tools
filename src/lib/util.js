export function postJsonToServer(action, payload) {
	return fetch(`http://localhost:3000/${action}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(payload)
	});
}

/**
 *
 * @param {number} amount - numerator
 * @param {number} outOf - denominator
 * @returns the percentage
 */
export function percentage(amount, outOf) {
	return Math.round((100 * amount) / outOf);
}
