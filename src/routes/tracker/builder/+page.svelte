<script>
	import Modal from '$lib/ui/components/Modal.svelte';
	import DetailPane from './DetailPane.svelte';
	import { enhance } from '$app/forms';
	import { percentage } from '../../../lib/util';
	import { invalidateAll } from '$app/navigation';
	import { endEncounter, nextTurn, startEncounter } from '../../../lib/encounter-controller';

	export let data;
	export let form;

	let encounterTurnIndex = null;
	$: console.log(encounterTurnIndex);
	let encounterIsRunning = false;

	let selectedActor = null;
	let selectedEnemy = null;

	let showAddPlayerModal = false;

	let showAddEnemyModal = false;
	let enemySearchValue = '';
	let enemySearchInput;
	let monstersAutoComplete = [];
	let highlightIndex = null;

	$: if (showAddEnemyModal && enemySearchInput) {
		enemySearchInput.focus();
	}

	async function handleSelectActor(actor) {
		selectedActor = actor;
		if (actor.type === 'enemy') {
			const response = await fetch(`/api/monster/name/${encodeURIComponent(actor.name)}`);
			selectedEnemy = await response.json();
		}
	}

	function postEnemyToServer(monsterName) {
		fetch('/tracker/builder/addEnemy', {
			method: 'POST',
			body: JSON.stringify({ monsterName }),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		enemySearchValue = '';
		showAddEnemyModal = false;
		monstersAutoComplete = [];
		highlightIndex = null;

		invalidateAll();
	}

	async function autocompleteMonster() {
		if (!enemySearchValue) {
			monstersAutoComplete = [];
			return;
		}
		const response = await fetch(`/api/monster/search/${encodeURIComponent(enemySearchValue)}`);
		monstersAutoComplete = await response.json();
	}

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

	function handleWindowKeydown(e) {
		if (!showAddEnemyModal) return;

		if (e.key === 'ArrowDown' && highlightIndex <= monstersAutoComplete.length - 1) {
			highlightIndex === null ? (highlightIndex = 0) : (highlightIndex += 1);
		} else if (e.key === 'ArrowUp' && highlightIndex !== null) {
			highlightIndex === 0
				? (highlightIndex = monstersAutoComplete.length - 1)
				: (highlightIndex -= 1);
		} else if (e.key === 'Enter') {
			postEnemyToServer(monstersAutoComplete[highlightIndex].name);
		} else {
			return;
		}
	}
</script>

<svelte:window on:keydown={handleWindowKeydown} />

<div class="action-bar">
	<button
		class="btn"
		on:click={() => {
			showAddPlayerModal = true;
		}}>add player</button
	>
	<button
		class="btn"
		on:click={() => {
			showAddEnemyModal = true;
		}}>add enemy</button
	>
	<button class="btn">sort by initiative</button>
	<button class="btn">long rest</button>
	<button class="btn">roll player initiative</button>
	<button class="btn">remove enemies</button>
	<button class="btn">clear list</button>
	<button class="btn">sync list</button>
	{#if encounterIsRunning}
		<button
			on:click={() => {
				encounterTurnIndex = nextTurn(data.actors);
			}}>next turn</button
		>
		<button
			on:click={() => {
				endEncounter();
				encounterIsRunning = false;
			}}
			>end encounter
		</button>
	{:else}
		<button
			on:click={() => {
				startEncounter();
				encounterIsRunning = true;
				encounterTurnIndex = 0;
			}}>start encounter</button
		>
	{/if}
</div>
<div class="container">
	{#if form?.error}
		<p class="error">{form.error}</p>
	{/if}

	<div class="tracker-list">
		{#each data.actors as actor, i (actor.id)}
			<div
				class:currentTurn={i === encounterTurnIndex}
				class="tracker-row"
				on:click={() => handleSelectActor(actor)}
				role="presentation"
			>
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
	<DetailPane {selectedEnemy} />
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
	showModal={showAddEnemyModal}
	on:modalClosed={() => {
		showAddEnemyModal = false;
	}}
>
	<input
		bind:this={enemySearchInput}
		bind:value={enemySearchValue}
		on:input={autocompleteMonster}
	/>
	{#if monstersAutoComplete.length > 0}
		<div class="monster-autocomplete-list">
			{#each monstersAutoComplete as monster, i}
				<div class:highlighted={highlightIndex === i}>{monster.name}</div>
			{/each}
		</div>
	{/if}
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
	.highlighted {
		background-color: yellow;
	}

	.tracker-list {
		max-width: 50vw;
	}

	.container {
		display: flex;
		flex-direction: row;
		margin: 0;
		width: 100vw;
	}

	.error {
		color: red;
	}

	.modal-form {
		display: flex;
		flex-direction: column;
		margin-top: 1em;
		margin-left: 2em;
		padding: 2em;
		background-color: #fefefe;
		max-width: 40vw;
		box-shadow: 1px 2px 2px 1px rgb(34, 34, 34);
		max-height: 80vh;
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

	.monster-autocomplete-list {
		position: relative;
		top: 0;
		left: 0;
		margin: 0;
		padding: 0;
		max-height: 100%;
		overflow-y: auto;
		z-index: 1;
		border: 1px solid #ddd;
		background-color: #ddd;
		width: 400px;
	}

	.currentTurn {
		border: 1px solid yellow;
	}
</style>
