const socket = io();

const closeForm = () => {
	const form = document.getElementById('form');
	form.innerHTML = '';
};

const renderAddForm = () => {
	const form = document.getElementById('form');
	form.innerHTML = '';
	const newForm = document.createElement('div');
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

	const addForm = document.getElementById('addForm');
	addForm.addEventListener('submit', async function (event) {
		event.preventDefault();
		const formData = new FormData(addForm);

		const productData = {};
		formData.forEach((value, key) => {
			if (key === 'price' || key === 'stock') {
				productData[key] = Number(value);
			} else if (key === 'thumbnail') {
				productData[key] = value.split(',').map((s) => s.trim());
			} else if (key === 'status') {
				productData[key] = value === 'on' ? true : false;
			} else {
				productData[key] = value;
			}
		});

		try {
			const response = await fetch('/api/products', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(productData),
			});
			if (response.ok) {
				form.innerHTML = '';
				const responseMessage = document.createElement('div');
				responseMessage.innerHTML = `
                <div class="alert alert-success w-50" role="alert">Producto agregado</div>
                <button class='btn btn-primary border border-dark shadow me-1 mt-2' onclick='closeForm()'>Cerrar</button>
                `;
				form.appendChild(responseMessage);
				addForm.reset();
			} else {
				console.error('No fue posible agregar el producto');
			}
		} catch (error) {
			console.error({ error: error });
		}
	});
};

const renderDelForm = () => {
	const form = document.getElementById('form');
	form.innerHTML = '';
	const newForm = document.createElement('div');
	newForm.innerHTML = `
	<form id='delForm' method='post' action='/api/products/:pid'>
		<input class="form-control mb-1 w-50" type='text' required id='id' name='id' placeholder='Id del producto' />
		<button class='btn btn-primary border border-dark shadow me-1 mt-2' type='submit'>Eliminar</button>
        <button class='btn btn-primary border border-dark shadow me-1 mt-2' onclick='closeForm()'>Cerrar</button>
	</form>
    `;
	form.appendChild(newForm);

	document.getElementById('delForm');
	document.addEventListener('submit', function (event) {
		event.preventDefault();
		const idInput = document.getElementById('id');
		if (idInput !== null) {
			const productId = idInput.value;

			fetch(`/api/products/${productId}`, {
				method: 'DELETE',
			})
				.then((res) => {
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
