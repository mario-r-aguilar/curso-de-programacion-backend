import fs from 'node:fs';
import { v4 as uuidv4 } from 'uuid';
import CartFileDAO from './CartFile.dao.js';

const cartFileDAO = new CartFileDAO();

export default class UserFileDAO {
	constructor() {
		this.path = './src/DAO/file/db/users.json';

		// Si el usuario no brinda una ruta, crea el archivo
		if (!fs.existsSync(this.path)) {
			fs.writeFileSync(this.path, JSON.stringify([]));
		}
	}

	async get() {
		try {
			const usersList = await fs.promises.readFile(this.path, 'utf-8');
			return JSON.parse(usersList);
		} catch (error) {
			console.error(
				`It is not possible to obtain the users.\n 
				Error: ${error}`
			);
		}
	}

	async getById(userID) {
		try {
			const usersList = await this.get();
			const userSearch = usersList.find((user) => user._id === userID);

			if (userSearch) {
				return userSearch;
			} else {
				console.error(`User ID ${userID} not found`);
				return;
			}
		} catch (error) {
			console.error(
				`Unable to get the user.\n 
				Error: ${error}`
			);
		}
	}

	async getByEmail(userEmail) {
		try {
			const usersList = await this.get();
			const userSearch = usersList.find((user) => user.email === userEmail);

			if (userSearch) {
				return userSearch;
			} else {
				console.error(`User ${userEmail} not found`);
				return;
			}
		} catch (error) {
			console.error(
				`Unable to get the user.\n 
				Error: ${error}`
			);
		}
	}

	async add(newUser) {
		try {
			let { name, lastname, email, age, password } = newUser;

			age = parseInt(age);

			if (!name || !lastname || !email || !age || !password)
				return console.error('Missing fields in user');

			if (
				typeof name !== 'string' ||
				typeof lastname !== 'string' ||
				typeof email !== 'string' ||
				typeof age !== 'number' ||
				typeof password !== 'string'
			) {
				return console.error('One or more fields have invalid data types');
			}

			const usersList = await this.get();

			if (usersList.some((emails) => emails.email === email))
				return console.error(
					`The email ${email} already exists. Try another email`
				);

			let _id = uuidv4();
			let role = 'USER';

			let newUserWithID = {
				_id,
				name,
				lastname,
				email,
				age,
				password,
				role,
			};

			const cartList = await cartFileDAO.get();
			const emptyCart = cartList.find((cart) => cart.products.length === 0);
			if (!emptyCart) {
				console.error('No empty cart available. Please create a new one.');
				return;
			}
			let cartFound = { _id: emptyCart._id, products: [] };

			newUserWithID.cart = cartFound;

			usersList.push(newUserWithID);

			await fs.promises.writeFile(this.path, JSON.stringify(usersList));

			console.info(`The user was successfully added`);
			return newUserWithID;
		} catch (error) {
			console.error(
				`It is not possible to create the user.\n 
				Error: ${error}`
			);
		}
	}

	async delete(userID) {
		try {
			const usersList = await this.get();

			const userToDelete = usersList.find((user) => user._id === userID);
			if (!userToDelete) {
				console.error(`User ID ${userID} not found`);
				return;
			}

			const newUserList = usersList.filter((user) => user._id != userID);

			await fs.promises.writeFile(this.path, JSON.stringify(newUserList));

			console.info(`The user ID ${userID} was removed`);
			return;
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
			const { name, lastname, email, age, password, cart, role } =
				userUpdated;

			const usersList = await this.get();

			const userToUpdate = usersList.find((user) => user._id === userID);
			if (!userToUpdate) {
				console.error(`User ID ${userID} not found`);
				return;
			}

			const updatedUsersList = usersList.map((user) => {
				if (user._id === userID) {
					return {
						...user,
						name,
						lastname,
						email,
						age,
						password,
						cart,
						role,
					};
				} else {
					return user;
				}
			});

			const updatedUser = updatedUsersList.find(
				(user) => user._id === userID
			);

			await fs.promises.writeFile(
				this.path,
				JSON.stringify(updatedUsersList)
			);

			console.info(`The user ID ${userID} was updated`);
			return updatedUser;
		} catch (error) {
			console.error(
				`It is not possible to update the user.\n 
				Error: ${error}`
			);
			return;
		}
	}
}
