import { devLogger } from '../utils/logger.js';
import config from '../config/config.js';
import nodemailer from 'nodemailer';
import { createHash, checkPassword } from '../utils/utils.js';

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

				return await this.dao.update(user._id, user);
			}
		} catch (error) {
			devLogger.fatal(
				`It is not possible to change the user's role.\n
				Error: ${error}`
			);
			throw error;
		}
	}

	/**
	 * Envía un link para reestablecer la contraseña
	 * @param {String} Email del usuario
	 * @param {String} Token
	 * @returns {String} Resultado del envío del correo
	 */
	async sendResetPassEmail(email, resetPassToken) {
		try {
			const resetLink = `${config.serverUrl}/reset-password/${resetPassToken}`;

			const transport = nodemailer.createTransport({
				service: 'gmail',
				port: 587,
				auth: {
					user: config.nodemailerUser,
					pass: config.nodemailerPass,
				},
			});

			await transport.sendMail({
				from: 'Cba E-commerce <config.nodemailerUser>',
				to: email,
				subject: 'Restablecer contraseña',
				html: `
				<h3>Para restablecer su contraseña haga clic aquí:</h3>
				<a href="${resetLink}" style="display: inline-block; padding:  10px  20px; background-color: #007BFF; color: white; text-decoration: none; border-radius:  4px; font-weight: bold;">
				Resetear Password
				</a>          
				<p><b>El enlace expirará en 1 hora.</b></p>`,
			});

			devLogger.info('The email to reset your password was sent');
			return 'Success';
		} catch (error) {
			devLogger.fatal(
				`It is not possible to send the email to reset the password (repository error).\n
				Error: ${error}`
			);
			throw error;
		}
	}

	/**
	 * Resetea el password del usuario
	 * @param {String} Email del usuario
	 * @param {String} Nuevo password
	 * @returns {Object} Usuario actualizado
	 */
	async resetPassword(email, newPassword) {
		try {
			const user = await this.dao.getByEmail(email);

			// Valida el password y si es true informa que no es posible poner el mismo password
			const samePassword = checkPassword(user, newPassword);
			if (samePassword) {
				throw new Error('You cannot use the same password.');
			}

			const newPasswordHash = createHash(newPassword);
			user.password = newPasswordHash;

			const userUpdated = await this.dao.update(user._id, user);
			return userUpdated;
		} catch (error) {
			devLogger.fatal(
				`It is not possible to reset the user's password (repository error).\n
				Error: ${error.message}`
			);
			throw error;
		}
	}
}
