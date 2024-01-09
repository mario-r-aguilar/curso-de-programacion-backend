import { Router } from 'express';
import passport from 'passport';

const sessionRouter = Router();

// Loguea al usuario con usuario y password (estrategia local)
sessionRouter.post(
	'/login',
	passport.authenticate('login', { failureRedirect: '/' }),
	async (req, res) => {
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
	}
);

// Loguea al usuario usando GitHub (1º bloque - estrategia GitHub)
sessionRouter.get(
	'/github',
	passport.authenticate('github', { scope: ['user:email'] }),
	(req, res) => {
		try {
		} catch (error) {
			res.status(500).send(`Error interno del servidor: ${error}`);
		}
	}
);

// Loguea al usuario usando GitHub (2º bloque - estrategia GitHub)
sessionRouter.get(
	'/githubcallback',
	passport.authenticate('github', { failureRedirect: '/' }),
	(req, res) => {
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
	}
);

// Crea un nuevo usuario
sessionRouter.post(
	'/register',
	passport.authenticate('register', {
		failureRedirect: 'failregister',
	}),
	async (req, res) => {
		try {
			return res.status(201).redirect('/');
		} catch (error) {
			res.status(500).send(`Error interno del servidor: ${error}`);
		}
	}
);

// Informa si hubo errores al registrarse
sessionRouter.get('/failregister', (req, res) => {
	try {
		return res.status(400).json({ error: 'Registration Failed' });
	} catch (error) {
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
});

// Devuelve el usuario actual
sessionRouter.get(
	'/current',
	passport.authenticate('current', { session: false }),
	async (req, res) => {
		try {
			const user = req.session.user;
			return res.send(user);
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

			return res.clearCookie('token').redirect('/');
		});
	} catch (error) {
		res.status(500).send(`Error interno del servidor: ${error}`);
	}
});

export { sessionRouter };
