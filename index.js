// Require the necessary discord.js classes and other modules
const dotenv = require('dotenv');
const { Client, GatewayIntentBits } = require('discord.js');
const readCommands = require('./commands/commands-index');
const loadEvents = require('./events/events-index');

async function initialize() {
	// Load the variables from the .env file into process.env. More information:
	// https://www.npmjs.com/package/dotenv
	// https://nodejs.org/en/learn/command-line/how-to-read-environment-variables-from-nodejs
	dotenv.config();

	// Create a new client instance
	const client = new Client({ intents: [GatewayIntentBits.Guilds] });
	const { Storage } = require('./storage/storage-index');

	// Read all command files within all commands subfolders and assign the returning collection to our client
	client.commands = readCommands();

	// Read all event files and attach the listeners to the client
	loadEvents(client);

	// Connect to the database configured in our .env file
	await Storage.connect(process.env);

	// Create/sync the data from the database
	await Storage.loadModels();
	Storage.syncModels();

	// Log in to Discord with your client's token
	client.login(process.env.DISCORD_TOKEN);
}

initialize();
