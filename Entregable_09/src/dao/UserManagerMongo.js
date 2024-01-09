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
	 * Busca el usuario mediante su email.
	 * @param {String} Email del usuario
	 * @returns {Object} Usuario
	 */
	async getUserByEmail(email) {
		try {
			return await this.model.findOne({ email }).lean().exec();
		} catch (error) {
			console.error(
				`No es posible obtener el usuario.\n 
				Error: ${error}`
			);
		}
	}

	/**
	 * Busca el usuario mediante su id.
	 * @param {String} ID del usuario
	 * @returns {Object} Usuario
	 */
	async getUserById(id) {
		try {
			return await this.model.findById(id);
		} catch (error) {
			console.error(
				`No es posible obtener el usuario.\n 
				Error: ${error}`
			);
		}
	}

	/**
	 * Crea un nuevo usuario.
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
