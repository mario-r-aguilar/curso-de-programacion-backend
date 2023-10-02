const fs = require('fs');
const { title } = require('process');

class ProductManager {
	constructor(path) {
		this.path = path;
		fs.writeFileSync(this.path, JSON.stringify([]));
	}

	async getProducts() {
		try {
			const productList = await fs.promises.readFile(this.path, 'utf-8');
			return JSON.parse(productList);
		} catch (err) {
			console.error(
				`No es posible leer el archivo.\n 
            Error: ${err}`
			);
		}
	}

	async getProductById(productCode) {
		try {
			const productList = await this.getProducts();

			const productSearch = productList.find(
				(prod) => prod.code === productCode
			);

			if (productSearch) {
				console.info('Producto encontrado!');
				return productSearch;
			} else {
				console.error(`Code ${productCode} not found`);
				return 'Intente nuevamente';
			}
		} catch {
			console.error(
				`No es posible agregar el producto. \n 
            Error: ${err}`
			);
		}
	}

	#getNewID = async () => {
		try {
			const productList = await this.getProducts();
			if (productList.length === 0) return 1;
			const lastProductAdd = productList[productList.length - 1];
			return lastProductAdd.id + 1;
		} catch (err) {
			console.error(
				`No es posible asignar una nueva ID.\n 
        Error: ${err}`
			);
		}
	};

	async addProduct(newProduct) {
		try {
			const { title, description, price, thumbnail, code, stock } =
				newProduct;

			if (!title || !description || !price || !thumbnail || !code || !stock)
				return console.error('Todos los campos son obligatorios');

			const productList = await this.getProducts();

			if (productList.some((product) => product.code === code))
				return console.error(
					`El código ${code} ya existe. Intente con otro código`
				);

			const id = await this.#getNewID();

			await productList.push({
				id,
				title,
				description,
				price,
				thumbnail,
				code,
				stock,
			});

			await fs.promises.writeFile(this.path, JSON.stringify(productList));

			console.info(`El producto ${title} fue agregado satisfactoriamente`);

			return productList[id - 1];
		} catch (err) {
			console.error(
				`No es posible agregar el producto. \n 
                Error: ${err}`
			);
		}
	}
}

//Testing
const productManager = new ProductManager('./products.json');

const testing = async () => {
	try {
		console.log(await productManager.getProducts());

		await productManager.addProduct({
			title: 'prueba',
			description: 'Este es un producto prueba',
			price: 200,
			thumbnail: 'Sin imagen',
			code: 'abc123',
			stock: 25,
		});
		await productManager.addProduct({
			title: 'prueba 2',
			description: 'Este es un producto prueba',
			price: 300,
			thumbnail: 'Sin imagen',
			code: 'abc456',
			stock: 30,
		});

		console.log(await productManager.getProducts());

		// producto ya agregado (mismo código)
		await productManager.addProduct({
			title: 'prueba',
			description: 'Este es un producto prueba',
			price: 200,
			thumbnail: 'Sin imagen',
			code: 'abc123',
			stock: 25,
		});
		// producto con código existente
		console.log(await productManager.getProductById('abc123'));
		// producto con código inexistente
		console.log(await productManager.getProductById('code123'));
		// producto con campos faltantes
		await productManager.addProduct({
			title: 'prueba 3',
			description: 'Este es un producto prueba',
			price: 300,
			thumbnail: 'Sin imagen',
			code: 'abc789',
		});
	} catch (err) {
		console.log(
			`No es posible realizar el testing. \n 
    Error: ${err}`
		);
	}
};

testing();
