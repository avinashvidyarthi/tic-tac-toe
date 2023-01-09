const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const path = require('path');
const port = process.env.PORT || 8080;

app.use('/', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket) => {
	console.log('a user connected');

	socket.on('createOrJoin', (info) => {
		console.log('createOrJoin');
		const myRoom = io.sockets.adapter.rooms.get(info.roomId) || { size: 0 };
		console.log(myRoom);
		if (myRoom.size === 0) {
			socket.join(info.roomId);
			socket.emit('roomCreated', info);
			console.log('roomCreated');
		} else if (myRoom.size === 1) {
			socket.join(info.roomId);
			io.to(info.roomId).emit('roomJoined', info);
			console.log('roomJoined');
		} else {
			socket.emit('roomFull', info);
			console.log('roomFull');
		}
		console.log(info, io.sockets.adapter.rooms);
	});

	socket.on('playerDetails', (info) => {
		console.log('playerDetails');
		socket.broadcast.to(info.roomId).emit('playerDetails', info);
	});

	socket.on('boxClicked', (info) => {
		console.log('boxClicked');
		socket.broadcast.to(info.roomId).emit('boxClicked', info);
	});

	socket.on('disconnect', (data) => {
		console.log('user disconnected');
	});
});

server.listen(port, () => {
	console.log('listening on :', port);
});
