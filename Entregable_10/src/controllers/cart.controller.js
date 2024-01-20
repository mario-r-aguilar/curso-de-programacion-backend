// import CartManagerFileSystem from '../dao/CartManager.filesystem.js';
// import CartManagerMongo from '../dao/CartManager.mongo.js';
// import config from '../config/config.js';
// // Genera una instancia según la base de datos que este activa
// let cartManager;
// config.mongoDbActive === 'yes'
// 	? (cartManager = new CartManagerMongo())
// 	: (cartManager = new CartManagerFileSystem('./src/dao/db/carts.json'));

import { CartService } from '../services/index.js';

// Muestra el listado de carritos
export const getCarts = async (req, res) => {
	try {
		const carts = await CartService.getCarts();
		res.send(carts);
	} catch (error) {
		res.status(500).send(`Internal Server Error: ${error}`);
	}
};

// Muestra un carrito según la id enviada por req.params
export const getCartById = async (req, res) => {
	try {
		let { cid } = req.params;
		const cart = await CartService.getCartById(cid);
		res.send(cart);
	} catch (error) {
		res.status(500).send(`Internal Server Error: ${error}`);
	}
};

// Agrega un nuevo carrito enviado desde req.body
export const addCart = async (req, res) => {
	try {
		let newCart = req.body;
		res.status(201).send(await CartService.addCart(newCart));
	} catch (error) {
		res.status(500).send(`Internal Server Error: ${error}`);
	}
};

// Agrega un producto a un carrito mediante sus IDs envíadas por req.params
export const addProductToCart = async (req, res) => {
	try {
		let { cid } = req.params;
		let { pid } = req.params;
		res.status(201).send(await CartService.addProductToCart(cid, pid));
	} catch (error) {
		res.status(500).send(`Internal Server Error: ${error}`);
	}
};

// Elimina un producto del carrito
export const deleteOneProductfromCart = async (req, res) => {
	try {
		let { cid } = req.params;
		let { pid } = req.params;
		res.status(204).send(
			await CartService.deleteOneProductfromCart(cid, pid)
		);
	} catch (error) {
		res.status(500).send(`Internal Server Error: ${error}`);
	}
};

// Actualiza el contenido completo de un carrito
export const updateAllProductsOfCart = async (req, res) => {
	try {
		let { cid } = req.params;
		let newProductList = req.body;
		res.send(await CartService.updateAllProductsOfCart(cid, newProductList));
	} catch (error) {
		res.status(500).send(`Internal Server Error: ${error}`);
	}
};

// Actualiza la cantidad de un producto que se encuentra en el carrito
export const updateQuantityOfProduct = async (req, res) => {
	try {
		let { cid } = req.params;
		let { pid } = req.params;
		let newQuantity = req.body;
		res.send(
			await CartService.updateQuantityOfProduct(cid, pid, newQuantity)
		);
	} catch (error) {
		res.status(500).send(`Internal Server Error: ${error}`);
	}
};

// Elimina todos los productos que se encuentran en un carrito
export const deleteAllProductsfromCart = async (req, res) => {
	try {
		let { cid } = req.params;
		res.status(204).send(await CartService.deleteAllProductsfromCart(cid));
	} catch (error) {
		res.status(500).send(`Internal Server Error: ${error}`);
	}
};
