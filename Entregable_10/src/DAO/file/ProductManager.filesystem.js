import fs from 'node:fs';

class ProductManagerFileSystem {
	constructor(path) {
		this.path = path;
		// Si el usuario no brinda una ruta, crea el archivo con un array vacío
		if (!this.path)
			fs.writeFileSync('./DAO/file/db/products.json', JSON.stringify([]));
	}

	/**
	 * Obtiene la lista de productos.
	 * @param {String} Cantidad de productos para mostrar
	 * @returns {Array} Listado de productos
	 */
	async getProducts(limit) {
		try {
			let productList = await fs.promises.readFile(this.path, 'utf-8');
			productList = JSON.parse(productList);
			if (limit) {
				const productsLimited = productList.slice(0, limit);
				return productsLimited;
			} else {
				return productList;
			}
		} catch (err) {
			console.error(
				`No es posible mostrar los productos.\n 
            Error: ${err}`
			);
			return;
		}
	}

	/**
	 * Busca un producto mediante su ID.
	 * @param {Number} ID del producto a buscar
	 * @returns {Object} Producto buscado
	 */
	async getProductById(productID) {
		try {
			const productList = await this.getProducts();

			const productSearch = productList.find((prod) => prod.id == productID);

			if (productSearch) {
				console.info('Producto encontrado!');
				return productSearch;
			} else {
				console.error(`ID ${productID} not found`);
				return;
			}
		} catch {
			console.error(
				`No es posible mostrar el producto. \n 
            Error: ${err}`
			);
			return;
		}
	}

	/**
	 * Permite obtener una ID que luego será usada por un nuevo producto agregado.
	 * @returns {String} Nueva ID
	 */
	#getNewID = async () => {
		try {
			const productList = await this.getProducts();
			if (productList.length === 0) return '1';
			// almacena el indice del último producto agregado
			const lastProductAdd = productList[productList.length - 1];
			// genera una ID (último índice +1) y la convierte a string
			const newID = lastProductAdd.id + 1;
			return newID.toString();
		} catch (err) {
			console.error(
				`No es posible asignar una ID.\n 
        Error: ${err}`
			);
			return;
		}
	};

	/**
	 * Agrega un nuevo producto.
	 * @param {Object} Nuevo producto a agregar
	 */
	async addProduct(newProduct) {
		try {
			const {
				title,
				description,
				code,
				price,
				status,
				stock,
				category,
				thumbnail,
			} = newProduct;

			if (
				!title ||
				!description ||
				!code ||
				!price ||
				!status ||
				!stock ||
				!category ||
				!thumbnail
			)
				return console.error(
					'Faltan campos por completar. Todos son obligatorios'
				);

			if (
				typeof title !== 'string' ||
				typeof description !== 'string' ||
				typeof code !== 'string' ||
				typeof price !== 'number' ||
				typeof status !== 'boolean' ||
				typeof stock !== 'number' ||
				typeof category !== 'string' ||
				!Array.isArray(thumbnail)
			) {
				return console.error('Campos con tipos de datos no válidos');
			}

			const productList = await this.getProducts();

			if (productList.some((product) => product.code === code))
				return console.error(
					`El código ${code} ya existe. Intente con otro código`
				);

			const id = await this.#getNewID();

			productList.push({
				id,
				title,
				description,
				code,
				price,
				status,
				stock,
				category,
				thumbnail,
			});

			await fs.promises.writeFile(this.path, JSON.stringify(productList));

			console.info(`El producto ${title} fue agregado satisfactoriamente`);

			return;
		} catch (err) {
			console.error(
				`No es posible agregar el producto. \n 
                Error: ${err}`
			);
			return;
		}
	}

	/**
	 * Elimina el producto que le indiquemos mediante su ID.
	 * @param {number} ID del producto a eliminar
	 */
	async deleteProduct(productID) {
		try {
			const productList = await this.getProducts();
			// Crea un nuevo listado sin el producto cuya id se ingreso
			const newProductList = productList.filter(
				(product) => product.id != productID
			);

			await fs.promises.writeFile(this.path, JSON.stringify(newProductList));

			console.info(`El producto con la ID ${productID} fue eliminado`);
			return;
		} catch (err) {
			console.error(
				`No es posible eliminar el producto. \n 
                Error: ${err}`
			);
			return;
		}
	}

	/**
	 * Permite actualizar los atributos de un producto.
	 * @param {number} ID del producto a actualizar
	 * @param {Object} Producto con los campos actualizados
	 */
	async updateProduct(productID, productToChanged) {
		try {
			const {
				title,
				description,
				code,
				price,
				status,
				stock,
				category,
				thumbnail,
			} = productToChanged;

			const productList = await this.getProducts();

			// Genera un nuevo listado con el producto actualizado
			const updatedProductList = productList.map((product) => {
				if (product.id === productID) {
					return {
						...product,
						title,
						description,
						code,
						price,
						status,
						stock,
						category,
						thumbnail,
					};
				} else {
					return product;
				}
			});

			await fs.promises.writeFile(
				this.path,
				JSON.stringify(updatedProductList)
			);

			console.info(`El producto con ID ${productID} fue actualizado`);
			return;
		} catch (err) {
			console.error(
				`No es posible actualizar el producto. \n 
	Error: ${err}`
			);
			return;
		}
	}
}

export default ProductManagerFileSystem;
