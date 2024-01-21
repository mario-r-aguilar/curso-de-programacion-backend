import { ProductService, TicketService } from '../services/index.js';

export default class CartRepository {
	constructor(dao) {
		this.dao = dao;
	}

	async getCarts() {
		try {
			return await this.dao.get();
		} catch (error) {
			console.error(
				`It is not possible to obtain the carts.\n 
				Error: ${error}`
			);
			return;
		}
	}

	async getCartById(cartID) {
		try {
			return await this.dao.getById(cartID);
		} catch (error) {
			console.error(
				`It is not possible to get the cart.\n 
				Error: ${error}`
			);
			return;
		}
	}

	async addCart(newCart) {
		try {
			return await this.dao.add(newCart);
		} catch (error) {
			console.error(
				`It is not possible to add the cart.\n 
				Error: ${error}`
			);
			return;
		}
	}

	async addProductToCart(cartID, productID) {
		try {
			const cart = await this.getCartById(cartID);
			const product = await ProductService.getProductById(productID);

			if (!cart || !product) {
				throw new Error('The cart and/or the product does not exist');
			}

			const productExist = cart.products.find(
				// Iguala el tipo de valor de la ID convirtiéndolos a string
				(item) => String(item.product._id) === String(productID)
			);

			if (productExist) {
				productExist.quantity++;
			} else {
				cart.products.push({ product: product._id });
			}

			const updatedCart = await this.dao.update(cartID, cart);
			return updatedCart;
		} catch (error) {
			console.error(
				`It is not possible to add the product to the cart.\n 
				Error: ${error}`
			);
			return;
		}
	}

	async deleteOneProductfromCart(cartID, productID) {
		try {
			const cart = await this.getCartById(cartID);
			const product = await ProductService.getProductById(productID);

			if (!cart || !product) {
				throw new Error('The cart and/or the product does not exist');
			}

			const productIndex = cart.products.findIndex(
				(item) => String(item.product._id) === String(productID)
			);

			if (productIndex !== -1) {
				cart.products.splice(productIndex, 1);
			} else {
				throw new Error('The product was not found in the cart.');
			}

			const updatedCart = await this.dao.update(cartID, cart);
			return updatedCart;
		} catch (error) {
			console.error(
				`It is not possible to remove the product from the cart.\n 
				Error: ${error}`
			);
			return;
		}
	}

	async updateAllProductsOfCart(cartID, newProductList) {
		try {
			const cart = await this.getCartById(cartID);

			if (!cart) {
				throw new Error('The cart does not exist');
			}

			// Valida si es un array y no esté vacío
			if (
				!Array.isArray(newProductList.payload.docs) ||
				newProductList.payload.docs.length === 0
			) {
				throw new Error('The new product listing is invalid or empty');
			}

			// Actualiza los productos del carrito con la nueva lista
			cart.products = newProductList.payload.docs.map((product) => ({
				product: product._id,
				quantity: 1, // Asigno la cantidad inicial del producto
			}));

			const updatedCart = await this.dao.update(cartID, cart);
			return updatedCart;
		} catch (error) {
			console.error(
				`It is not possible to update the products in the cart.\n 
					Error: ${error}`
			);
			return;
		}
	}

	async updateQuantityOfProduct(cartID, productID, newQuantity) {
		try {
			const cart = await this.getCartById(cartID);
			const product = await ProductService.getProductById(productID);

			if (!cart || !product) {
				throw new Error('The cart and/or the product does not exist');
			}

			const productExistInCart = cart.products.find(
				(item) => String(item.product._id) === String(productId)
			);

			// Almaceno el valor de la nueva cantidad
			if (productExistInCart) {
				const parsedQuantity = newQuantity.quantity;

				// Convierto la cantidad a número y la actualizo en el producto
				if (!isNaN(parsedQuantity)) {
					productExistInCart.quantity = parsedQuantity;
				} else {
					throw new Error('The value provided is not a valid number');
				}
			} else {
				throw new Error('The product is not in the cart');
			}

			const updatedCart = await this.dao.update(cartID, cart);
			return updatedCart;
		} catch (error) {
			console.error(
				`It is not possible to update the product quantity.\n 
				Error: ${error}`
			);
			return;
		}
	}

	async deleteAllProductsfromCart(cartID) {
		try {
			const cart = await this.getCartById(cartID);

			if (!cart) {
				throw new Error('The cart does not exist');
			}

			cart.products = [];

			const updatedCart = await this.dao.update(cartID, cart);
			return updatedCart;
		} catch (error) {
			console.error(
				`It is not possible to remove products from the cart.\n 
				Error: ${error}`
			);
			return;
		}
	}

	async purchaseProductsInCart(cartID, user) {
		try {
			const cart = await this.getCartById(cartID);
			let productStockOk = [];
			let productStockNone = [];
			let ticket = null;

			// Manejo de stock y carrito resultante
			for (const productInCart of cart.products) {
				let product = await ProductService.getProductById(
					productInCart.product._id
				);

				if (product.stock < productInCart.quantity) {
					productStockNone.push(product);
				} else {
					product.stock -= productInCart.quantity;
					await ProductService.updateProduct(
						productInCart.product._id,
						product
					);
					product.price *= productInCart.quantity;
					productStockOk.push(product);
					await this.deleteOneProductfromCart(
						cartID,
						productInCart.product._id
					);
				}
			}

			// Generación de ticket para response
			let totalPricePurchase = productStockOk.reduce(
				(total, product) => total + product.price,
				0
			);

			const ticketData = {
				amount: totalPricePurchase,
				purchaser: user.email,
			};

			if (ticketData.amount !== 0) {
				ticket = await TicketService.addTicket(ticketData);
			}

			// Ids de productos sin stock para response
			let productStockNoneIDs = productStockNone.map((product) => {
				return product._id;
			});

			const payload = {
				status: 'success',
				ticket: ticket !== null ? ticket : 'ticket not generated',
				productsWithoutStock:
					productStockNoneIDs.length > 0 ? productStockNoneIDs : 'none',
			};
			return payload;
		} catch (error) {
			console.error(
				`it is not possible to make the purchase.\n 
			Error: ${error}`
			);
			return;
		}
	}
}
