import { Router } from 'express';
import { roleControl } from '../middlewares/roleControl.middleware.js';
import {
	getCarts,
	getCartById,
	addCart,
	addProductToCart,
	deleteOneProductfromCart,
	updateAllProductsOfCart,
	updateQuantityOfProduct,
	deleteAllProductsfromCart,
	purchaseProductsInCart,
} from '../controllers/cart.controller.js';

const cartRouter = Router();

cartRouter.get('/', getCarts);
cartRouter.get('/:cid', getCartById);
cartRouter.post('/', addCart);
cartRouter.post(
	'/:cid/products/:pid',
	//roleControl('USER'),
	addProductToCart
);
cartRouter.delete('/:cid/products/:pid', deleteOneProductfromCart);
cartRouter.put('/:cid', updateAllProductsOfCart);
cartRouter.put('/:cid/products/:pid', updateQuantityOfProduct);
cartRouter.delete('/:cid', deleteAllProductsfromCart);
cartRouter.get('/:cid/purchase', purchaseProductsInCart);

export { cartRouter };
