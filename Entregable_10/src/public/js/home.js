const cartID = document.querySelector('#getCartId').value;
const userRole = document.querySelector('#getUserRole').value;

const adminButtonOption = () => {
	if (userRole === 'ADMIN') {
		const addProductButtonAdmin = document.querySelectorAll(
			'.btnAddProductToCart'
		);

		addProductButtonAdmin.forEach((button) => {
			button.setAttribute('disabled', 'disabled');
		});
	}
};

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
					<input type="hidden" id="getProductIdDetail" value="${data._id}">
					<button class="btn btn-success shadow mb-3 d-block btnAddProductToCart">Agregar al Carrito</button>
					<p id="productAddSuccess_${data._id}"></p>
					<button class="btn btn-primary border border-dark shadow mb-3 d-block " id="btnBack">Volver</button>
				</div>
			</div>
			</div>
			`;
			html.appendChild(div);

			const addToCartButton = div.querySelector('.btnAddProductToCart');

			if (userRole === 'ADMIN') {
				adminButtonOption();
			} else {
				addToCartButton.addEventListener('click', () =>
					addProductToCart(id)
				);
			}

			// Manejo del botón para volver a la página de inicio desde la página de detalles de un producto
			document.querySelector('#btnBack').onclick = () => resetPage();
		});
};

// Manejo del botón para agregar productos al carrito
const addProductToCart = async (id) => {
	fetch(`/api/carts/${cartID}/products/${id}`, { method: 'post' })
		.then((res) => {
			if (res.ok) {
				const productAddMessage = document.getElementById(
					`productAddSuccess_${id}`
				);
				productAddMessage.innerHTML = '';
				const div = document.createElement('div');
				div.classList.add('alert', 'alert-success');
				div.innerHTML = `
					<p>Producto agregado</p>
				`;
				productAddMessage.appendChild(div);

				setTimeout(() => {
					productAddMessage.innerHTML = '';
				}, 1500);
			}
		})
		.catch((error) => {
			console.error(error);
		});
};

// Manejo de los botones para el desplazamiento entre páginas
const btnPrev = document.querySelector('#btnPrev');
const btnNext = document.querySelector('#btnNext');
if (btnPrev && btnNext) {
	btnPrev.onclick = () => navigateToPage('prevPage');
	btnNext.onclick = () => navigateToPage('nextPage');
}

// Manejo del botón de filtros
const btnFilters = document.querySelector('#btnApplyFilters');
if (btnFilters) {
	btnFilters.onclick = () => {
		const totalPages = document.querySelector('#pageErrorAux').value;
		const pageInput = document.querySelector('#page').value;

		if (
			parseInt(pageInput) > parseInt(totalPages) ||
			parseInt(pageInput) < 1
		) {
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
}

// Manejo del botón para refrescar la página
const btnRefresh = document.querySelector('#btnCleanFilters');
if (btnRefresh) {
	btnRefresh.onclick = () => resetPage();
}

// Manejo del botón para ver los detalles de un producto
const btnCards = document.querySelectorAll(
	'.btnProductDetail, .btnAddProductToCart'
);

if (btnCards) {
	btnCards.forEach((button) => {
		// Escucha los eventos clic de los botones de detalle de las card
		button.addEventListener('click', (event) => {
			const closestCard = event.target.closest('.card');
			const productIdHome = closestCard.querySelector('#getProductId');
			const productIdDetails = closestCard.querySelector(
				'#getProductIdDetail'
			);

			const id = productIdHome
				? productIdHome.value
				: productIdDetails.value;

			if (button.classList.contains('btnProductDetail')) {
				renderOneProduct(id);
			} else if (button.classList.contains('btnAddProductToCart')) {
				addProductToCart(id);
			}
		});
	});
}

// Para limitar la cantidad de productos por pantalla
const limitProducts = () => {
	let limit = document.querySelector('#limitProducts').value;
	const url = `/products?limit=${limit}`;
	document.location.href = url;
};
const btnLimitProducts = document.getElementById('btnLimitProducts');
if (btnLimitProducts) {
	btnLimitProducts.addEventListener('click', limitProducts);
}

// Para buscar en la página con window.find
const searchOnPage = () => {
	let searchTerm = document.getElementById('searchInput').value.toLowerCase();
	let searchResult = window.find(
		searchTerm, // término de búsqueda
		false, // sensibilidad a mayúsculas y minúsculas
		false, // dirección hacia adelante
		true, // resaltar
		false, // retroceder
		false, // coincidencia exacta
		false //buscar en enlaces
	);

	if (!searchResult) {
		alert('No se encontraron coincidencias.');
	}
};

const btnSearchOnPage = document.getElementById('btnSearchOnPage');
if (btnSearchOnPage) {
	btnSearchOnPage.addEventListener('click', searchOnPage);
}

adminButtonOption();
