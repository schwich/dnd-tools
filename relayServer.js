import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

const app = express();
app.use(bodyParser.json());
app.use(cors());
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
let encounter = { turnIndex: 0, running: false };

io.on('connection', (socket) => {
	console.log('a user connected');

	socket.on('disconnect', () => {
		console.log('user disconnected');
	});

	if (!socket.recovered) {
		socket.emit('actorsList', actorsList);
		socket.emit('encounter', encounter);
	}
});

app.post('/updateTracker', (req, res) => {
	actorsList = req.body;
	io.emit('actorsList', actorsList);
	res.sendStatus(200);
});

app.post('/updateEncounter', (req, res) => {
	encounter = req.body;
	io.emit('encounter', encounter);
	res.sendStatus(200);
});

server.listen(port, () => {
	console.log(`server running at localhost:${port}`);
});
