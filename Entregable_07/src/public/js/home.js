// Función para la navegación por las páginas y uso de filtros
function navigateToPage(pageValue) {
	const page = document.querySelector('#' + pageValue).value;
	const limit = document.querySelector('#limit').value;
	const title = document.querySelector('#productName').value;
	const category = document.querySelector('#category').value;
	const sort = document.querySelector('#sort').value;
	const status = document.querySelector('#status').checked ? true : false;

	const url = `/products?page=${page}&limit=${limit}&title=${title}&category=${category}&sort=${sort}&status=${status}`;

	document.location.href = url;
}

// Función para volver a la página de inicio
function resetPage() {
	const url = '/products';
	document.location.href = url;
}

// Manejo de los botones para el desplazamiento entre páginas
document.querySelector('#btnPrev').onclick = () => navigateToPage('prevPage');
document.querySelector('#btnNext').onclick = () => navigateToPage('nextPage');

// Manejo del botón de filtros
document.querySelector('#btnApplyFilters').onclick = () => {
	const totalPages = document.querySelector('#pageErrorAux').value;
	const pageInput = document.querySelector('#page').value;

	if (parseInt(pageInput) > parseInt(totalPages) || parseInt(pageInput) < 1) {
		const messageError = document.getElementById('pageError');
		messageError.innerHTML = '';
		const div = document.createElement('div');
		div.innerHTML = `
			<p class='text-bg-danger ms-5 mt-3 p-1 text-start w-75'>La página no existe</p>
		`;
		messageError.append(div);
	} else {
		navigateToPage('page');
	}
};

// Manejo del botón para volver a la página de inicio
document.querySelector('#btnCleanFilters').onclick = () => resetPage();

// Renderización de la página para ver los detalles de un producto
const renderOneProduct = (id) => {
	// Realiza un GET con la id del producto al endpoint correspondiente para obtenerlo
	fetch(`/api/products/${id}`, {
		method: 'get',
	})
		// Convierte la respuesta a JSON
		.then((res) => res.json())
		// Renderiza el producto
		.then((data) => {
			const html = document.getElementById('pageComplete');
			html.innerHTML = '';
			const div = document.createElement('div');
			div.innerHTML = `
			<div class='d-flex me-4  mb-3 flex-row justify-content-between flex-wrap'>
				<h1 class="ps-4 ms-5 mt-3">Detalles del Producto</h1>

				<a class='nav-link' style="width: 3%; height: 3%" href="/carts/6557f7d19005197b1b189ce1">
					<img class="img-fluid mt-3" style="width: 100%; height: 100%" id="cartImg" src="/static/img/cart_img.svg" alt="cart_img">
				</a>			
			</div>

			
			<div class='d-flex me-4  mb-3 flex-row justify-content-evenly flex-wrap>
			<div
			class='card p-3 mb-3 shadow-lg'
			id='cardProduct' 
			style='width: 75%; height: 75%'
			>
				<img
					src='${data.thumbnail}'
					class='card-img-top'
					alt='${data.title}'
				/>
				<div class='card-body'>
					<h5 class='card-title mb-3 ps-1 pb-1 text-light bg-dark'>
						<b class='card-title'>${data.title}</b>
					</h5>
					<span class='card-text'>Descripción: </span>
					<p class='card-text'>
						<b>${data.description}</b>
					</p>
					<span class='card-text'>Código: </span>
					<p class='card-text'>
						<b>${data.code}</b>
					</p>
					<span class='card-text'>Precio: </span>
					<p class='card-text'>
						<b>$ ${data.price}</b>
					</p>
					<span class='card-text'>Stock: </span>
					<p class='card-text'>
						<b>${data.stock}</b>
					</p>
					<span class='card-text'>Categoría: </span>
					<p class='card-text'>
						<b>${data.category}</b>
					</p>
					<span class='card-text'>ID: </span>
					<p class='card-text'>
						<b>${data.id || data._id}</b>
					</p>
					<button class="btn btn-success shadow mb-3 d-block btnAddProductToCart">Agregar al Carrito</button>
					<button class="btn btn-primary border border-dark shadow mb-3 d-block " id="btnBack">Volver</button>
				</div>
			</div>
			</div>
			`;
			html.appendChild(div);

			// Manejo del botón para volver a la página de inicio desde la página de detalles de un producto
			document.querySelector('#btnBack').onclick = () => resetPage();
		});
};

// Manejo del botón para ver los detalles de un producto
document.querySelectorAll('.btnProductDetail').forEach((button) => {
	// Escucha los eventos clic de los botones de detalle de las card
	button.addEventListener('click', (event) => {
		// Guarda la id de la card donde se presiono el botón
		const id = event.target
			.closest('.card')
			.querySelector('#getProductId').value;
		// Ejecuta la función para renderizar el producto elegido
		renderOneProduct(id);
	});
});
