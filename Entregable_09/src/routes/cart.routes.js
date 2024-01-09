import { Router } from 'express';
import CartManagerFileSystem from '../dao/CartManager.filesystem.js';
import CartManagerMongo from '../dao/CartManager.mongo.js';
import config from '../config/config.js';

const cartRouter = Router();

// Genera una instancia de una clase, según la base de datos activa
let cartManager;

config.mongoDbActive === 'yes'
	? (cartManager = new CartManagerMongo())
	: (cartManager = new CartManagerFileSystem('./src/dao/db/carts.json'));

// Muestra el listado de carritos
cartRouter.get('/', async (req, res) => {
	try {
		const carts = await cartManager.getCarts();

		res.send(carts);
	} catch (error) {
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
});

// Muestra un carrito según su id enviada por req.params
cartRouter.get('/:cid', async (req, res) => {
	try {
		let { cid } = req.params;
		const cart = await cartManager.getCartById(cid);

		res.send(cart);
	} catch (error) {
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
});

//Agrega un nuevo carrito enviado desde req.body
cartRouter.post('/', async (req, res) => {
	try {
		let newCart = req.body;

		res.status(201).send(await cartManager.addCart(newCart));
	} catch (error) {
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
});

// Agrega un producto a un carrito mediante sus IDs envíadas por req.params
cartRouter.post('/:cid/products/:pid', async (req, res) => {
	try {
		let { cid } = req.params;
		let { pid } = req.params;

		res.status(201).send(await cartManager.addProductToCart(cid, pid));
	} catch (error) {
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
});

// Elimina un producto del carrito
cartRouter.delete('/:cid/products/:pid', async (req, res) => {
	try {
		let { cid } = req.params;
		let { pid } = req.params;

		res.status(204).send(
			await cartManager.deleteOneProductfromCart(cid, pid)
		);
	} catch (error) {
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
});

// Actualiza el contenido completo de un carrito a partir de un array que está
// dentro de la respuesta a un GET realizado al endpoint de productos /api/products/
cartRouter.put('/:cid', async (req, res) => {
	try {
		let { cid } = req.params;
		let newProductList = req.body;

		res.send(await cartManager.updateAllProductsOfCart(cid, newProductList));
	} catch (error) {
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
});

// Actualiza la cantidad de un producto que se encuentra en el carrito
cartRouter.put('/:cid/products/:pid', async (req, res) => {
	try {
		let { cid } = req.params;
		let { pid } = req.params;
		let newQuantity = req.body;

		res.send(
			await cartManager.updateQuantityOfProduct(cid, pid, newQuantity)
		);
	} catch (error) {
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
});

// Elimina todos los productos que se encuentran en un carrito
cartRouter.delete('/:cid', async (req, res) => {
	try {
		let { cid } = req.params;

		res.status(204).send(await cartManager.deleteAllProductsfromCart(cid));
	} catch (error) {
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
});

export { cartRouter };
