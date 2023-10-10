import express from 'express';
import { productManager } from './ProductManager.js';

const app = express();

// Para el manejo de datos complejos
app.use(express.urlencoded({ extended: true }));

app.get('/products', async (req, res) => {
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

app.get('/products/:pid', async (req, res) => {
	try {
		let { pid } = req.params;
		pid = parseInt(pid); // Convierte el id a tipo número, tal cual está almacenado en el archivo json
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
	console.log('Server listening...');
});
