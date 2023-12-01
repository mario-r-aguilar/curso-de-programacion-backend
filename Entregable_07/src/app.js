import express from 'express';
import handlebars from 'express-handlebars';
import { socketServer } from './utils/websocket.js';
import path from 'node:path';
import getDirname from './utils/utils.js';
import { productRouter } from './routes/product.routes.js';
import { cartRouter } from './routes/cart.routes.js';
import { viewsRouter } from './routes/views.routes.js';
import { sessionRouter } from './routes/session.routes.js';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import dotenv from 'dotenv';

const app = express();

// Almaceno las variables de entorno
dotenv.config();
const mongoDbActive = process.env.MONGO_DB_ACTIVE;
const mongoPass = process.env.MONGO_PASS;
const mongoUser = process.env.MONGO_USER;
const mongoDbName = process.env.MONGO_DB_NAME;
const urlMongoDb = `mongodb+srv://${mongoUser}:${mongoPass}@ecommerce-coder.1dfmp8r.mongodb.net/?retryWrites=true&w=majority`;

// Permite que __dirname funcione por mas que lo cambie de carpeta
const __dirname = getDirname(import.meta.url);
// Configuro carpeta para archivos estáticos
app.use('/static', express.static(path.join(__dirname, '/public')));

// Manejo de datos de express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handlebars config
app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'handlebars');

// Inicializo cookie-parser
app.use(cookieParser('mOnG0dBD4t@'));

// Configuración de sessions
app.use(
	session({
		store: MongoStore.create({
			mongoUrl: urlMongoDb,
			dbName: mongoDbName,
		}),
		secret: 'dAt4B@S3M0ngODB',
		resave: true,
		saveUninitialized: true,
	})
);

// Routes
app.use('/api/users', sessionRouter);
app.use('/api/products/', productRouter);
app.use('/api/carts/', cartRouter);
app.use('/', viewsRouter);

// Inicia el servidor según la base de datos activa
if (mongoDbActive == 'yes') {
	mongoose
		.connect(urlMongoDb, { dbName: mongoDbName })
		.then(() => {
			console.info('Mongo DB connected');
			const httpServer = app.listen(8080, () => {
				console.info('Server online and listening');
			});

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
