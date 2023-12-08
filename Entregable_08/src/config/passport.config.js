import passport from 'passport';
import local from 'passport-local';
import GitHubStrategy from 'passport-github2';
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

// Variables para estrategia GitHub
const gitHubClientId = process.env.CLIEN_ID;
const gitHubClientSecret = process.env.CLIENT_SECRET;
const gitHubCallbackUrl = process.env.CALLBACK_URL;

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

					const result = await userManagerMongo.createUser(newUser);
					return done(null, result);
				} catch (error) {
					done(`Error interno del servidor: ${error}`);
				}
			}
		)
	);

	passport.use(
		'login',
		new LocalStrategy(
			// Definimos a email como username
			{ usernameField: 'email' },
			async (username, password, done) => {
				try {
					if (username == adminMail && password == adminPass) {
						const user = {
							name: adminName,
							lastname: adminLastname,
							email: adminMail,
							age: adminAge,
							password: createHash(adminPass),
							role: adminRole,
						};
						return done(null, user);
					}

					const user = await userManagerMongo.getUserData(username);

					if (!user) {
						console.error('User does not exist');
						return done(null, false);
					}

					if (!checkPassword(user, password)) {
						console.error('Password is invalid');
						return done(null, false);
					}

					return done(null, user);
				} catch (error) {
					return done(`Error interno del servidor: ${error}`);
				}
			}
		)
	);

	passport.use(
		'github',
		new GitHubStrategy(
			{
				clientID: gitHubClientId,
				clientSecret: gitHubClientSecret,
				callbackURL: gitHubCallbackUrl,
			},
			async (accessToken, refreshToken, profile, done) => {
				try {
					const user = await userManagerMongo.getUserData(
						profile._json.email
					);

					if (user) {
						console.info('El usuario ya se encuentra registrado');
						return done(null, user);
					}

					const newUser = await userManagerMongo.createUser({
						name: profile._json.name,
						lastname: '',
						email: profile._json.email,
						age: 18,
						password: '',
						role: 'user',
					});

					return done(null, newUser);
				} catch (error) {
					console.error(error);
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
