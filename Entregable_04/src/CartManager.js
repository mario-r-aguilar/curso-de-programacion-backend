import fs from 'fs';
import { productManager } from './ProductManager.js';

class CartManager {
	constructor(path) {
		this.path = path;
		if (!this.path) fs.writeFileSync(this.path, JSON.stringify([]));
	}

	async getCarts() {
		try {
			const cartsList = await fs.promises.readFile(this.path, 'utf-8');
			return JSON.parse(cartsList);
		} catch (err) {
			console.error(
				`No es posible leer el archivo.\n 
            Error: ${err}`
			);
			return;
		}
	}

	async getCartById(cartID) {
		try {
			const cartsList = await this.getCarts();

			const cartSearch = cartsList.find((cart) => cart.id === cartID);

			if (cartSearch) {
				console.info('Carrito encontrado!');
				return cartSearch;
			} else {
				console.error(`ID ${cartID} not found`);
				return;
			}
		} catch {
			console.error(
				`No es posible mostrar el carrito. \n 
            Error: ${err}`
			);
			return;
		}
	}

	#getNewCartID = async () => {
		try {
			const cartsList = await this.getCarts();
			if (cartsList.length === 0) return 1;
			const lastCartAdd = cartsList[cartsList.length - 1];
			return lastCartAdd.id + 1;
		} catch (err) {
			console.error(
				`No es posible asignar una nueva ID.\n 
        Error: ${err}`
			);
			return;
		}
	};

	async addCart(newCart) {
		try {
			const { products } = newCart;

			if (!products) return console.error('Falta el elemento products');

			const cartsList = await this.getCarts();

			const id = await this.#getNewCartID();

			cartsList.push({
				id,
				products: [],
			});

			await fs.promises.writeFile(this.path, JSON.stringify(cartsList));

			console.info(`El carrito fue agregado satisfactoriamente`);

			return;
		} catch (err) {
			console.error(
				`No es posible agregar el producto. \n 
            Error: ${err}`
			);
			return;
		}
	}

	async addProductToCart(cartId, productId) {
		try {
			const cart = await this.getCartById(cartId);
			const product = await productManager.getProductById(productId);
			const cartsList = await this.getCarts();
			const cartsListWithoutCart = cartsList.filter(
				(cart) => cart.id !== cartId
			);

			if (cart.products.some((product) => product.id === productId)) {
				let productExist = cart.products.find(
					(product) => product.id === productId
				);
				productExist.quantity++;
				let cartsListUpdated = [cart, ...cartsListWithoutCart];
				await fs.promises.writeFile(
					this.path,
					JSON.stringify(cartsListUpdated)
				);
				console.info('Productos del carrito actualizados');
				return;
			}

			cart.products.push({ id: product.id, quantity: 1 });
			let cartsListUpdated = [cart, ...cartsListWithoutCart];
			await fs.promises.writeFile(
				this.path,
				JSON.stringify(cartsListUpdated)
			);

			console.info('Producto agregado al carrito');
			return;
		} catch (err) {
			console.error(
				`No es posible agregar el producto al carrito. \n 
        Error: ${err}`
			);
			return;
		}
	}
}

export const cartManager = new CartManager('./src/carts.json');
