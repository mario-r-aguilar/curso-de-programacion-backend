import { productModel } from './models/product.model.js';

class ProductManagerMongo {
	constructor() {
		this.model = productModel;
	}

	async getProducts() {
		return await this.model.find().lean().exec();
	}

	async getProductById(productID) {
		return await this.model.findById(productID).lean().exec();
	}

	async addProduct(newProduct) {
		return await this.model.create(newProduct);
	}

	async deleteProduct(productID) {
		return await this.model.deleteOne({ _id: productID });
	}

	async updateProduct(productID, productToChanged) {
		return await this.model.updateOne({ _id: productID }, productToChanged);
	}
}

export default ProductManagerMongo;
