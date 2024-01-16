import { Server } from 'socket.io';
import ProductManagerMongo from '../dao/ProductManager.mongo.js';
import ProductManagerFileSystem from '../dao/ProductManager.filesystem.js';
import { chatManager } from '../dao/ChatManager.js';
import config from '../config/config.js';

// Creo instancia según la base de datos activa
let productManager;
config.mongoDbActive === 'yes'
	? (productManager = new ProductManagerMongo())
	: (productManager = new ProductManagerFileSystem(
			'./src/dao/db/products.json'
	  ));

export function socketServer(server) {
	const io = new Server(server);

	io.on('connection', async (socket) => {
		// Mensaje de conexión de un cliente
		console.info('Cliente conectado');

		// Modifico el valor por defecto del límite
		let limitValue = 50;
		let productList = await productManager.getProducts(limitValue);
		// Envía la lista de productos cuando un cliente se conecta
		socket.emit('productList', productList);

		socket.on('updatedList', async (data) => {
			let limitValue = 50;
			let productList = await productManager.getProducts(limitValue);
			// Envía la lista de productos cada vez que es modificada
			console.info(data);
			socket.emit('productList', productList);
		});

		// Manejo del chat
		socket.on('message', async (data) => {
			await chatManager.createMessage(data);
			io.emit('messages', await chatManager.getMessages());
		});

		socket.on('getMessages', async () => {
			socket.emit('messages', await chatManager.getMessages());
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
