export default class ProductDAOInterface {
	async get(limit, page, sort, category, status, title) {}
	async getById(productID) {}
	async add(newProduct) {}
	async delete(productID) {}
	async update(productID, productUpdated) {}
}
