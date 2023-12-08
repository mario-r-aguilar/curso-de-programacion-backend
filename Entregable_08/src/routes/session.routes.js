import { Router } from 'express';
import passport from 'passport';

const sessionRouter = Router();

// Loguea al usuario
sessionRouter.post(
	'/login',
	passport.authenticate('login', { failureRedirect: '/' }),
	async (req, res) => {
		try {
			if (!req.user) return res.status(401).send('Invalid Credentials');

			req.session.user = req.user;
			return res.redirect('/products');
		} catch (error) {
			res.status(500).send(`Error interno del servidor: ${error}`);
		}
	}
);

// Crea un nuevo usuario
sessionRouter.post(
	'/register',
	passport.authenticate('register', { failureRedirect: '/register' }),
	async (req, res) => {
		try {
			return res.status(201).redirect('/');
		} catch (error) {
			res.status(500).send(`Error interno del servidor: ${error}`);
		}
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
