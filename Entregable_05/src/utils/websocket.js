import { Server } from 'socket.io';
import { productManager } from '../ProductManager.js';

export function socketServer(server) {
	const io = new Server(server);

	io.on('connection', async (socket) => {
		console.log('user connected');

		socket.emit('productList', await productManager.getProducts());

		socket.on('disconnect', () => {
			console.log('user disconnected');
		});
	});

	return io;
}
