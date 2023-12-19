import passport from 'passport';
import local from 'passport-local';
import GitHubStrategy from 'passport-github2';
import UserManagerMongo from '../dao/SessionManager.js';
import CartManagerMongo from '../dao/CartManager.mongo.js';
import { createHash, checkPassword } from '../utils/utils.js';
import dotenv from 'dotenv';

dotenv.config();
const mongoDbActive = process.env.MONGO_DB_ACTIVE;
let userManagerMongo;
let cartManagerMongo;
if (mongoDbActive === 'yes') {
	userManagerMongo = new UserManagerMongo();
	cartManagerMongo = new CartManagerMongo();
}

// Variables de entorno del perfil del administrador
const adminId = process.env.ADMIN_ID;
const adminName = process.env.ADMIN_NAME;
const adminLastname = process.env.ADMIN_LASTNAME;
const adminMail = process.env.ADMIN_MAIL;
const adminAge = process.env.ADMIN_AGE;
const adminPass = process.env.ADMIN_PASS;
const adminCart = process.env.ADMIN_CART;
const adminRole = process.env.ADMIN_ROLE;

// Variables para estrategia GitHub
const gitHubClientId = process.env.CLIEN_ID;
const gitHubClientSecret = process.env.CLIENT_SECRET;
const gitHubCallbackUrl = process.env.CALLBACK_URL;

const LocalStrategy = local.Strategy;

const initializePassport = () => {
	// Estrategia local
	passport.use(
		'register',
		new LocalStrategy(
			{
				passReqToCallback: true, // Permite el acceso al objeto req
				usernameField: 'email', // Define al campo email como username
			},
			async (req, username, password, done) => {
				try {
					// Verifica si el usuario ya existe
					const validUser = await userManagerMongo.getUserByEmail(
						username
					);
					if (validUser) {
						console.info('User already exists');
						return done(null, false);
					}

					// Evita la creación de un usuario con el mismo email del administrador
					if (username === adminMail) {
						console.error('Invalid email. Use another email address');
						return done(null, false);
					}

					// Almacena los datos del nuevo usuario y hashea su password
					const newUser = req.body;
					newUser.password = createHash(password);
					// crea un carrito nuevo y lo asigna al usuario recientemente creado
					newUser.cart = await cartManagerMongo.addCart({
						products: [],
					});

					// Almacena el nuevo usuario y lo devuelve
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
			{ usernameField: 'email' }, // Define el campo email como username
			async (username, password, done) => {
				try {
					// Verifica si se trata del usuario administrador y lo autentica
					if (username == adminMail && password == adminPass) {
						const user = {
							_id: adminId,
							name: adminName,
							lastname: adminLastname,
							email: adminMail,
							age: adminAge,
							password: createHash(adminPass),
							cart: adminCart,
							role: adminRole,
						};
						return done(null, user);
					}

					// Verifica si el usuario existe y si su password es correcto
					const user = await userManagerMongo.getUserByEmail(username);
					if (!user) {
						console.error('User does not exist');
						return done(null, false);
					}

					if (!checkPassword(user, password)) {
						console.error('Password is invalid');
						return done(null, false);
					}

					// Autentica el usuario
					return done(null, user);
				} catch (error) {
					return done(`Error interno del servidor: ${error}`);
				}
			}
		)
	);

	// Estrategia GitHub
	passport.use(
		'github',
		new GitHubStrategy(
			// Datos de la app de GitHub
			{
				clientID: gitHubClientId,
				clientSecret: gitHubClientSecret,
				callbackURL: gitHubCallbackUrl,
			},
			async (accessToken, refreshToken, profile, done) => {
				try {
					// Verifica si el usuario ya existe
					const user = await userManagerMongo.getUserByEmail(
						profile._json.email
					);

					if (user) {
						console.info('User already exists');
						return done(null, user);
					}

					// Si no existe genera uno con los datos que obtiene desde GitHub
					const newUser = await userManagerMongo.createUser({
						name: profile._json.name,
						lastname: '',
						email: profile._json.email,
						age: 18,
						password: '',
						cart: await cartManagerMongo.addCart({
							products: [],
						}),
						role: 'user',
					});

					// Autentica el usuario
					return done(null, newUser);
				} catch (error) {
					console.error(error);
				}
			}
		)
	);

	// Serializa el usuario
	passport.serializeUser((user, done) => {
		done(null, user._id);
	});

	// Deserializa el usuario
	passport.deserializeUser(async (id, done) => {
		// Este bloque se usa para poder usar el usuario administrador que no está en la base de datos
		if (id === adminId) {
			return done(null, false);
		}

		const user = await userManagerMongo.getUserById(id);
		done(null, user);
	});
};

export default initializePassport;
