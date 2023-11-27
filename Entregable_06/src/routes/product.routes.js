import { Router } from 'express';
import dotenv from 'dotenv';
import ProductManagerMongo from '../dao/ProductManager.mongo.js';
import ProductManagerFileSystem from '../dao/ProductManager.filesystem.js';

const productRouter = Router();

// Genera una instancia de una clase, según la base de datos activa
dotenv.config();
const mongoDbActive = process.env.MONGO_DB_ACTIVE;

let productManager;

mongoDbActive === 'yes'
	? (productManager = new ProductManagerMongo())
	: (productManager = new ProductManagerFileSystem(
			'./src/dao/db/products.json'
	  ));

// Muestra el listado de productos y permite también con la query limit
// elegir la cantidad de productos que queremos ver por pantalla
productRouter.get('/', async (req, res) => {
	try {
		if (mongoDbActive) {
			const { limit, page, sort, category, status, title } = req.query;

			let productList = await productManager.getProducts(
				limit,
				page,
				parseInt(sort),
				category,
				status,
				title
			);

			const statusProductList =
				productList && productList.docs && productList.docs.length !== 0
					? 'success'
					: 'error';
			const result = { status: statusProductList, payload: productList };

			res.send(result);
		} else {
			let productList = await productManager.getProducts(req.query.limit);
			res.send({ productList });
		}
	} catch (error) {
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
});

// Muestra un producto según la id que le pasemos a través de req.params
productRouter.get('/:pid', async (req, res) => {
	try {
		let { pid } = req.params;
		const product = await productManager.getProductById(pid);
		res.status(200).send(product);
	} catch (error) {
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
});

// Agrega un nuevo producto enviado por req.body
productRouter.post('/', async (req, res) => {
	try {
		let newProduct = req.body;
		res.status(201).send(await productManager.addProduct(newProduct));
	} catch (error) {
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
});

// Actualiza un producto existente. Mediante el id enviado por req.params
// lo encuentra y recibe un producto actualizado desde req.body
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

// Elimina un producto obteniendo su ID por req.params
productRouter.delete('/:pid', async (req, res) => {
	try {
		let { pid } = req.params;
		res.status(204).send(await productManager.deleteProduct(pid));
	} catch (error) {
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
});

export { productRouter };
