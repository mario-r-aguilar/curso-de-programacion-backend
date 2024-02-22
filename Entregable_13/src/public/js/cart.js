// Información necesaria obtenida desde el archivo handlebars
const cartID = document.querySelector('#getCartId').value;
const userRole = document.querySelector('#getUserRole').value;
const cartPage = document.body;

// Vista del carrito para administradores
const adminView = () => {
	if (userRole === 'ADMIN') {
		const totalCash = document.querySelector('#totalPurchase');
		totalCash.innerHTML = '';
		totalCash.classList.remove('alert', 'alert-info', 'w-50');
		const btnSection = document.querySelector('.buttonsSecction');
		btnSection.innerHTML = '';
		btnSection.innerHTML = `
		<button
		class='btn btn-dark btnBack border border-dark shadow ms-5 mb-3'
		id='btnBackToHome'
		>
			Volver al Inicio
		</button>
		`;
		const productSection = document.querySelector('.text-bg-danger');
		productSection.innerHTML = '';
		productSection.innerHTML = `
		Los administradores no pueden agregar productos al carrito
		`;
	} else {
		renderTotalPurchase();
	}
};

// Actualiza la página
const refreshCartPage = (cartID) => {
	const url = `/carts/${cartID}`;
	document.location.href = url;
};

// Muestra el detalle de la compra
const showPurchaseDetail = (data) => {
	const purchaseDetail = document.getElementById('purchaseDetail');
	purchaseDetail.innerHTML = '';
	const div = document.createElement('div');
	div.classList.add('alert', 'alert-success');
	if (data.payload.ticket === 'ticket not generated') {
		div.innerHTML = `
		<h3>Le pedimos disculpas, actualmente no disponemos stock en los productos seleccionados.</h3>		 		
		`;
	} else {
		div.innerHTML = `
		<h3>Muchas Gracias por su Compra!</h3>		
		<p><b>Total: $${data.payload.ticket.amount}</b></p>
	 	<p><b>Comprador: ${data.payload.ticket.purchaser}</b></p>
		<p><b>Fecha de compra: ${data.payload.ticket.purchase_datetime}</b></p>
		<p><b>Nº de Ticket: ${data.payload.ticket.code}</b></p>
		<h5>Se proceso la compra solo con los productos que tenían stock disponible</h5>		
		`;
	}
	purchaseDetail.appendChild(div);
};

// Calcula el precio total de los productos que se encuentran en el carrito
const calculateTotalPurchase = async () => {
	// obtiene el contenido del carrito
	return fetch(`/api/carts/${cartID}`)
		.then((response) => response.json())
		.then((cart) => {
			// realiza el cálculo
			let totalPrice = cart.products.reduce(
				(total, product) =>
					total + product.product.price * product.quantity,
				0
			);
			return totalPrice;
		})
		.catch((error) => {
			console.error(error);
		});
};

// Muestra el el precio total de los productos que se encuentran en el carrito
const renderTotalPurchase = () => {
	const totalPurchase = document.getElementById('totalPurchase');
	totalPurchase.innerHTML = '';

	// maneja el resultado de la función con then porque devuelve una promesa
	calculateTotalPurchase().then((total) => {
		const div = document.createElement('div');
		div.innerHTML = `<h3>Total del carrito: $${total}</h3>`;
		totalPurchase.appendChild(div);
	});
};

// Funcionalidad del botón volver al inicio
cartPage.addEventListener('click', (event) => {
	if (event.target.classList.contains('btnBack')) {
		const url = '/';
		document.location.href = url;
	}
});

// Funcionalidad de botones para cambiar la cantidad y para quitar el producto del carrito
const btnProductInCart = document.querySelectorAll('.btnProductInCart');
if (btnProductInCart) {
	btnProductInCart.forEach((button) => {
		button.addEventListener('click', async (event) => {
			// Obtiene el ID del producto
			const productID = event.target.getAttribute('data-product-id');
			// Asigna un valor según la clase que tenga el botón presionado
			const action = event.target.classList.contains('btnChangeProductQty')
				? 'change'
				: 'remove';

			// Obtiene la cantidad actualizada
			let productQty = document.querySelector(
				`#productQty_${productID}`
			).value;

			// Asigna el valor 1 en caso de ingresos de números negativos, cero o ningún valor
			if (productQty <= 0 || productQty === null) {
				productQty = 1;
			}

			// Realiza la petición según la accion seleccionada
			await fetch(`/api/carts/${cartID}/products/${productID}`, {
				method: action === 'change' ? 'put' : 'delete',
				body:
					action === 'change'
						? JSON.stringify({ quantity: productQty })
						: '',
				headers: {
					'Content-Type': 'application/json',
				},
			}).catch((error) => {
				console.error(error);
			});

			// Actualiza la página con cada cambio
			refreshCartPage(cartID);
		});
	});
}

// Funcionalidad para el botón de finalizar compra
const btnFinishBuy = document.querySelector('#btnFinishBuy');
if (btnFinishBuy) {
	btnFinishBuy.onclick = () => {
		// Muestra un loader hasta que se muestra la información de la operación
		const waitingPurchasingProcess = document.querySelector(
			'#waitingPurchasingProcess'
		);
		waitingPurchasingProcess.classList.remove('d-none');
		fetch(`/api/carts/${cartID}/purchase`)
			.then((response) => response.json())
			.then((data) => {
				// Muestra los detalles de la compra durante 8 segundos y actualiza la página
				showPurchaseDetail(data);
				// Desactiva el loader de espera
				waitingPurchasingProcess.classList.add('d-none');
				setTimeout(() => {
					refreshCartPage(cartID);
				}, 8000);
			})
			.catch((error) =>
				console.error(
					`It was not possible to complete the purchase. Error ${error}`
				)
			);
	};
}

const btnEmptyCart = document.querySelector('#btnEmptyCart');
if (btnEmptyCart) {
	btnEmptyCart.onclick = () => {
		fetch(`/api/carts/${cartID}`, {
			method: 'delete',
		})
			.then((res) => refreshCartPage(cartID))
			.catch((error) =>
				console.error(
					`It was not possible to empty the cart. Error ${error}`
				)
			);
	};
}

adminView();
