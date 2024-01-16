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
} from '../controllers/user.controller.js';

const userRouter = Router();

userRouter.post(
	'/login',
	passport.authenticate('login', { failureRedirect: '/' }),
	loginUser
);

userRouter.get(
	'/github',
	passport.authenticate('github', { scope: ['user:email'] }),
	loginGithub
);
userRouter.get(
	'/githubcallback',
	passport.authenticate('github', { failureRedirect: '/' }),
	loginGithubCallBack
);

userRouter.post(
	'/register',
	passport.authenticate('register', {
		failureRedirect: 'failregister',
	}),
	registerUser
);

userRouter.get('/failregister', failRegister);

// Valida la existencia del token con la estrategia current, antes de dar acceso a la ruta
userRouter.get(
	'/current',
	passport.authenticate('current', { session: false }),
	currentUser
);

userRouter.post('/logout', logoutUser);

export { userRouter };
