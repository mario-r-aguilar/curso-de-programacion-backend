import { Server } from 'socket.io';
import { ProductService, ChatService } from '../services/index.js';

export function socketServer(server) {
	const io = new Server(server);

	io.on('connection', async (socket) => {
		// Mensaje de conexión de un cliente
		console.info('Cliente conectado');

		// Modifico el valor por defecto del límite
		let limitValue = 50;
		let productList = await ProductService.getProducts(limitValue);
		// Envía la lista de productos cuando un cliente se conecta
		socket.emit('productList', productList);

		socket.on('updatedList', async (data) => {
			let limitValue = 50;
			let productList = await ProductService.getProducts(limitValue);
			// Envía la lista de productos cada vez que es modificada
			console.info(data);
			socket.emit('productList', productList);
		});

		// Manejo del chat
		socket.on('message', async (data) => {
			await ChatService.createMessage(data);
			io.emit('messages', await ChatService.getMessages());
		});

		socket.on('getMessages', async () => {
			socket.emit('messages', await ChatService.getMessages());
		});

		socket.on('newUserConnect', (newUser) => {
			socket.broadcast.emit('userConnected', newUser);
		});

		// Mensaje de desconexión de un cliente
		socket.on('disconnect', () => {
			console.info('Cliente desconectado');
		});
	});

	return io;
}
