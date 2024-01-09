import { chatModel } from './models/chat.model.js';

class ChatManager {
	constructor() {
		this.model = chatModel;
	}

	/**
	 * Devuelve los últimos 15 mensajes del chat
	 * @returns {Array} Listado de mensajes
	 */
	async getMessages() {
		try {
			const messages = await this.model.find().limit(15).lean().exec();
			return messages;
		} catch (error) {
			console.error(
				`No es posible obtener los mensajes.\n 
				Error: ${error}`
			);
			return;
		}
	}

	/**
	 * Crea un nuevo mensaje en el chat.
	 * @param {Object} Mensaje a enviar
	 * @returns {Object} Mensaje enviado
	 */
	async createMessage(message) {
		try {
			const newMessage = await this.model.create(message);
			return newMessage;
		} catch (error) {
			console.error(
				`No es posible enviar el mensaje.\n 
				Error: ${error}`
			);
			return;
		}
	}
}

export const chatManager = new ChatManager();
