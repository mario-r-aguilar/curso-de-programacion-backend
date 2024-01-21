import { Command } from 'commander';
import dotenv from 'dotenv';
dotenv.config();

const program = new Command();

program.option('-p, --persistence <persistence>', 'Persistence');
program.parse();

const options = program.opts();

const selectedPersistence = {
	persistence: options.persistence || 'MONGO',
	error: function (message, error) {
		console.error(message, error);
	},
};

export default selectedPersistence;
