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
	toggleUserRole,
} from '../controllers/user.controller.js';
import handleLoginSession from '../middlewares/login.middleware.js';

const userRouter = Router();

userRouter.post('/login', handleLoginSession, loginUser);

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

userRouter.get(
	'/current',
	passport.authenticate('current', { session: false }),
	currentUser
);

userRouter.put(
	'/premium/:uid',
	passport.authenticate('current', { session: false }),
	toggleUserRole
);

userRouter.post('/logout', logoutUser);

export { userRouter };
