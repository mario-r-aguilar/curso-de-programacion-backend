import userModel from './models/user.model.js';

class UserManagerMongo {
	constructor() {
		this.model = userModel;
	}

	/**
	 * Devuelve el listado de usuarios.
	 * @returns {Object} Lista de usuarios
	 */
	async getAll() {
		try {
			return await this.model.find().lean().exec();
		} catch (error) {
			console.error(
				`No es posible obtener los usuarios.\n 
				Error: ${error}`
			);
		}
	}

	/**
	 *
	 * @param {String} Email del usuario
	 * @param {String} Password del usuario
	 * @returns {Object} Usuario
	 */
	async getUserData(email, password) {
		try {
			return await this.model.findOne({ email, password }).lean().exec();
		} catch (error) {
			console.error(
				`No es posible obtener el usuario.\n 
				Error: ${error}`
			);
		}
	}

	/**
	 *
	 * @param {Object} Datos del usuario
	 * @returns {Object} Nuevo usuario creado
	 */
	async createUser(userData) {
		try {
			return await this.model.create(userData);
		} catch (error) {
			console.error(
				`No es posible crear el usuario.\n 
				Error: ${error}`
			);
		}
	}
}

export default UserManagerMongo;
