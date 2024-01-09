import { Router } from 'express';
import passport from 'passport';
import {
	loginUser,
	loginGithub,
	loginGithubCallBack,
	registerUser,
	failRegister,
	currentUser,
	logoutUser,
} from '../controllers/session.controller.js';

const userRouter = Router();

// Loguea al usuario con usuario y password (estrategia local)
userRouter.post(
	'/login',
	passport.authenticate('login', { failureRedirect: '/' }),
	loginUser
);

// Loguea al usuario usando GitHub (1º bloque - estrategia GitHub)
userRouter.get(
	'/github',
	passport.authenticate('github', { scope: ['user:email'] }),
	loginGithub
);

// Loguea al usuario usando GitHub (2º bloque - estrategia GitHub)
userRouter.get(
	'/githubcallback',
	passport.authenticate('github', { failureRedirect: '/' }),
	loginGithubCallBack
);

// Crea un nuevo usuario
userRouter.post(
	'/register',
	passport.authenticate('register', {
		failureRedirect: 'failregister',
	}),
	registerUser
);

// Informa si hubo errores al registrarse
userRouter.get('/failregister', failRegister);

// Devuelve el usuario actual
userRouter.get(
	'/current',
	passport.authenticate('current', { session: false }),
	currentUser
);

// Desloguea al usuario
userRouter.post('/logout', logoutUser);

export { userRouter };
