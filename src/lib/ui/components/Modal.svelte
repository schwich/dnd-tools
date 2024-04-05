<script>
	export let showModal = false;

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
</script>

{#if showModal}
	<div
		class="modal-background"
		on:click|self={() => dispatch('modalClosed')}
		on:keydown={(e) => {
			if (e.key === 'Escape') {
				dispatch('modalClosed');
			}
		}}
		role="presentation"
	>
		<slot />
	</div>
{/if}

<style>
	.modal-background {
		position: fixed;
		left: 0;
		top: 0;
		width: 100vw;
		height: 100vh;
		backdrop-filter: blur(10px);
		/* background-color: rgba(0, 0, 0, 0.4); */
	}
</style>
