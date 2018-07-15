function bootstrapSocketServer(io) {
	io.on('connection', (socket) => {
		socket.on('register',(message) => {
			let rooms = message.channels;
			rooms.map(function(room){
				socket.join(room, () => {
					
					console.log( Object.keys(socket.rooms)); // [ <socket.id>, 'room 237' ]
					
				  });
			});
			socket.emit('welcomeMessage',message);
			socket.emit('addedToChannel',message.channels);
					
		});

		socket.on('joinChannel',(message) => {

			let rooms = message;
			rooms.map(function(room){
				socket.join(room, () => {
					let channels = Object.keys(socket.rooms);
					if(channels.length  > 0){
						channels.pop();
					}
			console.log(channels);
			socket.emit('addedToChannel',channels);
				  });
			});
			
			
		});

		socket.on('leaveChannel',(message) => {

			let rooms = message;
			console.log('leave rooms',rooms);
			rooms.map(function(room){
				socket.leave(room, () => {
					
				  });
			});
			let channels = Object.keys(socket.rooms);
			if(channels.length  > 0){
				channels.pop();
			}
			console.log(channels);
			socket.emit('removedFromChannel',channels);
			
		});
		
	});
}

module.exports = bootstrapSocketServer;
