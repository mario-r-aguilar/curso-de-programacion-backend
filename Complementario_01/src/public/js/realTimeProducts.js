// Instanciamos socket.io del lado cliente
const socket = io();

// Recibe la lista de productos y la renderiza con la función renderProducts()
socket.on('productList', (data) => {
	renderProducts(data);
});

const renderProducts = async (data) => {
	// Selecciona la sección de la plantilla para renderizar
	const productsList = document.getElementById('productsList');
	productsList.innerHTML = '';
	// Si el array de productos llega vacío muestra un mensaje
	if (data.length === 0) {
		const elementHtml = document.createElement('div');
		elementHtml.innerHTML = `<h4 class='text-bg-danger p-3 text-start'>No es posible mostrar los productos</h4>`;
		productsList.appendChild(elementHtml);
	} else {
		// Si contiene los productos, recorre el array y los renderiza
		data.forEach((element) => {
			const elementHtml = document.createElement('div');
			elementHtml.innerHTML = `
			<div
			class='card p-3 mb-3 shadow-lg'
			id='cardProduct' 
			style='width: 18rem; height: 52rem'
		>
			<img
				src='${element.thumbnail}'
				class='card-img-top'
				alt='${element.title}'
			/>
			<div class='card-body'>
				<h5 class='card-title mb-3 ps-1 pb-1 text-light bg-dark'>
					<b class='card-title'>${element.title}</b>
				</h5>
				<span class='card-text'>Descripción: </span>
				<p class='card-text'>
					<b>${element.description}</b>
				</p>
				<span class='card-text'>Código: </span>
				<p class='card-text'>
					<b>${element.code}</b>
				</p>
				<span class='card-text'>Precio: </span>
				<p class='card-text'>
					<b>$ ${element.price}</b>
				</p>
				<span class='card-text'>Stock: </span>
				<p class='card-text'>
					<b>${element.stock}</b>
				</p>
				<span class='card-text'>Categoría: </span>
				<p class='card-text'>
					<b>${element.category}</b>
				</p>
				<span class='card-text'>ID: </span>
				<p class='card-text'>
					<b>${element.id || element._id}</b>
				</p>
			</div>
		</div>
	`;
			productsList.appendChild(elementHtml);
		});
	}
};

const closeForm = () => {
	// Cierra (borra) el formulario mediante el uso del DOM
	const form = document.getElementById('form');
	form.innerHTML = '';
};

