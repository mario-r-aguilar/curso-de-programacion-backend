import fs from 'node:fs';
import { v4 as uuidv4 } from 'uuid';

export default class CartFileDAO {
	constructor() {
		this.path = './src/DAO/file/db/carts.json';

		// Si el usuario no brinda una ruta, crea el archivo
		if (!fs.existsSync(this.path)) {
			fs.writeFileSync(this.path, JSON.stringify([]));
		}
	}

	async get() {
		try {
			const cartsList = await fs.promises.readFile(this.path, 'utf-8');
			return JSON.parse(cartsList);
		} catch (err) {
			console.error(
				`It is not possible to obtain the carts.\n 
            Error: ${err}`
			);
			return;
		}
	}

	async getById(cartID) {
		try {
			const cartsList = await this.getCarts();

			const cartSearch = cartsList.find((cart) => cart._id == cartID);

			if (cartSearch) {
				console.info('Cart found!');
				return cartSearch;
			} else {
				console.error(`ID ${cartID} not found`);
				return;
			}
		} catch {
			console.error(
				`It is not possible to obtain the cart. \n 
            Error: ${err}`
			);
			return;
		}
	}

	async addCart(newCart) {
		try {
			const { products } = newCart;

			if (!products) return console.error('Products element is missing');

			const cartsList = await this.getCarts();

			const _id = uuidv4();
			const newCartWithID = {
				_id,
				products: [],
			};
			cartsList.push(newCartWithID);

			await fs.promises.writeFile(this.path, JSON.stringify(cartsList));

			console.info(`The cart was successfully added`);
			return newCartWithID;
		} catch (err) {
			console.error(
				`It is not possible to add the cart. \n 
            Error: ${err}`
			);
			return;
		}
	}
}