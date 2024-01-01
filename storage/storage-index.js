// Main object that will be exported
const storage = {
	// Connect to the configured database
	connect,

	// Create/sync all models
	loadModels,

	// Main sequelize object will be stored here
	sequelize: null,

	// All models will be stored here
	models: {},
};

module.exports = storage;

// Parameter values come directly from the process.env object passed from the main index file.
// Dotenv could be required as a module here, but this keeps it more abstracted.
function connect({ DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD, DATABASE_HOST, DATABASE_DIALECT }) {
	const Sequelize = require('sequelize');

	// Initialize the database connection with our .env information
	storage.sequelize = new Sequelize(
		DATABASE_NAME,
		DATABASE_USER,
		DATABASE_PASSWORD,
		{
			host: DATABASE_HOST,
			dialect: DATABASE_DIALECT,
			logging: false,
			// Name of the database file when using sqlite as dialect
			storage: 'database.sqlite',
		},
	);
}

function loadModels() {
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
		storage.models[modelName] = storage.sequelize.define(modelName, {
			...modelStructure.columns,
		});

		// Create the model in the database if it doesn't exist
		storage.models[modelName].sync();
	}
}