const renderAddForm = () => {
	// Selecciona la sección de la plantilla para renderizar
	const form = document.getElementById('form');
	form.innerHTML = '';
	const newForm = document.createElement('div');
	// Renderiza el formulario para agregar productos
	newForm.innerHTML = `
    <form id='addForm' method='post' action='/api/products' target="_blank">
		<input class="form-control mb-1 w-50" type='text' required id='title' name='title' placeholder='Nombre' />
		<input class="form-control mb-1 w-50" type='text' required id='description' name='description' placeholder='Descripción' />
		<input class="form-control mb-1 w-50" type='text' required id='code' name='code' placeholder='Código' />
		<input class="form-control mb-1 w-50" type='number' required id='price' name='price' placeholder='Precio' />		
        <input class="form-check-input mb-1" type='checkbox' id='status' name='status' checked readonly />
        <label class="form-check-label mb-1 w-50" for="status">Status</label>
		<input class="form-control mb-1 w-50" type='number' required id='stock' name='stock' placeholder='Stock' />
		<input class="form-control mb-1 w-50" type='text' required id='category' name='category' placeholder='Categoría' />
        <input class="form-control mb-1 w-50" type='text' id='thumbnail' name='thumbnail' placeholder='Ubicación de la imagen' />        	
		<button class='btn btn-primary border border-dark shadow me-1 mt-2' type='submit'>Agregar</button>
        <button class='btn btn-primary border border-dark shadow me-1 mt-2' onclick='closeForm()'>Cerrar</button>
	</form>
    `;
	form.appendChild(newForm);

	// Selecciona el formulario recientemente creado
	const addForm = document.getElementById('addForm');
	// Escucha el evento submit al presionar el botón agregar
	addForm.addEventListener('submit', async function (event) {
		// Evita el funcionamiento habitual del evento
		event.preventDefault();
		// Captura el contenido de nuestro formulario
		const formData = new FormData(addForm);

		// Crea el objeto que contendrá la información del formulario
		const productData = {};

		//Recorre formData y guarda key y valor en productData
		formData.forEach((value, key) => {
			// Convierte el valor ingresado de string a número
			if (key === 'price' || key === 'stock') {
				productData[key] = Number(value);
			}
			// Convierte el valor ingresado de string a array
			else if (key === 'thumbnail') {
				productData[key] = value.split(',').map((s) => s.trim());
			}
			// Convierte el valor ingresado de string a booleano
			else if (key === 'status') {
				productData[key] = value === 'on' ? true : false;
			} else {
				productData[key] = value;
			}
		});

		try {
			// Envía el objeto productData usando fetch y guarda la respuesta
			const response = await fetch('/api/products', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(productData),
			});
			// Si la respuesta fue satisfactoria renderiza un mensaje informándolo
			if (response.ok) {
				form.innerHTML = '';
				const responseMessage = document.createElement('div');
				responseMessage.innerHTML = `
                <div class="alert alert-success w-50" role="alert">Producto agregado</div>
                <button class='btn btn-primary border border-dark shadow me-1 mt-2' onclick='closeForm()'>Cerrar</button>
                `;
				form.appendChild(responseMessage);
				addForm.reset();
				// Envía por socket.io el aviso de actualización de la lista de productos
				socket.emit('updatedList', 'Se actualizo la lista de productos');
			} else {
				console.error('No fue posible agregar el producto');
			}
		} catch (error) {
			console.error({ error: error });
		}
	});
};

const renderDelForm = () => {
	// Selecciona la sección de la plantilla para renderizar
	const form = document.getElementById('form');
	form.innerHTML = '';
	const newForm = document.createElement('div');
	// Renderiza el formulario para eliminar productos
	newForm.innerHTML = `
	<form id='delForm' method='post' action='/api/products/:pid'>
		<input class="form-control mb-1 w-50" type='text' required id='id' name='id' placeholder='Id del producto' />
		<button class='btn btn-primary border border-dark shadow me-1 mt-2' type='submit'>Eliminar</button>
        <button class='btn btn-primary border border-dark shadow me-1 mt-2' onclick='closeForm()'>Cerrar</button>
	</form>
    `;
	form.appendChild(newForm);

	// Selecciona el formulario recientemente creado
	document.getElementById('delForm');
	// Escucha el evento submit al presionar el botón eliminar
	document.addEventListener('submit', function (event) {
		// Evita el funcionamiento habitual del evento
		event.preventDefault();
		// Selecciona la sección id del formulario
		const idInput = document.getElementById('id');
		if (idInput !== null) {
			// Si existe, guarda el valor de id
			const productId = idInput.value;

			// Elimina el producto indicado según su id
			fetch(`/api/products/${productId}`, {
				method: 'DELETE',
			})
				.then((res) => {
					// Si la promesa se resolvio renderiza un mensaje informándolo
					if (res.ok) {
						const form = document.getElementById('form');
						form.innerHTML = '';
						const response = document.createElement('div');
						response.innerHTML = `
                        <div class="alert alert-danger w-50" role="alert">Producto eliminado</div>
                        <button class='btn btn-primary border border-dark shadow me-1 mt-2' onclick='closeForm()'>Cerrar</button>
                        `;
						form.appendChild(response);
						const delForm = document.getElementById('delForm');
						if (delForm !== null) delForm.reset();
						// Envía por socket.io el aviso de actualización de la lista de productos
						socket.emit(
							'updatedList',
							'Se actualizo la lista de productos'
						);
					} else {
						console.error('No fue posible eliminar el producto');
					}
				})
				.catch((err) => {
					console.error({ error: err });
				});
		}
	});
};
