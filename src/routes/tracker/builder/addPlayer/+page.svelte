<script>
	import { actorsStore } from '../../../../lib/stores/actor-store';
	import { Player } from '../../../../lib/Actor';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let playerName;
	let playerNameInput;
	let maxHealth;
	let initiative;

	onMount(() => {
		playerNameInput.focus();
	});
</script>

<input
	class=""
	bind:this={playerNameInput}
	bind:value={playerName}
	type="text"
	autocomplete="off"
	placeholder="player name"
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
