import { Router } from 'express';
import passport from 'passport';
import { isUserAuth } from '../middlewares/auth.middleware.js';
import {
	renderLogin,
	renderRegister,
	renderProductsPage,
	renderCart,
	renderRealTimeProducts,
	renderChat,
} from '../controllers/views.controller.js';

const viewsRouter = Router();

// El middleware isUserAuth redirige a /products en caso de que el usuario esté logueado
// La estrategia current valida la existencia de un token antes de dar acceso a la ruta
viewsRouter.get('/', isUserAuth, renderLogin);
viewsRouter.get('/register', isUserAuth, renderRegister);

viewsRouter.get(
	'/products',
	passport.authenticate('current', { session: false }),
	renderProductsPage
);

viewsRouter.get(
	'/carts/:cid',
	passport.authenticate('current', { session: false }),
	renderCart
);

viewsRouter.get(
	'/realtimeproducts',
	passport.authenticate('current', { session: false }),
	renderRealTimeProducts
);

viewsRouter.get(
	'/chat',
	passport.authenticate('current', { session: false }),
	renderChat
);

export { viewsRouter };
