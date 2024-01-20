export default class TicketRepository {
	constructor(dao) {
		this.dao = dao;
	}

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

	async update(ticketID, ticketUpdated) {
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
}
