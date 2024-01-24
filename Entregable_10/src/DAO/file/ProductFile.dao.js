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
		} catch (error) {
			console.error(
				`Products cannot be displayed.\n 
            Error: ${error}`
			);
			return;
		}
	}

	async getById(productID) {
		try {
			const productList = await this.get();

			const productSearch = productList.find(
				(product) => product._id === productID
			);

			if (productSearch) {
				console.info('Product found!');
				return productSearch;
			} else {
				console.error(`ID ${productID} not found`);
				return null;
			}
		} catch (error) {
			console.error(
				`Product cannot be displayed. \n 
            Error: ${error}`
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

			const productList = await this.get();

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
				status: true,
				stock,
				category,
				thumbnail,
			};

			productList.push(newProductWithID);

			await fs.promises.writeFile(this.path, JSON.stringify(productList));

			console.info(`The product ${title} was successfully added`);
			return newProductWithID;
		} catch (error) {
			console.error(
				`It is not possible to add the product. \n 
                Error: ${error}`
			);
			return;
		}
	}

	async delete(productID) {
		try {
			const productList = await this.get();
			// Crea un nuevo listado sin el producto cuya id se ingreso
			const newProductList = productList.filter(
				(product) => product._id != productID
			);

			await fs.promises.writeFile(this.path, JSON.stringify(newProductList));

			console.info(`The product ID ${productID} was removed`);
			return;
		} catch (error) {
			console.error(
				`It is not possible to delete the product. \n 
                Error: ${error}`
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

			const productList = await this.get();

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

			console.info(`The product ID ${productID} was updated`);
			return updatedProduct;
		} catch (error) {
			console.error(
				`It is not possible to update the product. \n 
	Error: ${error}`
			);
			return;
		}
	}
}
