import config from '../config/config.js';
import selectedPersistence from '../config/persistence.js';
import mongoose from 'mongoose';

export let Product;
export let Cart;
export let User;
export let Chat;
export let Ticket;

const urlMongoDb = `mongodb+srv://${config.mongoUser}:${config.mongoPass}@ecommerce-coder.1dfmp8r.mongodb.net/?retryWrites=true&w=majority`;

switch (selectedPersistence.persistence) {
	case 'MONGO':
		try {
			mongoose
				.connect(urlMongoDb, { dbName: config.mongoDbName })
				.then(() => {
					console.info('Mongo DB connected');
				})
				.catch((error) => {
					console.error(
						'No es posible conectarse a la base de datos',
						error
					);
				});

			const { default: ProductMongo } = await import(
				'./mongo/ProductMongo.dao.js'
			);
			const { default: CartMongo } = await import(
				'./mongo/CartMongo.dao.js'
			);
			const { default: UserMongo } = await import(
				'./mongo/UserMongo.dao.js'
			);
			const { default: ChatMongo } = await import(
				'./mongo/ChatMongo.dao..js'
			);
			const { default: TicketMongo } = await import(
				'./mongo/TicketMongo.dao.js'
			);

			Product = ProductMongo;
			Cart = CartMongo;
			User = UserMongo;
			Chat = ChatMongo;
			Ticket = TicketMongo;
		} catch (error) {
			selectedPersistence.error('Persistence not available', error);
		}

		break;

	case 'FILE':
		try {
			console.info('File DB connected');
			const { default: ProductFile } = await import(
				'./file/ProductFile.dao.js'
			);
			const { default: CartFile } = await import('./file/CartFile.dao.js');
			const { default: UserFile } = await import('./file/UserFile.dao.js');
			const { default: ChatFile } = await import('./file/ChatFile.dao.js');
			const { default: TicketFile } = await import(
				'./file/TicketFile.dao.js'
			);

			Product = ProductFile;
			Cart = CartFile;
			User = UserFile;
			Chat = ChatFile;
			Ticket = TicketFile;
		} catch (error) {
			selectedPersistence.error('Persistence not available', error);
		}

		break;

	default:
		throw new Error('Persistence not configured');
}
