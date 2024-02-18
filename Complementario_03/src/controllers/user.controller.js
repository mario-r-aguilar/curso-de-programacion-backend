import UserDTO from '../DTO/user.dto.js';
import { UserService } from '../services/index.js';

// Estrategia local (logueo de usuario)
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
		req.logger.fatal('User could not log in');
		res.status(500).send(`Internal Server Error: ${error}`);
	}
};

// Estrategia GitHub (logueo de usuario)
export const loginGithub = (req, res) => {
	try {
	} catch (error) {
		req.logger.fatal('The user could not log in using their GitHub account');
		res.status(500).send(`Internal Server Error: ${error}`);
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
		req.logger.fatal(
			'The user could not log in using their GitHub account (callback endpoint)'
		);
		res.status(500).send(`Internal Server Error: ${error}`);
	}
};

// Estrategia local (registro de usuario)
export const registerUser = async (req, res) => {
	try {
		return res.status(201).redirect('/');
	} catch (error) {
		req.logger.fatal('Failed to register user');
		res.status(500).send(`Internal Server Error: ${error}`);
	}
};

// Para informar errores en el registro de un usuario
export const failRegister = (req, res) => {
	try {
		return res.status(400).json({ error: 'Registration Failed' });
	} catch (error) {
		req.logger.fatal('Failed to display failRegister endpoint');
		res.status(500).send(`Internal Server Error: ${error}`);
	}
};

// Muestra los datos del usuario logueado
export const currentUser = async (req, res) => {
	try {
		const userData = req.session.user;
		const user = new UserDTO(userData);
		return res.send(user);
	} catch (error) {
		req.logger.fatal('Could not display data for current user');
		res.status(500).send(`Internal Server Error: ${error}`);
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
		req.logger.fatal('User could not be logged out');
		res.status(500).send(`Internal Server Error: ${error}`);
	}
};

// Cambia el rol de un usuario
export const toggleUserRole = async (req, res) => {
	try {
		const { uid } = req.params;
		const userData = UserService.addUser(uid);
		const user = new UserDTO(userData);

		await UserService.toggleUserRole(user);

		res.status(200).send(`The user's role was successfully modified`);
	} catch (error) {
		req.logger.fatal(`It is not possible to change the user's role`);
		res.status(500).send(`Internal Server Error: ${error}`);
	}
};
