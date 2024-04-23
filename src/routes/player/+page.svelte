<script>
	import { io } from 'socket.io-client';
	import { Actor } from '../../lib/Actor';

	const socket = io('http://localhost:3001');

	socket.on('actorsList', (msg) => {
		actorsListData = msg;
	});

	socket.on('encounter', (msg) => {
		encounter = msg;
	});

	let actorsListData = [];
	let actorsList = [];

	$: actorsList = actorsListData.map((a) => Actor.instantiateByType(a));

	let encounter = null;
</script>

{#each actorsList as actor, i (actor.id)}
	<div
		class:currentTurn={encounter.running && encounter.turnIndex === i}
		class="flex flex-row gap-2 shadow-md m-5 p-2 rounded-sm"
	>
		<div>{actor.name}</div>
		<div class={`${actor.currentStatus}`}>{actor.currentStatus}</div>
		{#if actor.type === 'player'}
			<div>
				{actor.healthPercentage()}% |
				{actor.currentHealth}
				{#if actor.tempHealth > 0}
					{`(+${actor.tempHealth})`}
				{/if}
				/
				{actor.maxHealth}
			</div>
		{/if}
	</div>
{/each}

<style lang="postcss">
	.currentTurn {
		@apply shadow-indigo-500;
	}

	.dead {
		background-color: rgb(29, 28, 28);
		color: white;
	}

	.healthy {
		background: #56ab2f;
		color: white;
		/* box-shadow: 2px 10px 10px rgba(164, 226, 161, 0.54); */
	}

	.winded {
		background-color: rgb(245, 245, 57);
		color: black;
	}

	.bloodied {
		background-color: #eb4034;
		color: white;
	}
</style>
