import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
	name: String,
	lastname: String,
	email: {
		type: String,
		unique: true,
		required: true,
		index: true,
	},
	age: Number,
	password: String,
	role: {
		type: String,
		default: 'user',
	},
});

const collectionName = 'users';

const userModel = mongoose.model(collectionName, userSchema);

export default userModel;
