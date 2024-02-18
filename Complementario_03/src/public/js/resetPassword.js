const resetPassToken = document.querySelector('#resetPassToken').value;
const resetPassBtn = document.querySelector('#resetPassBtn');
const resetPassError = document.querySelector('#resetPassError');
const newPassword = document.querySelector('#newPassword');
const validPassword = document.querySelector('#validPassword');

const sendResetPassForm = () => {
	if (newPassword.value !== validPassword.value) {
		resetPassError.textContent = 'Las contraseñas no coinciden.';
		return;
	}

	fetch(`/api/sessions/reset-password/${resetPassToken}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			newPassword: newPassword.value,
		}),
	})
		.then((response) => {
			if (!response.ok) {
				resetPassError.textContent =
					'Hubo un error al restablecer la contraseña.';
			}
		})
		.catch((error) => {
			console.error('Error:', error);
		});
};

resetPassBtn.addEventListener('click', sendResetPassForm);
