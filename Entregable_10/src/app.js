import express from 'express';
import handlebars from 'express-handlebars';
import { socketServer } from './utils/websocket.js';
import path from 'node:path';
import getDirname from './utils/utils.js';
import { productRouter } from './routes/product.routes.js';
import { cartRouter } from './routes/cart.routes.js';
import { viewsRouter } from './routes/views.routes.js';
import { userRouter } from './routes/user.routes.js';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import initializePassport from './config/passport.config.js';
import config from './config/config.js';

const app = express();

const urlMongoDb = `mongodb+srv://${config.mongoUser}:${config.mongoPass}@ecommerce-coder.1dfmp8r.mongodb.net/?retryWrites=true&w=majority`;

// Permite que __dirname funcione por mas que cambie de ubicación el archivo desde donde se encuentra
const __dirname = getDirname(import.meta.url);

app.use('/static', express.static(path.join(__dirname, '/public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handlebars config
app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'handlebars');

// Inicializo cookie-parser
app.use(cookieParser());

// Configuración de session
app.use(
	session({
		secret: config.sessionSecret,
		resave: true,
		saveUninitialized: true,
	})
);

// Inicializo passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/sessions', userRouter);
app.use('/api/products/', productRouter);
app.use('/api/carts/', cartRouter);
app.use('/', viewsRouter);

// Inicia el servidor según la base de datos activa
if (config.mongoDbActive == 'yes') {
	mongoose
		.connect(urlMongoDb, { dbName: config.mongoDbName })
		.then(() => {
			console.info('Mongo DB connected');
			const httpServer = app.listen(8080, () => {
				console.info('Server online and listening');
			});

			// Ejecuto función para inicializar socket.io
			socketServer(httpServer);
		})
		.catch((error) => {
			console.error('No es posible conectarse a la base de datos', error);
		});
} else {
	const httpServer = app.listen(8080, () => {
		console.info('Server online and listening on port 8080');
	});

	socketServer(httpServer);
}
