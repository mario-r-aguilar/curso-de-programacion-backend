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
