import userModel from './models/user.model.js';

class UserManagerMongo {
	constructor() {
		this.model = userModel;
	}

	async getAll() {
		return await this.model.find();
	}

	async getUserData(email, password) {
		return await this.model.findOne({ email, password });
	}
	async createUser(userData) {
		return await this.model.create(userData);
	}
}

export default UserManagerMongo;
