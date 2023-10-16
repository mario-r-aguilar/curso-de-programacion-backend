import express from 'express';
import { productManager } from './ProductManager.js';
import { cartManager } from './CartManager.js';

const app = express();

// Para recibir objetos json desde el body
app.use(express.json());
// Para el manejo de datos complejos enviados por url
app.use(express.urlencoded({ extended: true }));

/**
 * Muestra todos los productos que se encuentran en la DB mediante getProducts().
 * La query limit permite elegir la cantidad de productos que queremos ver
 * por pantalla usando del método de arrays slice().
 */
app.get('/api/products/', async (req, res) => {
	try {
		let limit = req.query.limit;
		let productList = await productManager.getProducts();

		if (limit) {
			const productsLimited = productList.slice(0, limit);
			return res.status(200).send({ productsLimited });
		}

		return res.status(200).send({ productList });
	} catch (error) {
		return res.status(500).send(`Error interno del servidor: ${error}`);
	}
});

/**
 * Muestra un producto según la id que le pasemos mediante el método
 * getProductById(). La id es ingresada por el usuario es parseada a número
 * con parseInt() para que coincida con el tipo de dato de la DB.
 */
app.get('/api/products/:pid', async (req, res) => {
	try {
		let { pid } = req.params;
		pid = parseInt(pid);
		const product = await productManager.getProductById(pid);

		if (product) {
			return res.status(200).send(product);
		} else {
			return res.status(404).send({ error: 'Producto no encontrado' });
		}
	} catch (error) {
		return res.status(500).send(`Error interno del servidor: ${error}`);
	}
});

/*
 * Agrega un nuevo producto (enviado por req.body) mediante el método addProduct()
 */
app.post('/api/products/', async (req, res) => {
	try {
		let newProduct = req.body;
		return res.status(201).send(await productManager.addProduct(newProduct));
	} catch (error) {
		return res.status(500).send(`Error interno del servidor: ${error}`);
	}
});

/*
* Actualiza un producto existente mediante el método updateProduct(). Para ello 
primero obtiene el id del producto por req.params y recibe un producto 
actualizado por req.body
*/
app.put('/api/products/:pid', async (req, res) => {
	try {
		let { pid } = req.params;
		pid = parseInt(pid);
		const updatedProduct = req.body;

		return res
			.status(200)
			.send(await productManager.updateProduct(pid, updatedProduct));
	} catch (error) {
		return res.status(500).send(`Error interno del servidor: ${error}`);
	}
});

/*
* Elimina un producto mediante el método deleteProduct() obteniendo la id del 
mismo por req.params
*/
app.delete('/api/products/:pid', async (req, res) => {
	try {
		let { pid } = req.params;
		pid = parseInt(pid);
		return res.status(200).send(await productManager.deleteProduct(pid));
	} catch (error) {
		return res.status(500).send(`Error interno del servidor: ${error}`);
	}
});

app.get('/api/carts/:cid', async (req, res) => {
	try {
		let { cid } = req.params;
		cid = parseInt(cid);
		const cart = await cartManager.getCartById(cid);

		if (cart) {
			return res.status(200).send(cart);
		} else {
			return res.status(404).send({ error: 'Carrito no encontrado' });
		}
	} catch (error) {
		return res.status(500).send(`Error interno del servidor: ${error}`);
	}
});

app.post('/api/carts/', async (req, res) => {
	try {
		let newCart = req.body;
		return res.status(201).send(await cartManager.addCart(newCart));
	} catch (error) {
		return res.status(500).send(`Error interno del servidor: ${error}`);
	}
});

app.post('/api/carts/:cid/product/:pid', async (req, res) => {
	try {
		let { cid } = req.params;
		cid = parseInt(cid);
		let { pid } = req.params;
		pid = parseInt(pid);

		return res.status(201).send(await cartManager.addProductToCart(cid, pid));
	} catch (error) {
		return res.status(500).send(`Error interno del servidor: ${error}`);
	}
});

app.listen(8080, () => {
	console.log('Server listening port 8080...');
});
