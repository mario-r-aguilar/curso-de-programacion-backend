let socket;

let user = sessionStorage.getItem('user') || '';

if (user) {
	document.querySelector('#username').innerHTML = user + ': ';
	initIO();
} else {
	Swal.fire({
		icon: 'info',
		title: 'Bienvenido',
		input: 'text',
		text: 'Escribe tu email',
		inputValidator: (value) => {
			return !value.trim() && 'Por favor. Escribe tu email';
		},
		allowOutsideClick: false,
	}).then((result) => {
		user = result.value;
		sessionStorage.setItem('user', user);
		document.querySelector('#username').innerHTML = user + ': ';
		initIO();
		socket.emit('newUserConnect', user);
		socket.emit('getMessages');
		socket.on('userConnected', (newUser) => {
			Swal.fire({
				text: `Se conecto ${newUser}`,
				toast: true,
				position: 'top-right',
			});
		});
	});
}

const input = document.querySelector('#chatInput');
input.addEventListener('keyup', (event) => {
	if (event.key === 'Enter') sendMessage(event.currentTarget.value);
});

document
	.querySelector('#send')
	.addEventListener('click', (event) => sendMessage(input.value));

function sendMessage(message) {
	if (message.trim().length > 0) {
		socket.emit('message', { user, message });
		input.value = '';
	}
}

function initIO() {
	socket = io();

	socket.on('messages', (messages) => {
		const chatBox = document.querySelector('#chatBox');
		let html = '';

		messages.reverse().forEach((message) => {
			html += `<p><i class="fw-bold p-1">${message.user}</i>: ${message.message}</p>`;
		});

		chatBox.innerHTML = html;
	});

	socket.emit('getMessages');
}
