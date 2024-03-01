const userId = document.querySelector('#userId').value;
const toggleRoleBtn = document.querySelector('#toggleRoleBtn');
const toggleRoleError = document.querySelector('#toggleRoleError');

const toggleUserRoleFn = () => {
	fetch(`/api/sessions/premium/${userId}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((response) => {
			if (!response.ok) {
				toggleRoleError.innerHTML = '';
				toggleRoleError.classList.remove('d-none');
				toggleRoleError.textContent =
					'No se pudo cambiar el rol. Verifique el ID del usuario.';
			}

			if (response.ok) {
				toggleRoleError.innerHTML = '';
				toggleRoleError.classList.remove('d-none', 'alert-danger');
				toggleRoleError.classList.add('alert-success');
				toggleRoleError.textContent = 'El rol del usuario se ha cambiado.';
			}
		})
		.catch((error) => {
			console.error('Error:', error);
		});
};

toggleRoleBtn.addEventListener('click', toggleUserRoleFn);
