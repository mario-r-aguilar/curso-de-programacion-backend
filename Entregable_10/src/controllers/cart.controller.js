import {
	CartService,
	ProductService,
	TicketService,
} from '../services/index.js';
import UserDTO from '../DTO/user.dto.js';

// Muestra el listado de carritos
export const getCarts = async (req, res) => {
	try {
		const carts = await CartService.getCarts();
		res.send(carts);
	} catch (error) {
		res.status(500).send(`Internal Server Error: ${error}`);
	}
};

// Muestra un carrito según la id enviada por req.params
export const getCartById = async (req, res) => {
	try {
		let { cid } = req.params;
		const cart = await CartService.getCartById(cid);
		res.send(cart);
	} catch (error) {
		res.status(500).send(`Internal Server Error: ${error}`);
	}
};

// Agrega un nuevo carrito enviado desde req.body
export const addCart = async (req, res) => {
	try {
		let newCart = req.body;
		res.status(201).send(await CartService.addCart(newCart));
	} catch (error) {
		res.status(500).send(`Internal Server Error: ${error}`);
	}
};

// Agrega un producto a un carrito mediante sus IDs envíadas por req.params
export const addProductToCart = async (req, res) => {
	try {
		let { cid } = req.params;
		let { pid } = req.params;
		res.status(201).send(await CartService.addProductToCart(cid, pid));
	} catch (error) {
		res.status(500).send(`Internal Server Error: ${error}`);
	}
};

// Elimina un producto del carrito
export const deleteOneProductfromCart = async (req, res) => {
	try {
		let { cid } = req.params;
		let { pid } = req.params;
		res.status(204).send(
			await CartService.deleteOneProductfromCart(cid, pid)
		);
	} catch (error) {
		res.status(500).send(`Internal Server Error: ${error}`);
	}
};

// Actualiza el contenido completo de un carrito
export const updateAllProductsOfCart = async (req, res) => {
	try {
		let { cid } = req.params;
		let newProductList = req.body;
		res.send(await CartService.updateAllProductsOfCart(cid, newProductList));
	} catch (error) {
		res.status(500).send(`Internal Server Error: ${error}`);
	}
};

// Actualiza la cantidad de un producto que se encuentra en el carrito
export const updateQuantityOfProduct = async (req, res) => {
	try {
		let { cid } = req.params;
		let { pid } = req.params;
		let newQuantity = req.body;
		res.send(
			await CartService.updateQuantityOfProduct(cid, pid, newQuantity)
		);
	} catch (error) {
		res.status(500).send(`Internal Server Error: ${error}`);
	}
};

// Elimina todos los productos que se encuentran en un carrito
export const deleteAllProductsfromCart = async (req, res) => {
	try {
		let { cid } = req.params;
		res.status(204).send(await CartService.deleteAllProductsfromCart(cid));
	} catch (error) {
		res.status(500).send(`Internal Server Error: ${error}`);
	}
};

export const purchaseProductsInCart = async (req, res) => {
	try {
		let { cid } = req.params;
		const cart = await CartService.getCartById(cid);

		// const userData = req.session.user;
		// const user = new UserDTO(userData)

		let productStockOk = [];
		let productStockNone = [];
		let ticket = null;

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
				productStockOk.push(product);
			}
		}

		let totalPricePurchase = productStockOk.reduce(
			(total, product) => total + product.price,
			0
		);

		const ticketData = {
			amount: totalPricePurchase,
			//purchaser: user.email,
			purchaser: 'test@test.com',
		};

		if (ticketData.amount !== 0) {
			ticket = await TicketService.addTicket(ticketData);
		}

		let productStockNoneIDs = productStockNone.map((product) => {
			return product._id.toString();
		});

		//console.log('0', productStockNone);

		res.send({
			status: 'success',
			ticket: ticket !== null ? ticket : 'ticket not generated',
			productsWithoutStock:
				productStockNoneIDs.length > 0 ? productStockNoneIDs : 'none',
		});
	} catch (error) {
		res.status(500).send(`Internal Server Error: ${error}`);
	}
};
