import { Server } from 'socket.io';
import { productManager } from '../ProductManager.js';

export function socketServer(server) {
	const io = new Server(server);

	io.on('connection', async (socket) => {
		console.info('user connected');

		socket.emit('productList', await productManager.getProducts());

		socket.on('updatedList', async (data) => {
			console.info(data);
			socket.emit('productList', await productManager.getProducts());
		});

		socket.on('disconnect', () => {
			console.info('user disconnected');
		});
	});

	return io;
}
