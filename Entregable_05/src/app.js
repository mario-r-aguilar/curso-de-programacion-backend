import express from 'express';
import handlebars from 'express-handlebars';
import { socketServer } from './utils/websocket.js';
import path from 'node:path';
import getDirname from './utils/utils.js';
import { productRouter } from './routes/product.routes.js';
import { cartRouter } from './routes/cart.routes.js';
import { viewsRouter } from './routes/views.routes.js';

const app = express();

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

// Routes
app.use('/api/products/', productRouter);
app.use('/api/carts/', cartRouter);
app.use('/', viewsRouter);

const httpServer = app.listen(8080, () => {
	console.log('Server listening port 8080...');
});

// Inicia socket.io en el servidor
socketServer(httpServer);
