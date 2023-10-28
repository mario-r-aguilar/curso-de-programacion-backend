import { Router } from 'express';
import { productManager } from '../ProductManager.js';

const viewsRouter = Router();

viewsRouter.get('/', async (req, res) => {
	const productsList = await productManager.getProducts();
	const isProductsList = productsList ? true : false;

	res.render('home', {
		isProductsList,
		productsList,
		title: 'Lista de productos disponibles',
	});
});

viewsRouter.get('/realtimeproducts', (req, res) => {
	res.render('realTimeProducts', {
		title: 'Lista de productos en tiempo real',
	});
});

export { viewsRouter };
