import { Router } from 'express';
import dotenv from 'dotenv';
import ProductManagerMongo from '../dao/ProductManager.mongo.js';
import ProductManagerFileSystem from '../dao/ProductManager.filesystem.js';

const viewsRouter = Router();

dotenv.config();
const mongoDbActive = process.env.MONGO_DB_ACTIVE;

let productManager;

mongoDbActive === 'yes'
	? (productManager = new ProductManagerMongo())
	: (productManager = new ProductManagerFileSystem(
			'./src/dao/db/products.json'
	  ));

viewsRouter.get('/', async (req, res) => {
	try {
		const productsList = await productManager.getProducts();
		let isProductsList = Array.isArray(productsList);

		res.render('home', {
			isProductsList,
			productsList,
			title: 'Lista de productos disponibles',
		});
	} catch (error) {
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
});

viewsRouter.get('/realtimeproducts', (req, res) => {
	try {
		res.render('realTimeProducts', {
			title: 'Lista de productos en tiempo real',
		});
	} catch (error) {
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
});

viewsRouter.get('/chat', (req, res) => {
	try {
		res.render('chat', { title: 'Chat' });
	} catch (error) {
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
});

export { viewsRouter };
