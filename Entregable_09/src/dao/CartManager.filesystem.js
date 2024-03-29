import fs from 'fs';
import ProductManagerFileSystem from '../dao/ProductManager.filesystem.js';
import config from '../config/config.js';

// Genera una instancia de la clase ProductManagerFileSystem() solo si no se usa la DB de Mongo
let productManager;
config.mongoDbActive === 'yes'
	? console.info('Base de Datos de File System Desactivada')
	: (productManager = new ProductManagerFileSystem(
			'./src/dao/db/products.json'
	  ));

class CartManagerFileSystem {
	constructor(path) {
		this.path = path;
		// Si el usuario no brinda una ruta, crea el archivo con un array vacío
		if (!this.path)
			fs.writeFileSync('./dao/db/carts.json', JSON.stringify([]));
	}

	/**
	 * Obtiene la lista de carritos.
	 * @returns {Array} Listado de carritos
	 */
	async getCarts() {
		try {
			const cartsList = await fs.promises.readFile(this.path, 'utf-8');
			return JSON.parse(cartsList);
		} catch (err) {
			console.error(
				`No es posible obtener los carritos.\n 
            Error: ${err}`
			);
			return;
		}
	}

	/**
	 * Busca un carrito mediante su ID.
	 * @param {String} ID del producto a buscar
	 * @returns {Object} Producto buscado
	 */
	async getCartById(cartID) {
		try {
			const cartsList = await this.getCarts();

			const cartSearch = cartsList.find((cart) => cart.id == cartID);

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

	/**
	 * Permite obtener una ID para ser utilizada por un nuevo carrito que sea agregado.
	 * @returns {String} Nueva ID
	 */
	#getNewCartID = async () => {
		try {
			const cartsList = await this.getCarts();
			if (cartsList.length === 0) return '1';
			// almacena el índice del último carrito agregado
			const lastCartAdd = cartsList[cartsList.length - 1];
			// genera una ID (último índice +1) y la convierte a string
			const newID = lastCartAdd.id + 1;
			return newID.toString();
		} catch (err) {
			console.error(
				`No es posible asignar una ID.\n 
        Error: ${err}`
			);
			return;
		}
	};

	/**
	 * Agrega un nuevo carrito.
	 * @param {Object} Nuevo carrito a agregar
	 */
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
				`No es posible agregar el carrito. \n 
            Error: ${err}`
			);
			return;
		}
	}

	/**
	 * Permite agregar un producto a un carrito.
	 * @param {String} ID del carrito
	 * @param {String} ID del producto a agregar
	 */
	async addProductToCart(cartId, productId) {
		try {
			const cart = await this.getCartById(cartId);
			const product = await productManager.getProductById(productId);
			const cartsList = await this.getCarts();
			const cartsListWithoutCart = cartsList.filter(
				(cart) => cart.id !== cartId
			);

			// Corrobora si el producto existe
			if (cart.products.some((product) => product.id === productId)) {
				let productExist = cart.products.find(
					(product) => product.id === productId
				);
				// Si el producto existe incrementa su cantidad
				productExist.quantity++;
				let cartsListUpdated = [cart, ...cartsListWithoutCart];
				await fs.promises.writeFile(
					this.path,
					JSON.stringify(cartsListUpdated)
				);
				console.info('Productos del carrito actualizados');
				return;
			}

			// Si el producto no existe, lo agrega al carrito
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

export default CartManagerFileSystem;
