import userModel from './models/user.model.js';

export default class UserMongoDAO {
	constructor() {
		this.model = userModel;
	}

	async get() {
		try {
			return await this.model.find().lean().exec();
		} catch (error) {
			console.error(
				`It is not possible to obtain the users.\n 
				Error: ${error}`
			);
		}
	}

	async getById(userID) {
		try {
			return await this.model.findById(userID);
		} catch (error) {
			console.error(
				`Unable to get the user.\n 
				Error: ${error}`
			);
		}
	}

	async getByEmail(userEmail) {
		try {
			return await this.model.findOne({ email: userEmail }).lean().exec();
		} catch (error) {
			console.error(
				`Unable to get the user.\n 
				Error: ${error}`
			);
		}
	}

	async add(newUser) {
		try {
			return await this.model.create(newUser);
		} catch (error) {
			console.error(
				`It is not possible to create the user.\n 
				Error: ${error}`
			);
		}
	}

	async delete(userID) {
		try {
			return await this.model.deleteOne({ _id: userID });
		} catch (error) {
			console.error(
				`It is not possible to delete the user.\n 
				Error: ${error}`
			);
			return;
		}
	}

	async update(userID, userUpdated) {
		try {
			return await this.model.updateOne(
				{ _id: userID },
				{ $set: userUpdated }
			);
		} catch (error) {
			console.error(
				`It is not possible to update the user.\n 
				Error: ${error}`
			);
			return;
		}
	}
}
