import userModel from './models/user.model.js';
import { devLogger } from '../../utils/logger.js';

export default class UserMongoDAO {
	constructor() {
		this.model = userModel;
	}

	/**
	 * Busca el listado de usuarios
	 * @returns {Array} Listado de usuarios
	 */
	async get() {
		try {
			return await this.model.find().lean().exec();
		} catch (error) {
			devLogger.fatal(
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
	async getById(userID) {
		try {
			const user = await this.model.findById(userID);
			if (!user) {
				return null;
			}
			return user;
		} catch (error) {
			devLogger.fatal(
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
	async getByEmail(userEmail) {
		try {
			const user = await this.model
				.findOne({ email: userEmail })
				.lean()
				.exec();
			if (!user) {
				return null;
			}
			return user;
		} catch (error) {
			devLogger.fatal(
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
	async add(newUser) {
		try {
			return await this.model.create(newUser);
		} catch (error) {
			devLogger.fatal(
				`It is not possible to create the user.\n 
				Error: ${error}`
			);
		}
	}

	/**
	 * Elimina un usuario
	 * @param {String} ID del usuario
	 * @returns {@type void}
	 */
	async delete(userID) {
		try {
			return await this.model.deleteOne({ _id: userID });
		} catch (error) {
			devLogger.fatal(
				`It is not possible to delete the user.\n 
				Error: ${error}`
			);
			return;
		}
	}

	/**
	 * Actualiza un usuario
	 * @param {String} ID del usuario
	 * @param {Object} Usuario editado
	 * @returns {Object} Información sobre la actualización
	 */
	async update(userID, userUpdated) {
		try {
			return await this.model.updateOne(
				{ _id: userID },
				{ $set: userUpdated }
			);
		} catch (error) {
			devLogger.fatal(
				`It is not possible to update the user.\n 
				Error: ${error}`
			);
			return;
		}
	}
}
