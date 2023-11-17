import { productModel } from './models/product.model.js';

class ProductManagerMongo {
	constructor() {
		this.model = productModel;
	}

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
