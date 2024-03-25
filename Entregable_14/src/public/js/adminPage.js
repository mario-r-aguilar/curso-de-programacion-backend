const getIdBtn = document.querySelector('#getIdBtn');
const toggleRoleBtn = document.querySelector('#toggleRoleBtn');

const getIdFn = () => {
	const userEmail = document.querySelector('#userEmail').value;
	const getIdMessage = document.querySelector('#getIdMessage');

	fetch(`/api/sessions/${userEmail}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((res) => res.json())
		.then((user) => {
			if (!user._id) {
				getIdMessage.innerHTML = '';
				getIdMessage.classList.remove('d-none');
				getIdMessage.classList.add('alert-danger');
				getIdMessage.textContent =
					'Error al intentar obtener la Id del usuario.';
			} else {
				getIdMessage.innerHTML = '';
				getIdMessage.classList.remove('d-none');
				getIdMessage.classList.add('alert-success');
				getIdMessage.textContent = `La Id del usuario es: ${user._id}`;
			}
		})
		.catch((error) => {
			console.error('Error:', error);
		});
};

getIdBtn.addEventListener('click', getIdFn);

const toggleUserRoleFn = () => {
	const userId = document.querySelector('#userId').value;
	const toggleRoleMessage = document.querySelector('#toggleRoleMessage');

	fetch(`/api/sessions/premium/${userId}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((response) => {
			if (!response.ok) {
				toggleRoleMessage.innerHTML = '';
				toggleRoleMessage.classList.remove('d-none');
				toggleRoleMessage.classList.add('alert-danger');
				toggleRoleMessage.textContent = 'Error al intentar cambiar el rol.';
			} else {
				toggleRoleMessage.innerHTML = '';
				toggleRoleMessage.classList.remove('d-none', 'alert-danger');
				toggleRoleMessage.classList.add('alert-success');
				toggleRoleMessage.textContent =
					'El rol del usuario se ha cambiado.';
			}
		})
		.catch((error) => {
			console.error('Error:', error);
		});
};

toggleRoleBtn.addEventListener('click', toggleUserRoleFn);
