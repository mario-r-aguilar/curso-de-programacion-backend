import ticketModel from './models/ticket.model.js';

export default class TicketMongoDAO {
	constructor() {
		this.model = ticketModel;
	}

	/**
	 * Busca el listado de tickets
	 * @returns {Array} Listado de tickets
	 */
	async get() {
		try {
			return await this.model.find().lean().exec();
		} catch (error) {
			console.error(
				`It is not possible to obtain the tickets.\n 
				Error: ${error}`
			);
		}
	}

	/**
	 * Busca un ticket mediante su ID
	 * @param {String} ID del ticket
	 * @returns {Object} Ticket
	 */
	async getById(ticketID) {
		try {
			return await this.model.findById(ticketID);
		} catch (error) {
			console.error(
				`Unable to get the ticket.\n 
				Error: ${error}`
			);
		}
	}

	/**
	 * Agrega un ticket
	 * @param {Object} Ticket
	 * @returns {Object} Ticket creado
	 */
	async add(newTicket) {
		try {
			return await this.model.create(newTicket);
		} catch (error) {
			console.error(
				`It is not possible to create the ticket.\n 
				Error: ${error}`
			);
		}
	}

	/**
	 * Elimina un ticket
	 * @param {String} ID del ticket
	 * @returns {@type void}
	 */
	async delete(ticketID) {
		try {
			return await this.model.deleteOne({ _id: ticketID });
		} catch (error) {
			console.error(
				`It is not possible to delete the ticket.\n 
				Error: ${error}`
			);
			return;
		}
	}

	/**
	 * Actualiza un ticket
	 * @param {String} ID del ticket
	 * @param {Object} Ticket editado
	 * @returns {Object} Ticket actualizado
	 */
	async update(ticketID, ticketUpdated) {
		try {
			return await this.model.updateOne(
				{ _id: ticketID },
				{ $set: ticketUpdated }
			);
		} catch (error) {
			console.error(
				`It is not possible to update the ticket.\n 
				Error: ${error}`
			);
			return;
		}
	}
}
