import { Server } from 'socket.io';
import { productManager } from '../ProductManager.js';

export function socketServer(server) {
	const io = new Server(server);

	// Da aviso cuando el cliente se conecta
	io.on('connection', async (socket) => {
		console.info('Cliente conectado');

		// Envía la lista de productos cuando un cliente se conecta
		socket.emit('productList', await productManager.getProducts());

		// Envía la lista de productos cada vez que es modificada
		socket.on('updatedList', async (data) => {
			console.info(data);
			socket.emit('productList', await productManager.getProducts());
		});

		// Da aviso cuando el cliente se desconecta
		socket.on('disconnect', () => {
			console.info('Cliente desconectado');
		});
	});

	return io;
}
