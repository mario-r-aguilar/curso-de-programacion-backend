import { Server } from 'socket.io';

export function socketServer(server) {
	const io = new Server(server);

	io.on('connection', (socket) => {
		console.log('user connected');
		socket.on('disconnect', () => {
			console.log('user disconnected');
		});
	});

	return io;
}
