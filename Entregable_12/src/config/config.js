import dotenv from 'dotenv';
dotenv.config();

export default {
	mongoUrl: process.env.MONGO_URL,
	mongoDbName: process.env.MONGO_DB_NAME,
	sessionSecret: process.env.SESSION_SECRET,
	privateKey: process.env.PRIVATE_KEY_JWT,
	adminId: process.env.ADMIN_ID,
	adminName: process.env.ADMIN_NAME,
	adminLastname: process.env.ADMIN_LASTNAME,
	adminMail: process.env.ADMIN_MAIL,
	adminAge: process.env.ADMIN_AGE,
	adminCart: process.env.ADMIN_CART,
	adminPass: process.env.ADMIN_PASS,
	adminRole: process.env.ADMIN_ROLE,
	gitHubClientId: process.env.CLIEN_ID,
	gitHubClientSecret: process.env.CLIENT_SECRET,
	gitHubCallbackUrl: process.env.CALLBACK_URL,
	nodemailerUser: process.env.USER_NODEMAILER,
	nodemailerPass: process.env.PASS_NODEMAILER,
};
