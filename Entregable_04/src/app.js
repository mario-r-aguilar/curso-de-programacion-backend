import express from 'express';
import { productManager } from './ProductManager.js';

const app = express();

// Línea utilizada para el manejo de datos complejos enviados por url
app.use(express.urlencoded({ extended: true }));

/**
 * Este endpoint por defecto muestra todos los productos que se encuentran
 * en la DB usando el método getProducts() de la clase ProducManager.
 * Asimismo a través de la query limit se puede elegir la cantidad
 * de productos que queremos ver por pantalla. Este filtro se logra con el uso
 * del método de arrays slice().
 */
app.get('/api/products/', async (req, res) => {
	try {
		let limit = req.query.limit;
		let productList = await productManager.getProducts();

		if (limit) {
			const productsLimited = productList.slice(0, limit);
			return res.send({ productsLimited });
		}

		return res.send({ productList });
	} catch (error) {
		return res.send(`Error interno del servidor: ${error}`);
	}
});

/**
 * Este endpoint muestra un producto según la id que le pasemos, para ello usa
 * el método getProductById() de la clase ProductManager.
 * La id es ingresada por el usuario a través de params y antes de ser usada
 * por getProductById(), es parseada a número con parseInt() para que coincida
 * con el tipo de dato de la DB. En caso de no encontrarla muestra el error en
 * pantalla.
 */
app.get('/api/products/:pid', async (req, res) => {
	try {
		let { pid } = req.params;
		pid = parseInt(pid);
		const product = await productManager.getProductById(pid);

		if (product) {
			return res.send(product);
		} else {
			return res.send({ error: 'Producto no encontrado' });
		}
	} catch (error) {
		return res.send(`Error interno del servidor: ${error}`);
	}
});

app.listen(8080, () => {
	console.log('Server listening port 8080...');
});
