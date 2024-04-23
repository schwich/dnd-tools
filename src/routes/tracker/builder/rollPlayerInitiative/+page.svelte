<script>
	import { actorsStore } from '../../../../lib/stores/actor-store';
	import { goto } from '$app/navigation';

	let players = $actorsStore.filter((a) => a.type === 'player');
</script>

{#each players as player (player.id)}
	<div class="flex flex-row gap-5">
		<div>{player.name}</div>
		<input bind:value={player.initiative} type="number" />
	</div>
{/each}

<button
	class="btn"
	on:click={() => {
		actorsStore.changePlayerInitiatives(players);
		goto('/tracker/builder', { replaceState: true });
	}}>change initiatives</button
>
