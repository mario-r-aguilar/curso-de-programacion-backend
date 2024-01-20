export default class ProductRepository {
	constructor(dao) {
		this.dao = dao;
	}

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
