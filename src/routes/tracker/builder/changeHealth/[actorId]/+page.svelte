<script>
	import { actorsStore } from '../../../../../lib/stores/actor-store';

	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	export let data;

	let amount = null;
	let amountInput;

	onMount(() => {
		amountInput.focus();
	});
</script>

<h1>{data.actor.name}</h1>
<h2>Current Health: {data.actor.currentHealth}</h2>
<input bind:this={amountInput} type="number" bind:value={amount} />
<button
	class="btn"
	on:click={() => {
		const actor = data.actor;
		actor.heal(amount);
		actorsStore.updateActor(actor);
		goto('/tracker/builder', { replaceState: true });
	}}>heal</button
>
<button
	class="btn"
	on:click={() => {
		data.actor.damage(amount);
		actorsStore.updateActor(data.actor);
		goto('/tracker/builder', { replaceState: true });
	}}>damage</button
>
<button
	class="btn"
	on:click={() => {
		data.actor.addTempHealth(amount);
		actorsStore.updateActor(data.actor);
		goto('/tracker/builder', { replaceState: true });
	}}>add temp health</button
>
