import nodemailer from 'nodemailer';
import config from '../config/config.js';

export default class TicketRepository {
	constructor(dao) {
		this.dao = dao;
	}

	/**
	 * Busca el listado de tickets
	 * @returns {Array} Listado de tickets
	 */
	async getTickets() {
		try {
			return await this.dao.get();
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
	async getTicketById(ticketID) {
		try {
			return await this.dao.getById(ticketID);
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
	async addTicket(newTicket) {
		try {
			return await this.dao.add(newTicket);
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
	async deleteTicket(ticketID) {
		try {
			return await this.dao.delete(ticketID);
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
	async updateTicket(ticketID, ticketUpdated) {
		try {
			return await this.dao.update(ticketID, ticketUpdated);
		} catch (error) {
			console.error(
				`It is not possible to update the ticket.\n 
				Error: ${error}`
			);
			return;
		}
	}

	/**
	 * Envía un mail con los detalles del ticket al usuario
	 * @param {Object} Ticket a enviar
	 * @param {String} Email del usuario
	 * @returns {Object} Detalles del mail enviado
	 */
	async sendTicketByMail(ticket, email) {
		const transport = nodemailer.createTransport({
			service: 'gmail',
			port: 587,
			auth: {
				user: config.nodemailerUser,
				pass: config.nodemailerPass,
			},
		});

		try {
			const detailPurchase = await transport.sendMail({
				from: 'Cba E-commerce <config.nodemailerUser>',
				to: email,
				subject: 'Ticket de compra',
				html: `
					<h3>Muchas Gracias por su Compra!</h3>	
					<p><b>Total: $${ticket.amount}</b></p>
	 				<p><b>Comprador: ${ticket.purchaser}</b></p>
					<p><b>Fecha de compra: ${ticket.purchase_datetime}</b></p>
					<p><b>Nº de Ticket: ${ticket.code}</b></p>
					<h4>Se proceso la compra solo con los productos que tenían stock disponible</h4>
				`,
			});
			return detailPurchase;
		} catch (error) {
			console.error(
				`It is not possible to send the ticket.\n 
				Error: ${error}`
			);
		}
	}
}
