import { productModel } from './models/product.model.js';

class ProductManagerMongo {
	constructor() {
		this.model = productModel;
	}

	/**
	 * Muestra el listado de productos.
	 * Con el método lean() obtengo los datos como objetos JavaScript simples.
	 * Con el método exec() ejecuto la consulta final después de haber aplicado
	 * diferentes métodos de Mongoose al find().
	 * @param {String} Cantidad de productos que se mostraran
	 * @returns {Array} Listado de productos
	 */
	async getProducts(limit) {
		try {
			if (limit) {
				return await this.model.find().limit(limit).lean().exec();
			} else {
				return await this.model.find().lean().exec();
			}
		} catch (error) {
			console.error(
				`No es posible obtener los productos.\n 
				Error: ${error}`
			);
			return;
		}
	}

	/**
	 * Busca un producto mediante su ID y muestra su contenido.
	 * @param {String} ID del producto
	 * @returns {Object} Producto buscado
	 */
	async getProductById(productID) {
		try {
			return await this.model.findById(productID).lean().exec();
		} catch (error) {
			console.error(
				`No es posible obtener el producto.\n 
				Error: ${error}`
			);
			return;
		}
	}

	/**
	 * Agrega un producto.
	 * @param {Object} Producto a agregar
	 * @returns {Object} Nuevo producto agregado
	 */
	async addProduct(newProduct) {
		try {
			return await this.model.create(newProduct);
		} catch (error) {
			console.error(
				`No es posible agregar el producto.\n 
				Error: ${error}`
			);
			return;
		}
	}

	/**
	 * Busca un producto mediante su ID y elimina el producto.
	 * @param {String} ID del producto
	 */
	async deleteProduct(productID) {
		try {
			return await this.model.deleteOne({ _id: productID });
		} catch (error) {
			console.error(
				`No es posible eliminar el producto.\n 
				Error: ${error}`
			);
			return;
		}
	}

	/**
	 * Actualiza un producto.
	 * @param {String} ID del producto
	 * @param {Object} Producto actualizado
	 */
	async updateProduct(productID, productToChanged) {
		try {
			return await this.model.updateOne(
				{ _id: productID },
				productToChanged
			);
		} catch (error) {
			console.error(
				`No es posible actualizar el producto.\n 
				Error: ${error}`
			);
			return;
		}
	}
}

export default ProductManagerMongo;
