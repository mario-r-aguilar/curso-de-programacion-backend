import { chatModel } from './models/chat.model.js';

export default class ChatMongoDAO {
	constructor() {
		this.model = chatModel;
	}

	async get() {
		try {
			return await this.model.find().limit(15).lean().exec();
		} catch (error) {
			console.error(
				`It is not possible to obtain the messages.\n 
				Error: ${error}`
			);
			return;
		}
	}

	async getById(messageID) {
		try {
			return await this.model.findById(messageID);
		} catch (error) {
			console.error(
				`Unable to get the message.\n 
				Error: ${error}`
			);
			return;
		}
	}

	async add(newMessage) {
		try {
			return await this.model.create(newMessage);
		} catch (error) {
			console.error(
				`It is not possible to send the message.\n 
				Error: ${error}`
			);
			return;
		}
	}

	async delete(messageID) {
		try {
			return await this.model.deleteOne({ _id: messageID });
		} catch (error) {
			console.error(
				`It is not possible to delete the message.\n 
				Error: ${error}`
			);
			return;
		}
	}

	async update(messageID, messageUpdated) {
		try {
			return await this.model.updateOne(
				{ _id: messageID },
				{ $set: messageUpdated }
			);
		} catch (error) {
			console.error(
				`It is not possible to update the message.\n 
				Error: ${error}`
			);
			return;
		}
	}
}
