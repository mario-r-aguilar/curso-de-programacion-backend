import { cartModel } from './models/cart.model.js';
import ProductManagerMongo from '../dao/ProductManager.mongo.js';
import config from '../config/config.js';

let productManager;

config.mongoDbActive === 'yes'
	? (productManager = new ProductManagerMongo())
	: console.info('Base de Datos de Mongo Desactivada');

class CartManagerMongo {
	constructor() {
		this.model = cartModel;
	}
	/**
	 * Muestra el listado de carritos.
	 * Con el método lean() obtengo los datos como objetos JavaScript simples.
	 * Con el método exec() ejecuto la consulta final después de haber aplicado
	 * diferentes métodos de Mongoose al find().
	 * @returns {Array} Listado de carritos.
	 */
	async getCarts() {
		try {
			return await this.model.find().lean().exec();
		} catch (error) {
			console.error(
				`No es posible obtener los carritos.\n 
				Error: ${error}`
			);
			return;
		}
	}

	/**
	 * Busca un carrito mediante su ID y muestra el detalle de su contenido usando populate.
	 * @param {String} ID del carrito
	 * @returns {Object} Carrito buscado
	 */
	async getCartById(cartID) {
		try {
			return await this.model
				.findOne({ _id: cartID })
				.populate('products.product')
				.lean()
				.exec();
		} catch (error) {
			console.error(
				`No es posible obtener el carrito.\n 
				Error: ${error}`
			);
			return;
		}
	}

	/**
	 * Crea un nuevo carrito.
	 * @param {Object} Nuevo carrito a agregar
	 * @returns {Object} Carrito agregado
	 */
	async addCart(newCart) {
		try {
			return await this.model.create(newCart);
		} catch (error) {
			console.error(
				`No es posible agregar el carrito.\n 
				Error: ${error}`
			);
			return;
		}
	}

	/**
	 * Agrega un producto a un carrito.
	 * @param {String} ID del carrito
	 * @param {String} ID del producto
	 * @returns {Object} Carrito con productos agregados
	 */
	async addProductToCart(cartId, productId) {
		try {
			const cart = await this.model.findById(cartId);
			const product = await productManager.getProductById(productId);

			if (!product) {
				console.error('El producto no existe');
				return;
			}

			const productExist = cart.products.find(
				// Iguala el tipo de valor de la ID convirtiéndolos a string
				(item) => String(item.product) === String(productId)
			);

			if (productExist) {
				productExist.quantity++;
			} else {
				cart.products.push({ product: product._id });
			}
			const updatedCart = await this.model.findOneAndUpdate(
				{ _id: cartId },
				{ $set: { products: cart.products } },
				// Devuelve la versión actualizada del carrito luego del proceso de actualización.
				{ new: true }
			);
			return updatedCart;
		} catch (error) {
			console.error(
				`No es posible agregar el producto al carrito.\n 
				Error: ${error}`
			);
			return;
		}
	}

	/**
	 * Elimina un producto del carrito.
	 * @param {String} Id del carrito
	 * @param {String} Id del producto
	 */
	async deleteOneProductfromCart(cartId, productId) {
		try {
			const cart = await this.getCartById(cartId);

			const productIndex = cart.products.findIndex(
				(item) => String(item.product._id) === String(productId)
			);

			if (productIndex !== -1) {
				cart.products.splice(productIndex, 1);
			} else {
				console.error('No se encontró el producto en el carrito.');
				return;
			}

			const updatedCart = await this.model.findOneAndUpdate(
				{ _id: cartId },
				{ $set: { products: cart.products } },
				{ new: true }
			);

			return updatedCart;
		} catch (error) {
			console.error(
				`No es posible eliminar el producto del carrito.\n 
				Error: ${error}`
			);
			return;
		}
	}

	/**
	 * Actualiza todo el carrito a partir del array contenido en la respuesta
	 * a un GET al endpoint /API/products.
	 * @param {String} Id del carrito
	 * @param {Object} Respuesta obtenida al hacer un GET al endpoint /API/products
	 * @returns {Object} Carrito con una nueva lista de productos
	 */
	async updateAllProductsOfCart(cartId, newProductList) {
		try {
			const cart = await this.getCartById(cartId);

			// Valida si se trata de un array y que el mismo no esté vacío
			if (
				!Array.isArray(newProductList.payload.docs) ||
				newProductList.payload.docs.length === 0
			) {
				console.error(
					'El nuevo listado de productos es inválido o está vacío.'
				);
				return;
			}

			// Actualiza los productos del carrito con la nueva lista
			cart.products = newProductList.payload.docs.map((product) => ({
				product: product._id,
				quantity: 1, // Asigno la cantidad inicial del producto
			}));

			const updatedCart = await this.model.findOneAndUpdate(
				{ _id: cartId },
				{ $set: { products: cart.products } },
				{ new: true }
			);

			return updatedCart;
		} catch (error) {
			console.error(
				`No es posible actualizar los productos del carrito.\n 
					Error: ${error}`
			);
			return;
		}
	}

	/**
	 * Actualiza la cantidad de un producto que se encuentra en el carrito.
	 * @param {String} Id del carrito
	 * @param {String} Id del producto
	 * @param {Object} Nueva cantidad del producto
	 * @returns {Object} Carrito actualizado
	 */
	async updateQuantityOfProduct(cartId, productId, newQuantity) {
		try {
			const cart = await this.getCartById(cartId);
			const product = await productManager.getProductById(productId);

			if (!product) {
				console.error(
					'El producto no existe o hubo un error al obtenerlo.'
				);
				return;
			}

			const productExistInCart = cart.products.find(
				(item) => String(item.product._id) === String(productId)
			);

			// Almaceno el valor de la nueva cantidad
			if (productExistInCart) {
				const parsedQuantity = newQuantity.quantity;

				// Convierto la cantidad a número y la actualizo en el producto
				if (!isNaN(parsedQuantity)) {
					productExistInCart.quantity = parsedQuantity;
				} else {
					console.error(
						'La cantidad proporcionada no es un número válido.'
					);
					return;
				}
			} else {
				console.error('El producto no se encuentra en el carrito.');
				return;
			}

			const updatedCart = await this.model.findOneAndUpdate(
				{ _id: cartId },
				{ $set: { products: cart.products } },
				{ new: true }
			);
			return updatedCart;
		} catch (error) {
			console.error(
				`No es posible actualizar la cantidad del producto.\n 
				Error: ${error}`
			);
			return;
		}
	}

	/**
	 * Elimina todos los productos que contenga el carrito.
	 * @param {String} Id del carrito
	 * @returns {Object} Carrito actualizado
	 */
	async deleteAllProductsfromCart(cartId) {
		try {
			const updatedCart = await this.model.findOneAndUpdate(
				{ _id: cartId },
				{ $set: { products: [] } },
				{ new: true }
			);
			return updatedCart;
		} catch (error) {
			console.error(
				`No es posible eliminar los productos del carrito.\n 
				Error: ${error}`
			);
			return;
		}
	}
}

export default CartManagerMongo;
