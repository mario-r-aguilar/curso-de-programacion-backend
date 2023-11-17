import { Router } from 'express';
import CartManagerFileSystem from '../dao/CartManager.filesystem.js';
import CartManagerMongo from '../dao/CartManager.mongo.js';
import dotenv from 'dotenv';

dotenv.config();
const mongoDbActive = process.env.MONGO_DB_ACTIVE;

let cartManager;

mongoDbActive === 'yes'
	? (cartManager = new CartManagerMongo())
	: (cartManager = new CartManagerFileSystem('./src/dao/db/carts.json'));

const cartRouter = Router();

cartRouter.get('/', async (req, res) => {
	try {
		const carts = await cartManager.getCarts();
		res.status(200).send(carts);
	} catch (error) {
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
});

/**
 * Muestra un carrito según la id que le pasemos mediante el método
 * getCartById(). La id ingresada por el usuario es parseada a número
 * con parseInt() para que coincida con el tipo de dato de la DB.
 */
cartRouter.get('/:cid', async (req, res) => {
	try {
		let { cid } = req.params;
		const cart = await cartManager.getCartById(cid);
		res.status(200).send(cart);
	} catch (error) {
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
});

/*
 * Agrega un nuevo carrito (enviado por req.body) mediante el método addCart()
 */
cartRouter.post('/', async (req, res) => {
	try {
		let newCart = req.body;
		res.status(201).send(await cartManager.addCart(newCart));
	} catch (error) {
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
});

/*
 * Agrega un producto a un carrito mediante el método addProductToCart() al que 
se le envía por req.params el id del carrito y el id del producto
 */
cartRouter.post('/:cid/product/:pid', async (req, res) => {
	try {
		let { cid } = req.params;
		let { pid } = req.params;

		res.status(201).send(await cartManager.addProductToCart(cid, pid));
	} catch (error) {
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
});

export { cartRouter };
