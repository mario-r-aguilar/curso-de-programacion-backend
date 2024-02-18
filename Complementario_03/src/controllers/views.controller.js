import { ProductService, CartService } from '../services/index.js';
import selectedPersistence from '../config/persistence.js';
import UserDTO from '../DTO/user.dto.js';

// Vista para el logueo de usuarios
export const renderLogin = (req, res) => {
	try {
		return res.render('login', {});
	} catch (error) {
		req.logger.fatal('Could not render login page');
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
};

// Vista para el registro de usuarios
export const renderRegister = (req, res) => {
	try {
		return res.render('register', {});
	} catch (error) {
		req.logger.fatal('Failed to render registration page');
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
};

// Vista del listado de productos (permite a filtrar a traves de req.query)
export const renderProductsPage = async (req, res) => {
	try {
		// código para ambas persistencias
		const isMongoPersistence =
			selectedPersistence.persistence === 'MONGO' ? true : false; // Para uso en handlebars

		let productsList;
		const userData = req.session.user;
		const user = new UserDTO(userData);
		const { limit, page, sort, category, status, title } = req.query;

		// código para persistencia MONGO
		if (isMongoPersistence === true) {
			productsList = await ProductService.getProducts(
				limit,
				page,
				parseInt(sort),
				category,
				status,
				title
			);
		} else {
			// código para persistencia FILE
			productsList = await ProductService.getProducts(limit);
		}

		res.render('home', {
			isMongoPersistence,
			user,
			productsList,
			title: 'Lista de productos disponibles',
		});
	} catch (error) {
		req.logger.fatal('Could not render product home');
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
};

// Vista del contenido del carrito
export const renderCart = async (req, res) => {
	try {
		const isMongoPersistence =
			selectedPersistence.persistence === 'MONGO' ? true : false;
		const { cid } = req.params;
		const userData = req.session.user;
		const user = new UserDTO(userData);
		const cart = await CartService.getCartById(cid);

		res.render('cart', { isMongoPersistence, cart, user, title: 'Carrito' });
	} catch (error) {
		req.logger.fatal('Could not render cart page');
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
};

// Vista del listado de productos en tiempo real (solo para el administrador)
export const renderRealTimeProducts = (req, res) => {
	try {
		const userData = req.session.user;
		const user = new UserDTO(userData);
		res.render('realTimeProducts', {
			user,
			title: 'Lista de productos en tiempo real',
		});
	} catch (error) {
		req.logger.fatal('The page to manage the products could not be rendered');
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
};

// Vista del chat (solo para usuarios)
export const renderChat = (req, res) => {
	try {
		const userData = req.session.user;
		const user = new UserDTO(userData);
		res.render('chat', { user, title: 'Chat' });
	} catch (error) {
		req.logger.fatal('Could not render chat page');
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
};

export const renderMockingProducts = async (req, res) => {
	try {
		const productsList = [];

		for (let i = 0; i < 100; i++) {
			productsList.push(await ProductService.mockingproducts());
		}

		res.render('mockingProducts', {
			productsList,
			title: 'Mocking Products',
		});
	} catch (error) {
		req.logger.fatal('Failed to render product mockup');
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
};
