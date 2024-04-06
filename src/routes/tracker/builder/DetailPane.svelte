<script>
	import { abilityModifierString } from '../../../lib/dnd/format';

	export let selectedEnemy;

	function renderAc(acEntry) {
		if (typeof acEntry === 'number') {
			return acEntry;
		} else {
			if (acEntry.condition) {
				return `(${acEntry.ac} ${acEntry.condition})`;
			} else if (acEntry.from) {
				return `(${acEntry.ac} from: ${acEntry.from})`;
			}
		}
	}

	$: console.log(selectedEnemy);
</script>

<div class="details-pane">
	<div class="details">
		{#if selectedEnemy}
			<div class="summary">
				<div>
					<h1>{selectedEnemy.name}</h1>
					<strong>AC: </strong>
					{#each selectedEnemy.ac as ac}
						<span>{renderAc(ac)}</span>&nbsp;
					{/each}
				</div>
				<div>
					<strong>Speed:</strong>
					{#each Object.entries(selectedEnemy.speed) as speed}
						<span>{speed[0]}: </span><span>{speed[1]}</span>
					{/each}
				</div>
			</div>
			<div class="ability-scores">
				<div class="ability-score">
					<div>STR</div>
					<div>{selectedEnemy.str} {abilityModifierString(selectedEnemy.str)}</div>
				</div>
				<div class="ability-score">
					<div>DEX</div>
					<div>{selectedEnemy.dex} {abilityModifierString(selectedEnemy.dex)}</div>
				</div>
				<div class="ability-score">
					<div>CON</div>
					<div>{selectedEnemy.con} {abilityModifierString(selectedEnemy.con)}</div>
				</div>
				<div class="ability-score">
					<div>INT</div>
					<div>{selectedEnemy.int} {abilityModifierString(selectedEnemy.int)}</div>
				</div>
				<div class="ability-score">
					<div>WIS</div>
					<div>{selectedEnemy.wis} {abilityModifierString(selectedEnemy.wis)}</div>
				</div>
				<div class="ability-score">
					<div>CHA</div>
					<div>{selectedEnemy.cha} {abilityModifierString(selectedEnemy.cha)}</div>
				</div>
			</div>
			<hr />
			<div class="actions">
				<h2>Actions</h2>
				{#each selectedEnemy.action as action}
					<h3>{action.name}</h3>
					{#each action.entries as entry}
						<p>{entry}</p>
					{/each}
				{/each}
			</div>
			<hr />
			{#if selectedEnemy.spellcasting}
				<div class="spellcasting">
					<h2>Spellcasting</h2>
					{#each selectedEnemy.spellcasting as spellcastingType}
						<h3>{spellcastingType.name}</h3>
						{#each spellcastingType.headerEntries as headerEntry}
							<p>{headerEntry}</p>
						{/each}

						{#if spellcastingType.spells}
							{#each Object.entries(spellcastingType.spells) as spellsAndType}
								<h4>{spellsAndType[0]}</h4>
								<p>{spellsAndType[1].spells}</p>
							{/each}
						{/if}
					{/each}
				</div>
			{/if}
		{/if}
	</div>
</div>

<style>
	.details-pane {
		max-width: 50vw;
		/* min-width: fit-content; */
		padding: 2em;
	}

	.ability-scores {
		display: flex;
		flex-direction: row;
		gap: 10px;
	}

	.ability-score {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
