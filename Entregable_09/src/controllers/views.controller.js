import ProductManagerMongo from '../dao/ProductManager.mongo.js';
import ProductManagerFileSystem from '../dao/ProductManager.filesystem.js';
import CartManagerMongo from '../dao/CartManager.mongo.js';
import config from '../config/config.js';

// Genera una instancia de una clase, según la base de datos activa
let productManager;

config.mongoDbActive === 'yes'
	? (productManager = new ProductManagerMongo())
	: (productManager = new ProductManagerFileSystem(
			'./src/dao/db/products.json'
	  ));

// Muestra la página para loguearse. En caso de que ya este logueado, lo
// redirecciona a la página de productos mediante el middleware isUserAuth
export const renderLogin = (req, res) => {
	try {
		return res.render('login', {});
	} catch (error) {
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
};

// Muestra la página para registrarse. En caso de que ya este logueado,
// lo redirecciona a la página de productos mediante el middleware isUserAuth
export const renderRegister = (req, res) => {
	try {
		return res.render('register', {});
	} catch (error) {
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
};

// Muestra el listado de productos y permite a filtrar a traves de req.query
// siempre y cuando esté logueado, de lo contrario devuelve un error al intentar
// acceder
export const renderCurrentUser = async (req, res) => {
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

// Muestra el contenido del carrito (funciona con mongoDb)
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

// Muestra el listado de productos y permite actualizarlos en tiempo real
export const renderRealTimeProducts = (req, res) => {
	try {
		res.render('realTimeProducts', {
			title: 'Lista de productos en tiempo real',
		});
	} catch (error) {
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
};

// Muestra el chat
export const renderChat = (req, res) => {
	try {
		res.render('chat', { title: 'Chat' });
	} catch (error) {
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
};
