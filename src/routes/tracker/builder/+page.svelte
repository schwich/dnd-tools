<script>
	import Modal from '$lib/ui/components/Modal.svelte';
	import { enhance } from '$app/forms';
	import { percentage } from '../../../lib/util';

	export let data;
	export let form;

	let selectedActor = null;

	let showAddPlayerModal = false;
	let showChangeInitiativeModal = false;
	let showDamageModal = false;
	let showHealModal = false;
	let showAddTempHealthModal = false;

	let selectedActorForChange = null;

	function getActorFromData(actorId) {
		return data.actors.find((actor) => actor.id === actorId);
	}

	/**
	 * This sets @var selectedActorForChange so actions can target a specific actor
	 * @param actorId
	 */
	function handleActorChange(actorId) {
		selectedActorForChange = getActorFromData(actorId);
	}
</script>

<div class="container">
	<div class="action-bar">
		<button
			class="btn"
			on:click={() => {
				showAddPlayerModal = true;
			}}>add player</button
		>
		<button class="btn">add enemy</button>
		<button class="btn">long rest</button>
		<button class="btn">remove enemies</button>
		<button class="btn">clear list</button>
	</div>

	{#if form?.error}
		<p class="error">{form.error}</p>
	{/if}

	<div class="tracker-list">
		{#each data.actors as actor (actor.id)}
			<div class="tracker-row" on:click={() => (selectedActor = actor)} role="presentation">
				<button
					on:click={() => {
						showChangeInitiativeModal = true;
						handleActorChange(actor.id);
					}}>{actor.initiative}</button
				>
				<div>{actor.name}</div>
				{#if actor.tempHealth}
					<div>
						{`${percentage(actor.currentHealth + actor.tempHealth, actor.maxHealth)}%`} | {actor.currentHealth}
						(+{actor.tempHealth}) / {actor.maxHealth}
					</div>
				{:else}
					<div>
						{`${percentage(actor.currentHealth + actor.tempHealth, actor.maxHealth)}%`} | {actor.currentHealth}
						/ {actor.maxHealth}
					</div>
				{/if}
				<div>
					<button
						on:click={() => {
							handleActorChange(actor.id);
							showDamageModal = true;
						}}>damage</button
					>
					<button
						on:click={() => {
							handleActorChange(actor.id);
							showHealModal = true;
						}}>heal</button
					>
					<button
						on:click={() => {
							handleActorChange(actor.id);
							showAddTempHealthModal = true;
						}}>temp health</button
					>
				</div>
				<div>Show <input name="actorVisible" type="checkbox" /></div>
				<form method="post" action="?/deleteActor" use:enhance>
					<input name="actorId" type="hidden" value={actor.id} />
					<button type="submit">delete</button>
				</form>
			</div>
		{/each}
	</div>
</div>

<Modal showModal={showDamageModal} on:modalClosed={() => (showDamageModal = false)}>
	<form
		class="modal-form"
		method="post"
		action="?/changeActorHealth"
		use:enhance={() => {
			return async ({ update }) => {
				await update();
				showDamageModal = false;
			};
		}}
	>
		<input name="actorId" type="hidden" value={selectedActorForChange.id} />
		<input name="changeType" type="hidden" value="damage" />
		<input name="amount" type="number" placeholder="amount" autocomplete="off" />
		<button type="submit">damage</button>
	</form>
</Modal>

<Modal showModal={showHealModal} on:modalClosed={() => (showHealModal = false)}>
	<form
		class="modal-form"
		method="post"
		action="?/changeActorHealth"
		use:enhance={() => {
			return async ({ update }) => {
				await update();
				showHealModal = false;
			};
		}}
	>
		<input name="actorId" type="hidden" value={selectedActorForChange.id} />
		<input name="changeType" type="hidden" value="heal" />
		<input name="amount" type="number" placeholder="amount" autocomplete="off" />
		<button type="submit">heal</button>
	</form>
</Modal>

<Modal showModal={showAddTempHealthModal} on:modalClosed={() => (showAddTempHealthModal = false)}>
	<form
		class="modal-form"
		method="post"
		action="?/changeActorHealth"
		use:enhance={() => {
			return async ({ update }) => {
				await update();
				showAddTempHealthModal = false;
			};
		}}
	>
		<input name="actorId" type="hidden" value={selectedActorForChange.id} />
		<input name="changeType" type="hidden" value="addTempHealth" />
		<input name="amount" type="number" placeholder="amount" autocomplete="off" />
		<button type="submit">add temp health</button>
	</form>
</Modal>

<Modal
	showModal={showAddPlayerModal}
	on:modalClosed={() => {
		showAddPlayerModal = false;
	}}
>
	<form
		class="modal-form"
		method="post"
		action="?/addPlayer"
		use:enhance={() => {
			return async ({ update }) => {
				await update();
				showAddPlayerModal = false;
			};
		}}
	>
		<input name="playerName" type="text" autocomplete="off" placeholder="player's name" required />
		<input name="maxHealth" type="number" placeholder="max health" required />
		<input name="initiative" type="number" placeholder="initiative" />

		<button class="btn" type="submit">add player</button>
	</form>
</Modal>

<Modal
	showModal={showChangeInitiativeModal}
	on:modalClosed={() => (showChangeInitiativeModal = false)}
>
	<form
		class="modal-form"
		method="post"
		action="?/changeInitiative"
		use:enhance={() => {
			return async ({ update }) => {
				await update();
				showChangeInitiativeModal = false;
			};
		}}
	>
		<input name="actorId" type="hidden" value={selectedActorForChange.id} />
		<input name="initiative" type="number" placeholder="initiative" />
		<button type="submit">change</button>
	</form>
</Modal>

<style>
	.container {
	}

	.error {
		color: red;
	}

	.modal-form {
		display: flex;
		flex-direction: column;
		margin-top: 1em;
		padding: 2em;
		background-color: #fefefe;
		max-width: 40vw;
		box-shadow: 1px 2px 2px 1px rgb(34, 34, 34);
	}

	.modal-form input {
		margin: 0.5rem;
	}

	.tracker-row {
		display: flex;
		align-items: baseline;
		justify-content: space-around;
		margin: 2em 0 0 1em;
		gap: 10px;
		box-shadow: 0 0 3px 0 gray;
		padding: 5px;
	}
</style>
