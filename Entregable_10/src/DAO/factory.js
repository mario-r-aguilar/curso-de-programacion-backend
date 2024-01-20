import config from '../config/config.js';
import selectedPersistence from '../config/persistence.js';
import mongoose from 'mongoose';

export let Product;
export let Cart;
export let User;
export let Chat;

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

			Product = ProductMongo;
			Cart = CartMongo;
			User = UserMongo;
			Chat = ChatMongo;
		} catch (error) {
			config.error('Persistence not available', error);
		}

		break;

	case 'FILE':
		try {
			const { default: ProductFile } = await import(
				'./file/ProductManager.filesystem.js'
			);
			const { default: CartFile } = await import(
				'./file/ProductManager.filesystem.js'
			);

			Product = ProductFile;
			Cart = CartFile;
		} catch (error) {
			config.error('Persistence not available', error);
		}

		break;

	default:
		throw new Error('Persistence not configured');
}