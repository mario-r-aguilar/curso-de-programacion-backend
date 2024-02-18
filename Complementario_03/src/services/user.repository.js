import { devLogger } from '../utils/logger.js';

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
			devLogger.fatal(
				`It is not possible to obtain the users.\n 
				Error: ${error}`
			);
			throw error;
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
			devLogger.fatal(
				`Unable to get the user.\n 
					Error: ${error}`
			);
			throw error;
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
			devLogger.fatal(
				`Unable to get the user.\n 
				Error: ${error}`
			);
			throw error;
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
			devLogger.fatal(
				`It is not possible to create the user.\n 
				Error: ${error}`
			);
			throw error;
		}
	}

	/**
	 * Cambia el rol de USER a PREMIUM y viceversa
	 * @param {Object} Usuario
	 * @returns {void}
	 */
	async toggleUserRole(user) {
		try {
			let newRole;
			switch (user.role) {
				case 'PREMIUM':
					newRole = 'USER';
					break;

				case 'USER':
					newRole = 'PREMIUM';
					break;

				default:
					devLogger.warning(`Invalid role provided: ${user.role}`);
					throw new Error(`Invalid role provided: ${user.role}`);
			}

			// Realiza la actualización del rol solo si es USER o PREMIUM
			if (newRole) {
				devLogger.info(
					`El usuario ${user.name} ${user.lastname} cambió su rol a ${newRole}`
				);
				user.role = newRole;
				await this.dao.update(user.id, user);
			}
		} catch (error) {
			devLogger.fatal(
				`It is not possible to change the user's role.\n
				Error: ${error}`
			);
			throw error;
		}
	}
}
