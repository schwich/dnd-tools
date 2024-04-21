<script>
	import Modal from '../../../lib/ui/components/Modal.svelte';
	import { actorsStore } from '../../../lib/stores/actor-store';
	import { Player } from '../../../lib/Actor';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let showModal = false;

	let playerName = '';
	let maxHealth;
	let initiative;
</script>

<Modal {showModal} on:modalClosed>
	<div class="flex flex-col m-10 max-w-xs gap-2 p-5">
		<input
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

				dispatch('modalClosed');
			}}>add player</button
		>
	</div>
</Modal>

<style lang="postcss">
	input {
		@apply pl-12 pr-3 py-2 text-gray-500 outline-none border focus:border-indigo-600 shadow-sm rounded-md;
	}
</style>
