import fs from 'fs';

class ProductManagerFileSystem {
	constructor(path) {
		this.path = path;
		// Si el usuario no brinda una ruta, crea el archivo con un array vacío
		if (!this.path)
			fs.writeFileSync('./dao/db/products.json', JSON.stringify([]));
	}

	/**
	 * Obtiene la lista de productos.
	 * Lee el contenido del archivo donde se encuentra el listado y lo retorna.
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
	 * Para ello trae el listado de productos con el método getProducts(),
	 * luego busca en el listado con el método find el producto solicitado.
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
	 * Para ello obtiene el listado de productos, almacena en una constante el
	 * indice del último agregado, incrementa en 1 su valor y luego
	 * lo convierte a String.
	 * @returns {String} Nueva ID
	 */
	#getNewID = async () => {
		try {
			const productList = await this.getProducts();
			if (productList.length === 0) return '1';
			const lastProductAdd = productList[productList.length - 1];
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
	 * Primero realiza las validaciones para que todos los campos sean
	 * obligatorios, después trae el listado de productos y valida que no
	 * se repita el atributo code. Genera la id mediante #getNewID(),
	 * pushea el nuevo producto al listado y actualiza el archivo.
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
	 * Para ello obtiene el listado de productos, genera una nueva lista
	 * sin el producto a eliminar (con el método filter) y finalmente
	 * sobreescribe el archivo con la nueva lista.
	 * @param {number} ID del producto a eliminar
	 */
	async deleteProduct(productID) {
		try {
			const productList = await this.getProducts();
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
	 * Permite actualizar las características (atributos) de un producto.
	 * Primero desestructura el objeto para facilitar el acceso a sus propiedades.
	 * Luego obtiene el listado de productos, recorre este listado con el método
	 * map para generar un nuevo listado con el producto actualizado.
	 * Si encuentra el producto lo retorna con los campos modificados y si no,
	 * retorna el mismo producto sin modificaciones. Finalmente sobreescribe el
	 * archivo con la nueva lista.
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
