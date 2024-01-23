import fs from 'node:fs';
import { v4 as uuidv4 } from 'uuid';

export default class ChatFileDAO {
	constructor() {
		this.path = './src/DAO/file/db/chats.json';

		// Si el usuario no brinda una ruta, crea el archivo
		if (!fs.existsSync(this.path)) {
			fs.writeFileSync(this.path, JSON.stringify([]));
		}
	}

	async get() {
		try {
			const messagesList = await fs.promises.readFile(this.path, 'utf-8');
			return JSON.parse(messagesList);
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
			const messagesList = await this.get();
			const messageSearch = messagesList.find(
				(message) => message._id === messageID
			);

			if (messageSearch) {
				console.info('Message found!');
				return messageSearch;
			} else {
				console.error(`Message ID ${messageID} not found`);
				return;
			}
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
			const { user, message } = newMessage;

			if (!user || !message)
				return console.error('Missing fields in message');

			const messagesList = await this.get();

			const _id = uuidv4();
			const newMessageWithID = {
				_id,
				user,
				message,
			};
			messagesList.push(newMessageWithID);

			await fs.promises.writeFile(this.path, JSON.stringify(messagesList));

			console.info(`The message was successfully added`);
			return newMessageWithID;
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
			const messagesList = await this.get();
			const newMessagesList = messagesList.filter(
				(message) => message._id != messageID
			);

			await fs.promises.writeFile(
				this.path,
				JSON.stringify(newMessagesList)
			);

			console.info(`The message ID ${messageID} was removed`);
			return;
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
			const { user, message } = messageUpdated;

			const messagesList = await this.get();

			const updatedMessagesList = messagesList.map((messages) => {
				if (messages._id === messageID) {
					return {
						...messages,
						user,
						message,
					};
				} else {
					return messages;
				}
			});

			const updatedMessage = updatedMessagesList.find(
				(messages) => messages._id === messageID
			);

			await fs.promises.writeFile(
				this.path,
				JSON.stringify(updatedMessagesList)
			);

			console.info(`The message ID ${messageID} was updated`);
			return updatedMessage;
		} catch (error) {
			console.error(
				`It is not possible to update the message.\n 
				Error: ${error}`
			);
			return;
		}
	}
}
