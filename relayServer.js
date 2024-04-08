import express from 'express';
import bodyParser from 'body-parser';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

const app = express();
app.use(bodyParser.json());
const server = createServer(app);
const io = new Server(server, {
	connectionStateRecovery: {},
	cors: {
		origin: '*'
		// origin: 'http://localhost:3000',
		// methods: ['GET', 'POST']
	}
});
const port = 3001;

let actorsList = [];
let turnIndex = 0;

io.on('connection', (socket) => {
	console.log('a user connected');

	socket.on('disconnect', () => {
		console.log('user disconnected');
	});

	if (!socket.recovered) {
		socket.emit('actorsList', actorsList);
		socket.emit('turnIndex', turnIndex);
	}
});

app.post('/updateTracker', (req, res) => {
	actorsList = req.body;
	io.emit('actorsList', actorsList);
	res.sendStatus(200);
});

app.post('/updateTracker/:turnIndex', (req, res) => {
	actorsList = req.body;
	turnIndex = parseInt(req.params.turnIndex);
	io.emit('actorsList', actorsList);
	io.emit('turnIndex', req.params.turnIndex);
	res.sendStatus(200);
});

server.listen(port, () => {
	console.log(`server running at localhost:${port}`);
});
