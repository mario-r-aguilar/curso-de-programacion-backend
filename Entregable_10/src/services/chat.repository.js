export default class ChatRepository {
	constructor(dao) {
		this.dao = dao;
	}

	async getMessages() {
		try {
			return await this.dao.get();
		} catch (error) {
			console.error(
				`It is not possible to obtain the messages.\n 
				Error: ${error}`
			);
			return;
		}
	}

	async createMessage(newMessage) {
		try {
			return await this.dao.add(newMessage);
		} catch (error) {
			console.error(
				`It is not possible to send the message.\n 
				Error: ${error}`
			);
			return;
		}
	}
}
