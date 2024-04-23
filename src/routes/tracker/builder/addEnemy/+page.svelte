<script>
	import { goto } from '$app/navigation';
	import { actorsStore } from '../../../../lib/stores/actor-store';
	import { Enemy } from '../../../../lib/Actor';
	import { abilityModifier, d20 } from '../../../../lib/dnd/calculate';
	import { onMount } from 'svelte';

	let searchInput;

	let searchValue = '';
	let searchResults = [];
	let highlightIndex = null;

	onMount(() => {
		searchInput.focus();
	});

	$: if (searchValue) {
		fetch(`/api/monster/search/${encodeURIComponent(searchValue)}`)
			.then((res) => res.json())
			.then((data) => (searchResults = data));
	} else {
		searchResults = [];
	}
</script>

<svelte:window
	on:keydown={(e) => {
		if (searchResults.length > 0) {
			if (e.key === 'ArrowDown' && highlightIndex <= searchResults.length - 1) {
				if (highlightIndex === null) {
					highlightIndex = 0;
				} else {
					highlightIndex += 1;
				}
			} else if (e.key === 'ArrowUp' && highlightIndex !== null) {
				if (highlightIndex === 0) {
					highlightIndex = searchResults.length - 1;
				} else {
					highlightIndex -= 1;
				}
			} else if (e.key === 'Enter') {
				const m = searchResults[highlightIndex];
				if (m) {
					actorsStore.add(
						new Enemy({
							id: crypto.randomUUID(),
							type: 'enemy',
							name: m.name,
							maxHealth: m.hp.average,
							initiative: d20() + abilityModifier(m.dex)
						})
					);

					goto('/tracker/builder', { replaceState: true });
				}
			}
		}
	}}
/>

<!-- svelte-ignore a11y-autofocus -->
<input
	bind:this={searchInput}
	autocomplete="off"
	bind:value={searchValue}
	placeholder="Monster Name..."
/>
{#if searchResults.length > 0}
	<div>
		{#each searchResults as monster, i}
			<div class:highlighted={highlightIndex === i}>{monster.name}</div>
		{/each}
	</div>
{/if}

<style lang="postcss">
	.highlighted {
		@apply bg-yellow-300;
	}
</style>
