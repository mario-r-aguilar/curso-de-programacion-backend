import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// __dirname
export default (path) => {
	const __filename = fileURLToPath(path);
	const __dirname = dirname(__filename);
	return __dirname;
};

// bcrypt - Crear hash
export const createHash = (password) => {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

// bcrypt - Validar hash
export const checkPassword = (user, password) => {
	return bcrypt.compareSync(password, user.password);
};

//jwt - Generar token
dotenv.config();
const privateKey = process.env.PRIVATE_KEY_JWT;
export const generateToken = (user) => {
	const token = jwt.sign({ user }, privateKey, { expiresIn: '24h' });
	return token;
};
