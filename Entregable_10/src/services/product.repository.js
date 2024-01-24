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
			console.error(
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
			console.error(
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
			console.error(
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
			console.error(
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
			console.error(
				`It is not possible to update the product.\n 
				Error: ${error}`
			);
			return;
		}
	}
}
