import { Router } from 'express';
import UserManagerMongo from '../dao/SessionManager.js';
import { createHash, checkPassword } from '../utils/utils.js';
import passport from 'passport';
import dotenv from 'dotenv';
dotenv.config();

// Variable de entorno de base de datos elegida
const mongoDbActive = process.env.MONGO_DB_ACTIVE;
let userManagerMongo;
if (mongoDbActive === 'yes') {
	userManagerMongo = new UserManagerMongo();
}

// Variables de entorno del perfil del administrador
const adminName = process.env.ADMIN_NAME;
const adminLastname = process.env.ADMIN_LASTNAME;
const adminMail = process.env.ADMIN_MAIL;
const adminAge = process.env.ADMIN_AGE;
const adminPass = process.env.ADMIN_PASS;
const adminRole = process.env.ADMIN_ROLE;

const sessionRouter = Router();

// Loguea al usuario
sessionRouter.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body;

		// En caso de ingresar los datos de acceso del administrador, carga su perfil
		// Se realiza de este modo para cumplir con la consigna de testing del desafío
		if (email == adminMail && password == adminPass) {
			const user = {
				name: adminName,
				lastname: adminLastname,
				email: adminMail,
				age: adminAge,
				password: createHash(adminPass),
				role: adminRole,
			};

			// Crea la sesión del administrador
			req.session.user = user;

			return res.redirect('/products');
		}

		const user = await userManagerMongo.getUserData(email);

		if (!user) return res.status(401).send('User Not Found');
		if (!checkPassword(user, password))
			return res.status(401).send('Password Invalid');

		// Crea la sesión del usuario
		req.session.user = user;

		return res.redirect('/products');
	} catch (error) {
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
});

// Crea un nuevo usuario
sessionRouter.post(
	'/register',
	passport.authenticate('register', { failureRedirect: '/register' }),
	async (req, res) => {
		return res.status(201).redirect('/');
	}
);

// Desloguea al usuario
sessionRouter.post('/logout', (req, res) => {
	try {
		req.session.destroy((err) => {
			if (err) return res.send('Logout Error');

			return res.redirect('/');
		});
	} catch (error) {
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
});

export { sessionRouter };
