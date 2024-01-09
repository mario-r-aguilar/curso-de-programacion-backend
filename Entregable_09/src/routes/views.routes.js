import { Router } from 'express';
import ProductManagerMongo from '../dao/ProductManager.mongo.js';
import ProductManagerFileSystem from '../dao/ProductManager.filesystem.js';
import config from '../config/config.js';
import passport from 'passport';
import { isUserAuth } from '../middlewares/auth.middleware.js';
import {
	renderLogin,
	renderRegister,
	renderCurrentUser,
	renderCart,
	renderRealTimeProducts,
	renderChat,
} from '../controllers/views.controller.js';

const viewsRouter = Router();

// Genera una instancia de una clase, según la base de datos activa
let productManager;

config.mongoDbActive === 'yes'
	? (productManager = new ProductManagerMongo())
	: (productManager = new ProductManagerFileSystem(
			'./src/dao/db/products.json'
	  ));

// Muestra la página para loguearse. En caso de que ya este logueado, lo
// redirecciona a la página de productos mediante el middleware isUserAuth
viewsRouter.get('/', isUserAuth, renderLogin);

// Muestra la página para registrarse. En caso de que ya este logueado,
// lo redirecciona a la página de productos mediante el middleware isUserAuth
viewsRouter.get('/register', isUserAuth, renderRegister);

// Muestra el listado de productos y permite a filtrar a traves de req.query
// siempre y cuando esté logueado, de lo contrario devuelve un error al intentar
// acceder
viewsRouter.get(
	'/products',
	passport.authenticate('current', { session: false }),
	renderCurrentUser
);

// Muestra el contenido del carrito (funciona con mongoDb)
viewsRouter.get(
	'/carts/:cid',
	passport.authenticate('current', { session: false }),
	renderCart
);

// Muestra el listado de productos y permite actualizarlos en tiempo real
viewsRouter.get(
	'/realtimeproducts',
	passport.authenticate('current', { session: false }),
	renderRealTimeProducts
);

// Muestra el chat
viewsRouter.get(
	'/chat',
	passport.authenticate('current', { session: false }),
	renderChat
);

export { viewsRouter };
