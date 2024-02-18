import { Router } from 'express';
import passport from 'passport';
import { roleControl } from '../middlewares/roleControl.middleware.js';
import { isUserAuth } from '../middlewares/auth.middleware.js';
import {
	renderLogin,
	renderRegister,
	renderProductsPage,
	renderCart,
	renderRealTimeProducts,
	renderChat,
	renderMockingProducts,
	renderResetPassMail,
	renderResetPassPage,
} from '../controllers/views.controller.js';

const viewsRouter = Router();

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
	roleControl('ADMIN', 'PREMIUM'),
	renderRealTimeProducts
);

viewsRouter.get(
	'/chat',
	passport.authenticate('current', { session: false }),
	roleControl('USER', 'PREMIUM'),
	renderChat
);

viewsRouter.get(
	'/mockingproducts',
	passport.authenticate('current', { session: false }),
	renderMockingProducts
);

viewsRouter.get('/reset-password', renderResetPassMail);

viewsRouter.get('/reset-password/:tkn', renderResetPassPage);

export { viewsRouter };
