<script>
	export let showModal = false;

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
</script>

{#if showModal}
	<div
		class="fixed left-0 top-0 w-full h-full backdrop-blur-lg"
		on:click|self={() => dispatch('modalClosed')}
		on:keydown={(e) => {
			if (e.key === 'Escape') {
				dispatch('modalClosed');
			}
		}}
		role="presentation"
	>
		<div class="modal-content max-w-sm m-10">
			<slot />
		</div>
	</div>
{/if}

<style lang="postcss">
	.modal-content {
		@apply drop-shadow-xl  bg-white;
	}
</style>
