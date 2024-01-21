import fs from 'node:fs';
import { v4 as uuidv4 } from 'uuid';
import ProductDAOInterface from '../productDaoInterface.js';

export default class ProductFileDAO extends ProductDAOInterface {
	constructor() {
		super();
		this.path = './src/DAO/file/db/products.json';

		// Si el usuario no brinda una ruta, crea el archivo
		if (!fs.existsSync(this.path)) {
			fs.writeFileSync(this.path, JSON.stringify([]));
		}
	}

	async get(
		limit,
		page = null,
		sort = null,
		category = null,
		status = null,
		title = null
	) {
		try {
			let productList = await fs.promises.readFile(this.path, 'utf-8');
			productList = JSON.parse(productList);
			if (limit) {
				const productsLimited = productList.slice(0, limit);
				return productsLimited;
			} else {
				return productList;
			}
		} catch (err) {
			console.error(
				`Products cannot be displayed.\n 
            Error: ${err}`
			);
			return;
		}
	}

	async getById(productID) {
		try {
			const productList = await this.getProducts();

			const productSearch = productList.find(
				(product) => product._id == productID
			);

			if (productSearch) {
				console.info('Product found!');
				return productSearch;
			} else {
				console.error(`ID ${productID} not found`);
				return;
			}
		} catch {
			console.error(
				`Product cannot be displayed. \n 
            Error: ${err}`
			);
			return;
		}
	}

	async add(newProduct) {
		try {
			const {
				title,
				description,
				code,
				price,
				status,
				stock,
				category,
				thumbnail,
			} = newProduct;

			if (
				!title ||
				!description ||
				!code ||
				!price ||
				!status ||
				!stock ||
				!category ||
				!thumbnail
			)
				return console.error(
					'There are missing fields to complete. They are all mandatory'
				);

			if (
				typeof title !== 'string' ||
				typeof description !== 'string' ||
				typeof code !== 'string' ||
				typeof price !== 'number' ||
				typeof status !== 'boolean' ||
				typeof stock !== 'number' ||
				typeof category !== 'string' ||
				!Array.isArray(thumbnail)
			) {
				return console.error('One or more fields have invalid data types');
			}

			const productList = await this.getProducts();

			if (productList.some((product) => product.code === code))
				return console.error(
					`The code ${code} already exists. Try another code`
				);

			const _id = uuidv4();
			const newProductWithID = {
				_id,
				title,
				description,
				code,
				price,
				status,
				stock,
				category,
				thumbnail,
			};

			productList.push(newProductWithID);

			await fs.promises.writeFile(this.path, JSON.stringify(productList));

			console.info(`The product ${title} was successfully added`);

			return newProductWithID;
		} catch (err) {
			console.error(
				`It is not possible to add the product. \n 
                Error: ${err}`
			);
			return;
		}
	}

	async delete(productID) {
		try {
			const productList = await this.getProducts();
			// Crea un nuevo listado sin el producto cuya id se ingreso
			const newProductList = productList.filter(
				(product) => product._id != productID
			);

			await fs.promises.writeFile(this.path, JSON.stringify(newProductList));

			console.info(`The product with the ID ${productID} was removed`);
			return;
		} catch (err) {
			console.error(
				`It is not possible to delete the product. \n 
                Error: ${err}`
			);
			return;
		}
	}

	async update(productID, productUpdated) {
		try {
			const {
				title,
				description,
				code,
				price,
				status,
				stock,
				category,
				thumbnail,
			} = productUpdated;

			const productList = await this.getProducts();

			// Genera un nuevo listado con el producto actualizado
			const updatedProductList = productList.map((product) => {
				if (product._id === productID) {
					return {
						...product,
						title,
						description,
						code,
						price,
						status,
						stock,
						category,
						thumbnail,
					};
				} else {
					return product;
				}
			});

			const updatedProduct = updatedProductList.find(
				(product) => product._id === productID
			);

			await fs.promises.writeFile(
				this.path,
				JSON.stringify(updatedProductList)
			);

			console.info(`The product with ID ${productID} was updated`);
			return updatedProduct;
		} catch (err) {
			console.error(
				`It is not possible to update the product. \n 
	Error: ${err}`
			);
			return;
		}
	}
}
