import fs from 'fs';
import ProductManagerMongo from '../dao/ProductManager.mongo.js';
import ProductManagerFileSystem from '../dao/ProductManager.filesystem.js';
import dotenv from 'dotenv';

dotenv.config();
const mongoDbActive = process.env.MONGO_DB_ACTIVE;

let productManager;

mongoDbActive === 'yes'
	? (productManager = new ProductManagerMongo())
	: (productManager = new ProductManagerFileSystem(
			'./src/dao/db/products.json'
	  ));

class CartManager {
	constructor(path) {
		this.path = path;
		// Si el usuario no brinda una ruta, lo crea en el mismo directorio
		if (!this.path)
			fs.writeFileSync('./dao/db/carts.json', JSON.stringify([]));
	}

	/**
	 * Lee el contenido del archivo donde se encuentra la lista de carritos
	 * y lo retorna.
	 * @returns {Array} Listado de carritos
	 */
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

	/**
	 * Busca un carrito mediante su ID. Primero trae el listado de carritos
	 * con el método getCarts(), luego busca en el listado con el método find
	 * el carrito solicitado y si lo encuentra lo retorna.
	 * @param {Number} ID del producto a buscar
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
	 * Permite autoincrementar la ID del último carrito agregado a la lista.
	 * Para ello obtiene el listado de carritos, almacena en una constante el
	 * último agregado y finalmente incrementa en 1 su ID para ser utilizada
	 * por un nuevo carrito.
	 * @returns {number} Nueva ID
	 */
	#getNewCartID = async () => {
		try {
			const cartsList = await this.getCarts();
			if (cartsList.length === 0) return '1';
			const lastCartAdd = cartsList[cartsList.length - 1];
			const newID = lastCartAdd.id + 1;
			return newID.toString();
		} catch (err) {
			console.error(
				`No es posible asignar una nueva ID.\n 
        Error: ${err}`
			);
			return;
		}
	};

	/**
	 * Primero realiza la validación del campo products para que sea obligatorio,
	 * después trae el listado de carritos. Luego genera la id mediante #getNewID(),
	 * pushea el nuevo carrito al listado y actualiza el archivo donde se guarda.
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
				`No es posible agregar el producto. \n 
            Error: ${err}`
			);
			return;
		}
	}

	/**
	 * Permite agregar un producto a un carrito. Primero almacena el carrito
	 * y el producto en constantes (usa los métodos getCartById() y
	 * getProductById()). Luego trae el listado de carritos completo y genera
	 * una constante donde almacena el listado anterior sin el carrito a actualizar.
	 * Si el producto existe (usa el método some() para saber si está y find()
	 * para traerlo), incrementa la propiedad quantity en 1 y por último
	 * crea una nueva lista actualizada que contiente los carritos existentes
	 * y el carrito modificado. Mientras que si no existe, lo crea y lo agrega
	 * al listado de productos del carrito (con push()) y realiza la misma tarea
	 * anterior de crear una lista actualizada y sobreescribir el archivo de
	 * persistencia.
	 * @param {number} ID del carrito
	 * @param {number} ID del producto a agregar
	 */
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

//Creo una instancia de la clase y la exporto para usarla en otro archivo
export const cartManager = new CartManager('./src/dao/db/carts.json');
