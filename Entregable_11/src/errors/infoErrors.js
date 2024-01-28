export const productCreationErrorInfo = (product) => {
	return `
        Una o más propiedades del producto están incompletas o contiene datos inválidos:

		CONTENIDO INGRESADO
        title: ---> ${product.title}
	    description: ---> ${product.description}
	    code:---> ${product.code}
	    price: ---> ${product.price}
	    status: ---> ${product.status}
	    stock: ---> ${product.stock}
	    category: ---> ${product.category}
	    thumbnail: ---> ${product.thumbnail} 

		TIPO DE DATO INGRESADO
		title (string): ---> ${typeof product.title}
	    description (string): ---> ${typeof product.description}
	    code (string): ---> ${typeof product.code}
	    price (number): ---> ${typeof product.price}
	    status (boolean): ---> ${typeof product.status}
	    stock (number): ---> ${typeof product.stock}
	    category (string): ---> ${typeof product.category}
	    thumbnail(array de strings): ---> ${typeof product.thumbnail}
        `;
};
