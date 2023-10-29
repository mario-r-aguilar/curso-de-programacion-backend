import { Router } from 'express';
import { productManager } from '../ProductManager.js';

const viewsRouter = Router();

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
		return res.status(500).send(`Error interno del servidor: ${error}`);
	}
});

viewsRouter.get('/realtimeproducts', (req, res) => {
	res.render('realTimeProducts', {
		title: 'Lista de productos en tiempo real',
	});
});

export { viewsRouter };
