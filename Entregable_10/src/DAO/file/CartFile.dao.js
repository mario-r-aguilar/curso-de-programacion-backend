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
			if (!cartsList) {
				console.error('The file is empty.');
				return;
			}
			return JSON.parse(cartsList);
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
			const cartsList = await this.get();
			const cartSearch = cartsList.find((cart) => cart._id === cartID);

			if (cartSearch) {
				console.info('Cart found!');
				return cartSearch;
			} else {
				console.error(`Cart ID ${cartID} not found`);
				return null;
			}
		} catch (error) {
			console.error(
				`It is not possible to obtain the cart. \n 
            Error: ${error}`
			);
			return;
		}
	}

	async add(newCart) {
		try {
			const { products } = newCart;

			if (!products) return console.error('Products element is missing');

			const cartsList = await this.get();

			const _id = uuidv4();
			let product;
			const newCartWithID = {
				_id,
				products: [
					{
						product,
						quantity: 1,
					},
				],
			};
			cartsList.push(newCartWithID);

			await fs.promises.writeFile(this.path, JSON.stringify(cartsList));

			console.info(`The cart was successfully added`);
			return newCartWithID;
		} catch (error) {
			console.error(
				`It is not possible to add the cart. \n 
            Error: ${error}`
			);
			return;
		}
	}

	async delete(cartID) {
		try {
			const cartList = await this.get();
			const newCartList = cartList.filter((cart) => cart._id != cartID);

			await fs.promises.writeFile(this.path, JSON.stringify(newCartList));

			console.info(`The cart ID ${cartID} was removed`);
			return;
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
			const { products } = cartUpdated;

			const cartList = await this.get();

			const updatedCartList = cartList.map((cart) => {
				if (cart._id === cartID) {
					return {
						...cart,
						products,
					};
				} else {
					return cart;
				}
			});

			const updatedCart = updatedCartList.find(
				(cart) => cart._id === cartID
			);

			await fs.promises.writeFile(
				this.path,
				JSON.stringify(updatedCartList)
			);

			console.info(`The cart ID ${cartID} was updated`);
			return updatedCart;
		} catch (error) {
			console.error(
				`It is not possible to update the cart.\n 
				Error: ${error}`
			);
			return;
		}
	}
}
