class ProductManager {
	constructor() {
		this.products = [];
	}

	/**
	 * Permite generar una id autoincrementable. Para ello guarda la longitud
	 * del array, con ella ubica el último producto agregado
	 * y finalmente le suma 1 al atributo id de dicho producto.
	 * @returns {number} id del último producto agregado a products + 1
	 */
	#getNewID = () => {
		const arrayLength = this.products.length;
		if (arrayLength === 0) return 1;
		const lastProductAdd = this.products[arrayLength - 1];
		return lastProductAdd.id + 1;
	};

	/**
	 * Muestra todos los productos agregados
	 * @returns {Array} Listado de productos agregados
	 */
	getProducts() {
		return this.products;
	}

	/**
	 * Busca productos mediante su atributo code.
	 * Esto lo logra buscando el código del producto con el método find
	 * y luego haciendo una validación con if del resultado de la búsqueda.
	 * @param {number} Código del producto
	 * @returns {Object} Producto búscado
	 */
	getProductById(productCode) {
		const productSearch = this.products.find(
			(prod) => prod.code === productCode
		);

		if (productSearch) {
			console.info('Producto encontrado!');
			return productSearch;
		} else {
			console.error(`Code ${productCode} not found`);
			return 'Intente nuevamente';
		}
	}

	/**
	 * Permite agregar productos.
	 * Primero realiza las validaciones para que todos los campos sean obligatorios
	 * y para que no se repita el atributo code.
	 * Luego genera la id mediante el método privado #getNewID,
	 * después agrega el producto al listado a través del método push
	 * y finalmente muestra el resultado al usuario y retorna el producto agregado.
	 * @param {Object} Producto para agregar
	 * @returns {Object} Producto agregado
	 */
	addProduct(newProduct) {
		const { title, description, price, thumbnail, code, stock } = newProduct;

		if (!title || !description || !price || !thumbnail || !code || !stock)
			return console.error('Todos los campos son obligatorios');

		if (this.products.some((product) => product.code === code))
			return console.error(
				`El código ${code} ya existe. Intente con otro código`
			);

		const id = this.#getNewID();

		this.products.push({
			id,
			title,
			description,
			price,
			thumbnail,
			code,
			stock,
		});

		console.info(`El producto ${title} fue agregado satisfactoriamente`);
		return this.products[id - 1];
	}
}

//Testing
const productManager = new ProductManager();
console.log(productManager.getProducts());
// Agrego dos productos
productManager.addProduct({
	title: 'prueba',
	description: 'Este es un producto prueba',
	price: 200,
	thumbnail: 'Sin imagen',
	code: 'abc123',
	stock: 25,
});
productManager.addProduct({
	title: 'prueba 2',
	description: 'Este es un producto prueba',
	price: 300,
	thumbnail: 'Sin imagen',
	code: 'abc456',
	stock: 30,
});
console.log(productManager.getProducts());
productManager.addProduct({
	title: 'prueba',
	description: 'Este es un producto prueba',
	price: 200,
	thumbnail: 'Sin imagen',
	code: 'abc123',
	stock: 25,
});
// producto con código existente
console.log(productManager.getProductById('abc123'));
// producto con código inexistente
console.log(productManager.getProductById('code123'));
// producto con campos faltantes
productManager.addProduct({
	title: 'prueba 3',
	description: 'Este es un producto prueba',
	price: 300,
	thumbnail: 'Sin imagen',
	code: 'abc789',
});
