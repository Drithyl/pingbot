module.exports = readCommands;

function readCommands() {
	const fs = require('node:fs');
	const path = require('node:path');
	const { Collection } = require('discord.js');

	const commands = new Collection();
	const foldersPath = path.join(__dirname);

	// Get an array of directory names within the commands directory, filtering out all non-folder results (i.e. commands-index.js)
	const commandFolders = fs.readdirSync(foldersPath, { withFileTypes: true })
		.filter(dirent => dirent.isDirectory())
		.map(dirent => dirent.name);

	for (const folder of commandFolders) {
		const commandsPath = path.join(foldersPath, folder);
		const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);
			const command = require(filePath);

			// Set a new item in the Collection with the key as the command name and the value as the exported module
			if ('data' in command && 'execute' in command) {
				commands.set(command.data.name, command);
			}
			else {
				console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
			}
		}
	}

	return commands;
}