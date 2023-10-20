import express from 'express';
import { productRouter } from './router/productRouter.js';
import { cartRouter } from './router/cartRouter.js';

const app = express();

app.use(express.json()); // Para enviar datos en formato json desde el servidor
app.use(express.urlencoded({ extended: true })); // Manejo de datos complejos por url
app.use('/api/products/', productRouter); // Router para productos
app.use('/api/carts/', cartRouter); // Router para carritos

app.listen(8080, () => {
	console.log('Server listening port 8080...');
});
