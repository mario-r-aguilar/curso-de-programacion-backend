import { Router } from 'express';
import dotenv from 'dotenv';
import ProductManagerMongo from '../dao/ProductManager.mongo.js';
import ProductManagerFileSystem from '../dao/ProductManager.filesystem.js';

const productRouter = Router();

dotenv.config();
const mongoDbActive = process.env.MONGO_DB_ACTIVE;

let productManager;

mongoDbActive === 'yes'
	? (productManager = new ProductManagerMongo())
	: (productManager = new ProductManagerFileSystem(
			'./src/dao/db/products.json'
	  ));

/**
 * Muestra todos los productos que se encuentran en la DB mediante getProducts().
 * La query limit permite elegir la cantidad de productos que queremos ver
 * por pantalla usando del método de arrays slice().
 */
productRouter.get('/', async (req, res) => {
	try {
		let productList = await productManager.getProducts(req.query.limit);
		res.status(200).send({ productList });
	} catch (error) {
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
});

/**
 * Muestra un producto según la id que le pasemos mediante el método
 * getProductById(). La id ingresada por el usuario es parseada a número
 * con parseInt() para que coincida con el tipo de dato de la DB.
 */
productRouter.get('/:pid', async (req, res) => {
	try {
		let { pid } = req.params;
		const product = await productManager.getProductById(pid);
		res.status(200).send(product);
	} catch (error) {
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
});

/*
 * Agrega un nuevo producto (enviado por req.body) mediante el método addProduct()
 */
productRouter.post('/', async (req, res) => {
	try {
		let newProduct = req.body;
		res.status(201).send(await productManager.addProduct(newProduct));
	} catch (error) {
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
});

/*
* Actualiza un producto existente mediante el método updateProduct(). Para ello 
primero obtiene el id del producto por req.params y recibe un producto 
actualizado por req.body
*/
productRouter.put('/:pid', async (req, res) => {
	try {
		let { pid } = req.params;
		const updatedProduct = req.body;

		res.status(200).send(
			await productManager.updateProduct(pid, updatedProduct)
		);
	} catch (error) {
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
});

/*
* Elimina un producto mediante el método deleteProduct() obteniendo la id del 
mismo por req.params
*/
productRouter.delete('/:pid', async (req, res) => {
	try {
		let { pid } = req.params;
		res.status(204).send(await productManager.deleteProduct(pid));
	} catch (error) {
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
});

export { productRouter };
