<script>
	import { io } from 'socket.io-client';
	import { Player, Enemy, Actor } from '../../lib/Actor';

	const socket = io('http://localhost:3001');

	socket.on('actorsList', (msg) => {
		actorsListData = msg;
	});

	socket.on('turnIndex', (msg) => {
		turnIndex = parseInt(msg);
	});

	let actorsListData = [];
	let turnIndex = null;
	// let actorsList = [];

	$: actorsListData = actorsListData.map((a) => Actor.instantiateByType(a));
</script>

{#each actorsListData as actor (actor.id)}
	<div>
		<div>{actor.name}</div>
		<div>{actor.healthPercentage()}</div>
		<div>{actor.currentStatus}</div>
	</div>
{/each}
