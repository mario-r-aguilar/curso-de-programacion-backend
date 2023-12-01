import { cartModel } from './models/cart.model.js';
import ProductManagerMongo from '../dao/ProductManager.mongo.js';
import dotenv from 'dotenv';

dotenv.config();
const mongoDbActive = process.env.MONGO_DB_ACTIVE;

let productManager;

mongoDbActive === 'yes'
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
	 * Busca un carrito mediante su ID y muestra su contenido usando populate
	 * para ver el detalle de los productos que se encuentran dentro.
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
	 * Primero busca el producto y el carrito mediante sus IDs y los almacena
	 * en constantes. Luego verifica si el producto ya está en el carrito,
	 * previamente iguala el tipo de valor de la ID convirtiéndolos a String.
	 * Si el producto existe en el carrito, incrementa su cantidad en 1
	 * de lo contrario lo agrega. Por último actualiza el carrito en la base
	 * de datos.
	 * Con la opción {new: true} devuelve la versión actualizada del carrito
	 * luego del proceso de actualización.
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
	 * Busca el carrito, valida que el producto se encuentre en el mismo. Si lo
	 * haya, incrementa su cantidad (quantity), si no está muestra un error.
	 * Por último actualiza el carrito en la base de datos.
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
	 * Actualiza todo el carrito a partir de un array contenido en la respuesta
	 * de un GET al endpoint /API/products.
	 * Busca el carrito, valida que el objeto contenga el Array de productos
	 * de hallarlo, reemplaza el contenido del carrito con la nueva lista
	 * asignándole una catidad (quantity) de 1 a cada producto.
	 * Por último actualiza el carrito en la base de datos.
	 * @param {String} Id del carrito
	 * @param {Object} Respuesta al hacer un GET al endpoint /API/products
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
	 * Busca el carrito y el producto, valida que el producto se encuentre
	 * en el carrito. De hallarlo, convierto la cantidad en un número y la
	 * modifico en el producto. Por último actualiza el carrito en la base
	 * de datos.
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

			// Almaceno el valor de la nueva cantidad en una cosntante
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
	 * Actualiza el contenido del carrito con un array vacio.
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
