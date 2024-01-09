import { Router } from 'express';
import {
	getProducts,
	getProductById,
	addProduct,
	updateProduct,
	deleteProduct,
} from '../controllers/product.controller.js';

const productRouter = Router();

productRouter.get('/', getProducts);
productRouter.get('/:pid', getProductById);
productRouter.post('/', addProduct);
productRouter.put('/:pid', updateProduct);
productRouter.delete('/:pid', deleteProduct);

export { productRouter };
