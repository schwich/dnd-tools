<script>
	import { actorsStore } from '../../../../../lib/stores/actor-store';

	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	export let data;

	let initiative = null;
	let initiativeInput;

	onMount(() => {
		initiativeInput.focus();
	});
</script>

<h1>{data.actor.name}</h1>
<input bind:this={initiativeInput} type="number" bind:value={initiative} />
<button
	class="btn"
	on:click={() => {
		data.actor.initiative = initiative;
		actorsStore.updateActor(data.actor);
		goto('/tracker/builder', { replaceState: true });
	}}>change initiative</button
>
