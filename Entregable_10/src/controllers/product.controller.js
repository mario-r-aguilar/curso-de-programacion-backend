import ProductManagerMongo from '../dao/ProductManager.mongo.js';
import ProductManagerFileSystem from '../dao/ProductManager.filesystem.js';
import config from '../config/config.js';

// Genera una instancia según la base de datos que este activa
let productManager;
config.mongoDbActive === 'yes'
	? (productManager = new ProductManagerMongo())
	: (productManager = new ProductManagerFileSystem(
			'./src/dao/db/products.json'
	  ));

// Muestra el listado de productos y permite aplicar filtros al hacerlo
export const getProducts = async (req, res) => {
	try {
		if (config.mongoDbActive === 'yes') {
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
};

// Muestra un producto según la id que le pasemos por req.params
export const getProductById = async (req, res) => {
	try {
		let { pid } = req.params;
		const product = await productManager.getProductById(pid);
		res.status(200).send(product);
	} catch (error) {
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
};

// Agrega un nuevo producto enviado por req.body
export const addProduct = async (req, res) => {
	try {
		let newProduct = req.body;
		res.status(201).send(await productManager.addProduct(newProduct));
	} catch (error) {
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
};

// Actualiza un producto existente obteniendo su ID por req.params y los nuevos valores por req.body
export const updateProduct = async (req, res) => {
	try {
		let { pid } = req.params;
		const updatedProduct = req.body;

		res.status(200).send(
			await productManager.updateProduct(pid, updatedProduct)
		);
	} catch (error) {
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
};

// Elimina un producto obteniendo su ID por req.params
export const deleteProduct = async (req, res) => {
	try {
		let { pid } = req.params;
		res.status(204).send(await productManager.deleteProduct(pid));
	} catch (error) {
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
};
