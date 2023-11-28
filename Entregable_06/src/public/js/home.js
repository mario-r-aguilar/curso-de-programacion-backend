function navigateToPage(pageValue) {
	const page = document.querySelector('#' + pageValue).value;
	const limit = document.querySelector('#limit').value;
	const title = document.querySelector('#productName').value;
	const category = document.querySelector('#category').value;
	const sort = document.querySelector('#sort').value;
	const status = document.querySelector('#status').checked ? true : false;
	const url = `/?page=${page}&limit=${limit}&title=${title}&category=${category}&sort=${sort}&status=${status}`;
	document.location.href = url;
}

function resetPage() {
	const url = '/';
	document.location.href = url;
}

document.querySelector('#btnPrev').onclick = () => navigateToPage('prevPage');
document.querySelector('#btnNext').onclick = () => navigateToPage('nextPage');

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
		console.log('nooooo');
		navigateToPage('page');
	}
};

document.querySelector('#btnCleanFilters').onclick = () => resetPage();

const renderOneProduct = (id) => {
	fetch(`/api/products/${id}`, {
		method: 'get',
	})
		.then((res) => res.json())
		.then((data) => {
			console.log(data);
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
					<button class="btn btn-success shadow mb-3 d-block" id="addProductToCartDetail">Agregar al Carrito</button>
					<button class="btn btn-primary border border-dark shadow mb-3 d-block " id="btnBack">Volver</button>
				</div>
			</div>
			</div>
			`;
			html.appendChild(div);
			document.querySelector('#btnBack').onclick = () => resetPage();
		});
};

document.querySelectorAll('.productDetail').forEach((button) => {
	button.addEventListener('click', (event) => {
		const id = event.target
			.closest('.card')
			.querySelector('#getProductId').value;
		renderOneProduct(id);
	});
});
