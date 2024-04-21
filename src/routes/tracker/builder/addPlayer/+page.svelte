<script>
	import { actorsStore } from '../../../../lib/stores/actor-store';
	import { Player } from '../../../../lib/Actor';
	import { goto } from '$app/navigation';

	let playerName;
	let maxHealth;
	let initiative;
</script>

<!-- svelte-ignore a11y-autofocus -->
<input
	autofocus
	class=""
	bind:value={playerName}
	type="text"
	autocomplete="off"
	placeholder="player name"
	required
/>
<input bind:value={maxHealth} type="number" placeholder="max health" required />
<input bind:value={initiative} type="number" placeholder="initiative" />
<button
	class="btn self-center"
	on:click={() => {
		actorsStore.add(
			new Player({
				id: crypto.randomUUID(),
				type: 'player',
				name: playerName,
				maxHealth,
				initiative
			})
		);

		goto('/tracker/builder', { replaceState: true });
	}}>add player</button
>
