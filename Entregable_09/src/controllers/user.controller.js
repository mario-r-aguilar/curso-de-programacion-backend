// Estrategia local
export const loginUser = async (req, res) => {
	try {
		if (!req.user) return res.status(401).send('Invalid Credentials');

		req.session.user = req.user;
		return res
			.cookie('token', req.user.token, {
				httpOnly: true,
				maxAge: 86400000,
			})
			.redirect('/products');
	} catch (error) {
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
};

// Estrategia GitHub
export const loginGithub = (req, res) => {
	try {
	} catch (error) {
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
};

export const loginGithubCallBack = (req, res) => {
	try {
		req.session.user = req.user;
		return res
			.cookie('token', req.user.token, {
				httpOnly: true,
				maxAge: 86400000,
			})
			.redirect('/products');
	} catch (error) {
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
};

// Para registrar un nuevo usuario
export const registerUser = async (req, res) => {
	try {
		return res.status(201).redirect('/');
	} catch (error) {
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
};

// Se muestra si hubo errores en el registro de un usuario
export const failRegister = (req, res) => {
	try {
		return res.status(400).json({ error: 'Registration Failed' });
	} catch (error) {
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
};

// Muestra los datos del usuario logueado
export const currentUser = async (req, res) => {
	try {
		const user = req.session.user;
		return res.send(user);
	} catch (error) {
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
};

// Desloguea a un usuario
export const logoutUser = (req, res) => {
	try {
		req.session.destroy((err) => {
			if (err) return res.send('Logout Error');

			return res.clearCookie('token').redirect('/');
		});
	} catch (error) {
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
};
