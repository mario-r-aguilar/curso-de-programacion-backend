import passport from 'passport';
import local from 'passport-local';
import UserManagerMongo from '../dao/SessionManager.js';
import { createHash, checkPassword } from '../utils/utils.js';
import dotenv from 'dotenv';

dotenv.config();
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

const LocalStrategy = local.Strategy;

const initializePassport = () => {
	passport.use(
		'register',
		new LocalStrategy(
			{
				passReqToCallback: true, // Permitimos el acceso al objeto req como un middleware
				usernameField: 'email', // Definimos a email como username
			},
			async (req, username, password, done) => {
				try {
					const validUser = await userManagerMongo.getUserData(username);
					if (validUser) {
						console.info('User already exists');
						return done(null, false);
					}

					if (username === adminMail) {
						console.error('Invalid email. Use another email address');
						return done(null, false);
					}

					const newUser = req.body;
					newUser.password = createHash(password);

					await userManagerMongo.createUser(newUser);
					return done(null, newUser);
				} catch (error) {
					done(`Error interno del servidor: ${error}`);
				}
			}
		)
	);

	passport.serializeUser((user, done) => {
		done(null, user._id);
	});

	passport.deserializeUser(async (id, done) => {
		const user = await userManagerMongo.getUserById(id);
		done(null, user);
	});
};

export default initializePassport;
