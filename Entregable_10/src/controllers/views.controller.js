import { ProductService, CartService } from '../services/index.js';
import selectedPersistence from '../config/persistence.js';
import UserDTO from '../DTO/user.dto.js';

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
		const isMongoPersistence =
			selectedPersistence.persistence === 'MONGO' ? true : false;
		let productsList;
		const userData = req.session.user;
		const user = new UserDTO(userData);
		const { limit, page, sort, category, status, title } = req.query;

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
			productsList = await ProductService.getProducts(limit);
		}

		res.render('home', {
			isMongoPersistence,
			user,
			productsList,
			title: 'Lista de productos disponibles',
		});
	} catch (error) {
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
};

// Vista para mostrar el contenido del carrito (solo funciona con mongoDb)
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
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
};

// Vista para mostrar el listado de productos y actualizarlos en tiempo real
export const renderRealTimeProducts = (req, res) => {
	try {
		const userData = req.session.user;
		const user = new UserDTO(userData);
		res.render('realTimeProducts', {
			user,
			title: 'Lista de productos en tiempo real',
		});
	} catch (error) {
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
};

// Vista para mostrar el chat e interactuar en él
export const renderChat = (req, res) => {
	try {
		const userData = req.session.user;
		const user = new UserDTO(userData);
		res.render('chat', { user, title: 'Chat' });
	} catch (error) {
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
};
