// Require the necessary discord.js classes and other modules
const dotenv = require('dotenv');
const { Client, GatewayIntentBits } = require('discord.js');
const readCommands = require('./commands/commands-index');
const loadEvents = require('./events/events-index');

// Load the variables from the .env file into process.env
dotenv.config();

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Read all command files within all commands subfolders and assign the returning collection to our client
client.commands = readCommands();

// Read all event files and attach the listeners to the client
loadEvents(client);

// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);
