import { fakerES_MX as faker } from '@faker-js/faker';
import { devLogger } from '../utils/logger.js';

export default class ProductRepository {
	constructor(dao) {
		this.dao = dao;
	}

	/**
	 * Busca el listado de productos y permite aplicar filtros
	 * @param {Number} Cantidad de productos por pantalla
	 * @param {Number} Número de página (solo disponible en persistencia MONGO)
	 * @param {Number} Ordenar por precio de producto (solo disponible en persistencia MONGO)
	 * @param {String} Categoría del producto (solo disponible en persistencia MONGO)
	 * @param {Boolean} Disponibilidad del producto (solo disponible en persistencia MONGO)
	 * @param {String} Nombre del producto (solo disponible en persistencia MONGO)
	 * @returns {Array} Listado de productos
	 */
	async getProducts(limit, page, sort, category, status, title) {
		try {
			return await this.dao.get(limit, page, sort, category, status, title);
		} catch (error) {
			devLogger.fatal(
				`It is not possible to obtain the products.\n 
				Error: ${error}`
			);
			return;
		}
	}

	/**
	 * Busca un producto mediante su ID
	 * @param {String} ID del producto
	 * @returns {Object} Producto
	 */
	async getProductById(productID) {
		try {
			return await this.dao.getById(productID);
		} catch (error) {
			devLogger.fatal(
				`It is not possible to obtain the product.\n 
				Error: ${error}`
			);
			return;
		}
	}

	/**
	 * Agrega un producto
	 * @param {Object} Producto
	 * @returns {Object} Producto creado
	 */
	async addProduct(newProduct) {
		try {
			return await this.dao.add(newProduct);
		} catch (error) {
			devLogger.fatal(
				`It is not possible to add the product.\n 
				Error: ${error}`
			);
			return;
		}
	}

	/**
	 * Elimina un producto
	 * @param {String} ID del producto
	 * @returns {@type void}
	 */
	async deleteProduct(productID) {
		try {
			return await this.dao.delete(productID);
		} catch (error) {
			devLogger.fatal(
				`It is not possible to delete the product.\n 
				Error: ${error}`
			);
			return;
		}
	}

	/**
	 * Actualiza un producto
	 * @param {String} ID del producto
	 * @param {Object} Producto editado
	 * @returns {Object} Producto actualizado
	 */
	async updateProduct(productID, productUpdated) {
		try {
			return await this.dao.update(productID, productUpdated);
		} catch (error) {
			devLogger.fatal(
				`It is not possible to update the product.\n 
				Error: ${error}`
			);
			return;
		}
	}

	/**
	 * Genera un mock de un producto
	 * @returns {Object} Mock de un producto
	 */
	async mockingproducts() {
		try {
			return {
				_id: faker.database.mongodbObjectId(),
				title: faker.commerce.productName(),
				description: faker.commerce.productDescription(),
				code: faker.string.alphanumeric(10),
				price: faker.commerce.price(),
				status: faker.datatype.boolean(),
				stock: faker.number.int({ max: 100 }),
				category: faker.commerce.department(),
				thumbnail: faker.image.url(),
			};
		} catch (error) {
			devLogger.fatal(
				`It is not possible to show the moking of products.\n 
				Error: ${error}`
			);
		}
	}

	/**
	 * Valida si el usuario fue el creador del producto
	 * @param {Object} Usuario
	 * @param {String} ID del producto
	 * @returns {Boolean} Resultado de la validación
	 */
	async validProductOwner(user, productID) {
		try {
			if (user.role === 'PREMIUM') {
				const product = await this.dao.getById(productID);
				if (!product) {
					throw new Error('Product not found');
				}

				const validOwner = user.email === product.owner;

				if (!validOwner) {
					devLogger.warning(
						'You cannot manage products that were not created by you'
					);
					return validOwner;
				}
			}
			return true;
		} catch (error) {
			devLogger.fatal(
				`It was not possible to validate the creator of the product.\n 
				Error: ${error}`
			);
			return false;
		}
	}
}
