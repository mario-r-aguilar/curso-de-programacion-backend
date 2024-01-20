export default class UserRepository {
	constructor(dao) {
		this.dao = dao;
	}

	async getAll() {
		try {
			return await this.dao.get();
		} catch (error) {
			console.error(
				`It is not possible to obtain the users.\n 
				Error: ${error}`
			);
		}
	}

	async getUserById(userID) {
		try {
			return await this.dao.getById(userID);
		} catch (error) {
			console.error(
				`Unable to get the user.\n 
					Error: ${error}`
			);
		}
	}

	async getUserByEmail(userEmail) {
		try {
			return await this.dao.getByEmail(userEmail);
		} catch (error) {
			console.error(
				`Unable to get the user.\n 
				Error: ${error}`
			);
		}
	}

	async addUser(newUser) {
		try {
			return await this.dao.add(newUser);
		} catch (error) {
			console.error(
				`It is not possible to create the user.\n 
				Error: ${error}`
			);
		}
	}
}
