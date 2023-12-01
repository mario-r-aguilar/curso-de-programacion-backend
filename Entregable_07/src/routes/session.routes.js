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

sessionRouter.post('/login', async (req, res) => {
	const { email, password } = req.body;
	const user = await userManagerMongo.getUserData(email, password);

	if (!user) return res.status(404).send('User Not Found');

	req.session.user = user;
	return res.redirect('/products');
});

sessionRouter.post('/register', async (req, res) => {
	const newUser = req.body;
	await userManagerMongo.createUser(newUser);

	return res.redirect('/');
});

sessionRouter.post('/logout', (req, res) => {
	req.session.destroy((err) => {
		if (err) return res.send('Logout Error');

		return res.redirect('/');
	});
});

export { sessionRouter };
