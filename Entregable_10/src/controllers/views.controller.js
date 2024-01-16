import ProductManagerMongo from '../dao/ProductManager.mongo.js';
import ProductManagerFileSystem from '../dao/ProductManager.filesystem.js';
import CartManagerMongo from '../dao/CartManager.mongo.js';
import config from '../config/config.js';

// Genera una instancia según la base de datos que este activa
let productManager;
config.mongoDbActive === 'yes'
	? (productManager = new ProductManagerMongo())
	: (productManager = new ProductManagerFileSystem(
			'./src/dao/db/products.json'
	  ));

// Vista para loguear un usuario
export const renderLogin = (req, res) => {
	try {
		return res.render('login', {});
	} catch (error) {
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
};

// Vista para registrar un usuario
export const renderRegister = (req, res) => {
	try {
		return res.render('register', {});
	} catch (error) {
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
};

// Vista para mostrar el listado de productos (permite a filtrar a traves de req.query)
export const renderProductsPage = async (req, res) => {
	try {
		if (config.mongoDbActive === 'yes') {
			const user = req.session.user;

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
};

// Vista para mostrar el contenido del carrito (solo funciona con mongoDb)
export const renderCart = async (req, res) => {
	try {
		const { cid } = req.params;
		let cartManagerMongo;
		if (config.mongoDbActive === 'yes') {
			cartManagerMongo = new CartManagerMongo();
		}
		const cart = await cartManagerMongo.getCartById(cid);

		res.render('cart', { cart, title: 'Carrito' });
	} catch (error) {
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
};

// Vista para mostrar el listado de productos y actualizarlos en tiempo real
export const renderRealTimeProducts = (req, res) => {
	try {
		res.render('realTimeProducts', {
			title: 'Lista de productos en tiempo real',
		});
	} catch (error) {
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
};

// Vista para mostrar el chat e interactuar en él
export const renderChat = (req, res) => {
	try {
		res.render('chat', { title: 'Chat' });
	} catch (error) {
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
};
