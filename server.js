function addRooms(rooms, socket) {
	if (rooms !== '') {
		rooms.map(function (room) {
			socket.join(room, () => {
			});
		});
	}
}
function bootstrapSocketServer(io) {
	io.on('connection', (socket) => {
		socket.on('register', (message) => {
			let rooms = message.channels;
			socket.emit('welcomeMessage', 'Welcome ' + message.username);
			addRooms(rooms, socket);
			let channel = {};
			channel.channel = message.channels;
			socket.emit('addedToChannel', channel);
		});

		socket.on('joinChannel', (room) => {
			socket.join(room.channel, () => {
				let channels = Object.keys(socket.rooms);
				if (channels.length > 0) {
					channels.pop();
				}
				let channel = {};
				channel.channel = room.channel;
				socket.emit('addedToChannel', channel);
			});
		});

		socket.on('leaveChannel', (room) => {
			socket.leave(room.channel, () => {
				let channels = Object.keys(socket.rooms);
				if (channels.length > 0) {
					channels.pop();
				}
				let channel = {};
				channel.channel = room.channel;
				socket.emit('removedFromChannel', channel);
			});
		});
		socket.on('message', (message) => {
			socket.broadcast.to(message.channel).emit('newMessage', message);
		});
	});
}

module.exports = bootstrapSocketServer;
