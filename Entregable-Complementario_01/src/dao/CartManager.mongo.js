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
	 * Busca un carrito mediante su ID y muestra su contenido.
	 * @param {String} ID del carrito
	 * @returns {Object} Carrito buscado
	 */
	async getCartById(cartID) {
		try {
			return await this.model.findById(cartID).lean().exec();
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
			const cart = await this.getCartById(cartId);
			const product = await productManager.getProductById(productId);
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
}

export default CartManagerMongo;
