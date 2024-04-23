<script>
	import DetailPane from './DetailPane.svelte';
	import { percentage } from '../../../lib/util';

	import { actorsStore } from '../../../lib/stores/actor-store';
	import { encounterStore } from '../../../lib/stores/encounter-store';

	let selectedActor = null;
	let selectedEnemy = null;

	async function handleSelectActor(actor) {
		selectedActor = actor;
		if (actor.type === 'enemy') {
			const response = await fetch(`/api/monster/name/${encodeURIComponent(actor.name)}`);
			selectedEnemy = await response.json();
		}
	}
</script>

<div class="p-2">
	<a class="btn" href="/tracker/builder/addPlayer">add player</a>
	<a class="btn" href="/tracker/builder/addEnemy">add enemy</a>
	<button class="btn" on:click={() => actorsStore.longRest()}>long rest</button>
	<a class="btn" href="/tracker/builder/rollPlayerInitiative">roll player initiative</a>
	<button
		class="btn"
		on:click={() => {
			actorsStore.removeEnemies();
		}}>remove enemies</button
	>
	{#if $encounterStore.running}
		<button
			class="btn"
			on:click={() => {
				encounterStore.nextTurn();
			}}>next turn</button
		>
		<button
			class="btn"
			on:click={() => {
				encounterStore.end();
			}}
			>end encounter
		</button>
	{:else}
		<button
			class="btn"
			on:click={() => {
				encounterStore.start();
			}}>start encounter</button
		>
	{/if}
</div>
<div class="container">
	<div class="tracker-list">
		{#each $actorsStore as actor, i (actor.id)}
			<div
				class:currentTurn={$encounterStore.running && i === $encounterStore.turnIndex}
				class="tracker-row"
				on:click={() => handleSelectActor(actor)}
				role="presentation"
			>
				<a class="btn" href={`builder/changeInitiative/${actor.id}`}>{actor.initiative}</a>
				<div>{actor.name}</div>
				<div>{actor.currentStatus}</div>
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
				<a class="btn" href={`builder/changeHealth/${actor.id}`}>change health</a>
				<div>Show <input name="actorVisible" type="checkbox" /></div>
				<button
					class="btn"
					on:click={() => {
						actorsStore.remove(actor.id);
					}}>delete</button
				>
			</div>
		{/each}
	</div>
	<DetailPane {selectedEnemy} />
</div>

<style lang="postcss">
	.tracker-list {
		max-width: 50vw;
	}

	.container {
		display: flex;
		flex-direction: row;
		margin: 0;
		width: 100vw;
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

	.currentTurn {
		border: 1px solid yellow;
	}
</style>
