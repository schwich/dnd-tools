<script>
	import { io } from 'socket.io-client';
	import { Actor } from '../../lib/Actor';

	const socket = io('http://localhost:3001');

	socket.on('actorsList', (msg) => {
		console.log(msg);
		actorsListData = msg;
	});

	socket.on('turnIndex', (msg) => {
		turnIndex = parseInt(msg);
	});

	let turnIndex = null;
	let actorsListData = [];
	let actorsList = [];

	$: actorsList = actorsListData.map((a) => Actor.instantiateByType(a));
</script>

{#each actorsList as actor (actor.id)}
	<div>
		<div>{actor.name}</div>
		<div>{actor.healthPercentage()}</div>
		<div>{actor.currentStatus}</div>
	</div>
{/each}
