import selectedPersistence from '../config/persistence.js';
import CustomError from '../errors/CustomError.js';
import { ProductService } from '../services/index.js';

// Muestra el listado de productos y permite aplicar filtros
export const getProducts = async (req, res) => {
	try {
		// código para persistencia MONGO
		if (selectedPersistence.persistence === 'MONGO') {
			const { limit, page, sort, category, status, title } = req.query;

			let productList = await ProductService.getProducts(
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
			res.status(200).send(result);
		} else {
			// código para persistencia FILE
			let productList = await ProductService.getProducts(req.query.limit);
			res.status(200).send({ productList });
		}
	} catch (error) {
		req.logger.fatal('Could not get product list');
		res.status(500).send(`Internal Server Error: ${error}`);
	}
};

// Muestra un producto según la id enviada por req.params
export const getProductById = async (req, res) => {
	try {
		let { pid } = req.params;
		const product = await ProductService.getProductById(pid);
		res.status(200).send(product);
	} catch (error) {
		req.logger.fatal('Could not get product');
		res.status(500).send(`Internal Server Error: ${error}`);
	}
};

// Agrega un nuevo producto enviado por req.body
export const addProduct = async (req, res, next) => {
	try {
		let newProduct = req.body;

		if (
			!newProduct?.title ||
			!newProduct?.description ||
			!newProduct?.code ||
			!newProduct?.price ||
			!newProduct?.stock ||
			!newProduct?.category
		) {
			// Uso next() para pasar el error al siguiente middleware que en este caso es errorsHandler
			next(CustomError.createProductError(newProduct));
		}
		res.status(201).send(await ProductService.addProduct(newProduct));
	} catch (error) {
		req.logger.fatal('Product could not be added');
		next(error);
	}
};

// Actualiza un producto según la ID enviada por req.params con los nuevos valores (req.body)
export const updateProduct = async (req, res) => {
	try {
		let { pid } = req.params;
		const updatedProduct = req.body;

		res.status(200).send(
			await ProductService.updateProduct(pid, updatedProduct)
		);
	} catch (error) {
		req.logger.fatal('Product could not be updated');
		res.status(500).send(`Internal Server Error: ${error}`);
	}
};

// Elimina un producto según la ID enviada por req.params
export const deleteProduct = async (req, res) => {
	try {
		let { pid } = req.params;
		res.status(204).send(await ProductService.deleteProduct(pid));
	} catch (error) {
		req.logger.fatal('Could not delete product');
		res.status(500).send(`Internal Server Error: ${error}`);
	}
};
