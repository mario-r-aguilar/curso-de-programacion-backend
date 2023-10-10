import express from 'express';
import { productManager } from './ProductManager.js';

const app = express();

app.get('/products', (req, res) => {
	let limit = req.query;
	console.log('Products');
});

app.get('/products/:pid', (req, res) => {
	let pid = req.params;
	console.log('Products ID');
});

app.listen(8080, () => {
	console.log('Server listening...');
});
