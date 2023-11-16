import { Server } from 'socket.io';
import dotenv from 'dotenv';
import ProductManagerMongo from '../dao/ProductManager.mongo.js';
import ProductManagerFileSystem from '../dao/ProductManager.filesystem.js';

dotenv.config();
const mongoDbActive = process.env.MONGO_DB_ACTIVE;

let productManager;

mongoDbActive === 'yes'
	? (productManager = new ProductManagerMongo())
	: (productManager = new ProductManagerFileSystem(
			'./src/dao/db/products.json'
	  ));

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
