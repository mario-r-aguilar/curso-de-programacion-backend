import { productModel } from './models/product.model.js';
import ProductDAOInterface from '../productDaoInterface.js';

export default class ProductMongoDAO extends ProductDAOInterface {
	constructor() {
		super();
		this.model = productModel;
	}

	async get(limit = 10, page = 1, sort, category, status, title) {
		try {
			let query = {};

			if (title) {
				query.title = { $regex: title, $options: 'i' };
			}

			if (category) {
				query.category = category;
			}

			if (status) {
				query.status = status;
			}

			const options = {
				lean: true,
				page,
				limit,
			};

			if (sort) {
				options.sort = { price: sort };
			}

			return await productModel.paginate(query, options);
		} catch (error) {
			console.error(
				`It is not possible to obtain the products.\n 
				Error: ${error}`
			);
			return;
		}
	}

	async getById(productID) {
		try {
			return await this.model.findById(productID).lean().exec();
		} catch (error) {
			console.error(
				`It is not possible to obtain the product.\n 
				Error: ${error}`
			);
			return;
		}
	}

	async add(newProduct) {
		try {
			return await this.model.create(newProduct);
		} catch (error) {
			console.error(
				`It is not possible to add the product.\n 
				Error: ${error}`
			);
			return;
		}
	}

	async delete(productID) {
		try {
			return await this.model.deleteOne({ _id: productID });
		} catch (error) {
			console.error(
				`It is not possible to delete the product.\n 
				Error: ${error}`
			);
			return;
		}
	}

	async update(productID, productUpdated) {
		try {
			return await this.model.updateOne(
				{ _id: productID },
				{ $set: productUpdated }
			);
		} catch (error) {
			console.error(
				`It is not possible to update the product.\n 
				Error: ${error}`
			);
			return;
		}
	}
}
