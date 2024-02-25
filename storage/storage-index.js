const dotenv = require('dotenv');
const Sequelize = require('sequelize');

dotenv.config();

// Static class not meant to be initialized. It will handle all our storage needs.
class Storage {
	static #_connection = this.#_initializeConnection();
	static models = {};

	// Initialize the database connection with the .env information
	static #_initializeConnection() {
		return new Sequelize(
			process.env.DATABASE_NAME,
			process.env.DATABASE_USER,
			process.env.DATABASE_PASSWORD,
			{
				host: process.env.DATABASE_HOST,
				dialect: process.env.DATABASE_DIALECT,
				logging: false,
				// Name of the database file when using sqlite as dialect
				storage: 'database.sqlite',
			},
		);
	}

	// Use this function as an interface to return the actual private connection
	// object. This forces clients of this class to always test the connection
	// first through the private #_connect() method.
	static async connect() {
		await this.#_connect();
		return this.#_connection;
	}

	// Connect to the database using the initialized connection object.
	// This should be called first before every use of the connected
	// object, since it also tests if the connection is still OK.
	static async #_connect() {
		try {
			await this.#_connection.authenticate();
			console.log('Database connection has been established successfully.');
		}
		catch (error) {
			console.error('Unable to connect to the database:', error);
		}
	}

	// Closes the connection to the database. Once this is called,
	// the sequelize object needs to be recreated from scratch
	static closeConnection() {
		this.#_connection.close();
	}

	// Load all of our model files and synchronize them with the database
	static loadModels() {
		const path = require('node:path');
		const fs = require('node:fs');

		// Iterate through all our model files and create them in the database
		const modelsPath = path.join(__dirname, 'models');
		const modelFiles = fs.readdirSync(modelsPath).filter(file => file.endsWith('.js'));

		for (const file of modelFiles) {
			const filePath = path.join(modelsPath, file);
			const modelStructure = require(filePath);
			const modelName = modelStructure.name;

			// Incorrect model structure
			if (modelName === undefined || modelStructure.columns === undefined) {
				console.error(`Model ${file} is missing modelName or columns definitions!`);
				continue;
			}

			// Define the model in sequelize using its data structure
			this.models[modelName] = this.#_connection.define(modelName, {
				...modelStructure.columns,
			});
		}
	}

	static async syncModels() {
		// Creates the models in the database if they don't exist,
		// or syncs their local data with the db otherwise
		await this.#_connection.sync({ alter: true });
	}

	static async forEvery(modelName, filterObj) {
		const models = await this.models[modelName].findAll(filterObj);
		return {
			invoke: async function(fn) {
				for (const model of models) {
					await fn(model);
				}
			},
		};
	}
}

module.exports.Storage = Storage;
module.exports.models = Storage.models;
