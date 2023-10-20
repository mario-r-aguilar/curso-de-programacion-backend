import { Router } from 'express';
import { cartManager } from '../CartManager.js';
const cartRouter = Router();

/**
 * Muestra un carrito según la id que le pasemos mediante el método
 * getCartById(). La id ingresada por el usuario es parseada a número
 * con parseInt() para que coincida con el tipo de dato de la DB.
 */
cartRouter.get('/:cid', async (req, res) => {
	try {
		let { cid } = req.params;
		cid = parseInt(cid);
		const cart = await cartManager.getCartById(cid);

		if (cart) {
			return res.status(200).send(cart);
		} else {
			return res.status(404).send({ error: 'Carrito no encontrado' });
		}
	} catch (error) {
		return res.status(500).send(`Error interno del servidor: ${error}`);
	}
});

/*
 * Agrega un nuevo carrito (enviado por req.body) mediante el método addCart()
 */
cartRouter.post('/', async (req, res) => {
	try {
		let newCart = req.body;
		return res.status(201).send(await cartManager.addCart(newCart));
	} catch (error) {
		return res.status(500).send(`Error interno del servidor: ${error}`);
	}
});

/*
 * Agrega un producto a un carrito mediante el método addProductToCart() al que 
se le envía por req.params el id del carrito y el id del producto
 */
cartRouter.post('/:cid/product/:pid', async (req, res) => {
	try {
		let { cid } = req.params;
		cid = parseInt(cid);
		let { pid } = req.params;
		pid = parseInt(pid);

		return res.status(201).send(await cartManager.addProductToCart(cid, pid));
	} catch (error) {
		return res.status(500).send(`Error interno del servidor: ${error}`);
	}
});

export { cartRouter };
