const cartID = document.querySelector('#getCartId').value;

// Actualizar la página
const refreshCartPage = (cartID) => {
	const url = `/carts/${cartID}`;
	document.location.href = url;
};

// Mostrar detalle de la compra
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
		<h5>Se proceso la compra solo con los productos que tenían stock</h5>		
		`;
	}
	purchaseDetail.appendChild(div);
};

// Calcular el total de la compra
const calculateTotalPurchase = async () => {
	return fetch(`/api/carts/${cartID}`)
		.then((response) => response.json())
		.then((cart) => {
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

const renderTotalPurchase = () => {
	const totalPurchase = document.getElementById('totalPurchase');
	totalPurchase.innerHTML = '';

	calculateTotalPurchase().then((total) => {
		const div = document.createElement('div');
		div.innerHTML = `<h3>Total de la compra: $${total}</h3>`;
		totalPurchase.appendChild(div);
	});
};

// Manejo de botones de las cards (Cambiar cantidad / Quitar producto del carrito)
document.querySelectorAll('.btnProductInCart').forEach((button) => {
	button.addEventListener('click', async (event) => {
		const productID = event.target.getAttribute('data-product-id');
		const action = event.target.classList.contains('btnChangeProductQty')
			? 'change'
			: 'remove';

		// Obtener la cantidad actualizada
		let productQty = document.querySelector(`#productQty_${productID}`).value;

		if (productQty <= 0 || productQty === null) {
			productQty = 1;
		}

		await fetch(`/api/carts/${cartID}/products/${productID}`, {
			method: action === 'change' ? 'put' : 'delete',
			body:
				action === 'change' ? JSON.stringify({ quantity: productQty }) : '',
			headers: {
				'Content-Type': 'application/json',
			},
		}).catch((error) => {
			console.error(error);
		});

		refreshCartPage(cartID);
	});
});

document.querySelector('#btnBackToBuy').onclick = () => {
	const url = '/';
	document.location.href = url;
};

// Funcionalidad del botón de finalizar compra
document.querySelector('#btnFinishBuy').onclick = () => {
	fetch(`/api/carts/${cartID}/purchase`)
		.then((response) => response.json())
		.then((data) => {
			showPurchaseDetail(data);
			setTimeout(() => {
				refreshCartPage(cartID);
			}, 9000);
		})
		.catch((error) =>
			console.error(
				`It was not possible to complete the purchase. Error ${error}`
			)
		);
};

renderTotalPurchase();
