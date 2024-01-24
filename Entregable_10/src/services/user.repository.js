export default class UserRepository {
	constructor(dao) {
		this.dao = dao;
	}

	/**
	 * Busca el listado de usuarios
	 * @returns {Array} Listado de usuarios
	 */
	async getAll() {
		try {
			return await this.dao.get();
		} catch (error) {
			console.error(
				`It is not possible to obtain the users.\n 
				Error: ${error}`
			);
		}
	}

	/**
	 * Busca un usuario mediante su ID
	 * @param {String} ID del usuario
	 * @returns {Object} Usuario
	 */
	async getUserById(userID) {
		try {
			return await this.dao.getById(userID);
		} catch (error) {
			console.error(
				`Unable to get the user.\n 
					Error: ${error}`
			);
		}
	}

	/**
	 * Busca un usuario mediante su email
	 * @param {String} Email del usuario
	 * @returns {Object} Usuario
	 */
	async getUserByEmail(userEmail) {
		try {
			return await this.dao.getByEmail(userEmail);
		} catch (error) {
			console.error(
				`Unable to get the user.\n 
				Error: ${error}`
			);
		}
	}

	/**
	 * Agrega un usuario
	 * @param {Object} Usuario
	 * @returns {Object} Usuario creado
	 */
	async addUser(newUser) {
		try {
			return await this.dao.add(newUser);
		} catch (error) {
			console.error(
				`It is not possible to create the user.\n 
				Error: ${error}`
			);
		}
	}
}
