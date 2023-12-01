import { Router } from 'express';
import UserManagerMongo from '../dao/SessionManager.js';
import dotenv from 'dotenv';

dotenv.config();
const mongoDbActive = process.env.MONGO_DB_ACTIVE;
let userManagerMongo;
if (mongoDbActive === 'yes') {
	userManagerMongo = new UserManagerMongo();
}

const sessionRouter = Router();

// Loguea al usuario
sessionRouter.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await userManagerMongo.getUserData(email, password);

		if (!user) return res.status(404).send('User Not Found');

		// Crea la sesión del usuario
		req.session.user = user;
		return res.redirect('/products');
	} catch (error) {
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
});

// Crea un nuevo usuario
sessionRouter.post('/register', async (req, res) => {
	try {
		const newUser = req.body;
		await userManagerMongo.createUser(newUser);

		return res.status(201).redirect('/');
	} catch (error) {
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
});

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
