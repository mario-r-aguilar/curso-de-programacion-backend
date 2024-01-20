import { cartModel } from './models/cart.model.js';

export default class CartMongoDAO {
	constructor() {
		this.model = cartModel;
	}

	async get() {
		try {
			return await this.model.find().lean().exec();
		} catch (error) {
			console.error(
				`It is not possible to obtain the carts.\n 
				Error: ${error}`
			);
			return;
		}
	}

	async getById(cartID) {
		try {
			return await this.model
				.findOne({ _id: cartID })
				.populate('products.product')
				.lean()
				.exec();
		} catch (error) {
			console.error(
				`Unable to get cart.\n 
				Error: ${error}`
			);
			return;
		}
	}

	async add(newCart) {
		try {
			return await this.model.create(newCart);
		} catch (error) {
			console.error(
				`It is not possible to add the cart.\n 
				Error: ${error}`
			);
			return;
		}
	}

	async delete(cartID) {
		try {
			return await this.model.deleteOne({ _id: cartID });
		} catch (error) {
			console.error(
				`It is not possible to delete the cart.\n 
				Error: ${error}`
			);
			return;
		}
	}

	async update(cartID, cartUpdated) {
		try {
			return await this.model.updateOne(
				{ _id: cartID },
				{ $set: cartUpdated }
			);
		} catch (error) {
			console.error(
				`It is not possible to update the cart.\n 
				Error: ${error}`
			);
			return;
		}
	}
}
