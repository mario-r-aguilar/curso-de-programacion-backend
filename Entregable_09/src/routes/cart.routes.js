import { Router } from 'express';
import {
	getCarts,
	getCartById,
	addCart,
	addProductToCart,
	deleteOneProductfromCart,
	updateAllProductsOfCart,
	updateQuantityOfProduct,
	deleteAllProductsfromCart,
} from '../controllers/cart.controller.js';

const cartRouter = Router();

cartRouter.get('/', getCarts);
cartRouter.get('/:cid', getCartById);
cartRouter.post('/', addCart);
cartRouter.post('/:cid/products/:pid', addProductToCart);
cartRouter.delete('/:cid/products/:pid', deleteOneProductfromCart);
cartRouter.put('/:cid', updateAllProductsOfCart);
cartRouter.put('/:cid/products/:pid', updateQuantityOfProduct);
cartRouter.delete('/:cid', deleteAllProductsfromCart);

export { cartRouter };
