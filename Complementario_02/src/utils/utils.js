import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';

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
