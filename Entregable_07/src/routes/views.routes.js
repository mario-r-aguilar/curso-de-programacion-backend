import { Router } from 'express';
import dotenv from 'dotenv';
import ProductManagerMongo from '../dao/ProductManager.mongo.js';
import ProductManagerFileSystem from '../dao/ProductManager.filesystem.js';
import CartManagerMongo from '../dao/CartManager.mongo.js';
import { isUserAuth, isGuest } from '../middlewares/auth.middleware.js';

const viewsRouter = Router();

// Genera una instancia de una clase, según la base de datos activa
dotenv.config();
const mongoDbActive = process.env.MONGO_DB_ACTIVE;

let productManager;

mongoDbActive === 'yes'
	? (productManager = new ProductManagerMongo())
	: (productManager = new ProductManagerFileSystem(
			'./src/dao/db/products.json'
	  ));

// Muestra la página para loguearse. En caso de que ya este logueado lo
// redirecciona a la página de productos mediante el middleware isUserAuth
viewsRouter.get('/', isUserAuth, (req, res) => {
	try {
		return res.render('login', {});
	} catch (error) {
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
});

// Muestra la página para registrarse. En caso de que ya tenga cuenta y
// este logueado, lo redirecciona a la página de productos mediante el
// middleware isUserAuth
viewsRouter.get('/register', isUserAuth, (req, res) => {
	try {
		return res.render('register', {});
	} catch (error) {
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
});

// Muestra el listado de productos y permite a filtrar a traves de req.query
// Siempre y cuando esté logueado, de lo contrario lo redirecciona a la página
// de logueo
viewsRouter.get('/products', isGuest, async (req, res) => {
	try {
		if (mongoDbActive === 'yes') {
			const user = req.session.user;
			// Elimina el password (dato sensible) de la sesión del usuario
			delete user.password;

			const { limit, page, sort, category, status, title } = req.query;

			const productsList = await productManager.getProducts(
				limit,
				page,
				parseInt(sort),
				category,
				status,
				title
			);

			res.render('home', {
				user,
				productsList,
				title: 'Lista de productos disponibles',
			});
		} else {
			const productsList = await productManager.getProducts(req.query.limit);
			res.render('home', {
				productsList,
				title: 'Lista de productos',
			});
		}
	} catch (error) {
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
});

// Muestra el contenido del carrito (funciona con mongoDb)
viewsRouter.get('/carts/:cid', async (req, res) => {
	try {
		const { cid } = req.params;
		let cartManagerMongo;
		if (mongoDbActive === 'yes') {
			cartManagerMongo = new CartManagerMongo();
		}
		const cart = await cartManagerMongo.getCartById(cid);

		res.render('cart', { cart, title: 'Carrito' });
	} catch (error) {
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
});

// Muestra el listado de productos y permite actualizarlos en tiempo real
viewsRouter.get('/realtimeproducts', (req, res) => {
	try {
		res.render('realTimeProducts', {
			title: 'Lista de productos en tiempo real',
		});
	} catch (error) {
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
});

// Muestra el chat
viewsRouter.get('/chat', (req, res) => {
	try {
		res.render('chat', { title: 'Chat' });
	} catch (error) {
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
});

export { viewsRouter };
