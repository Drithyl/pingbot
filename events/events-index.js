module.exports = loadEvents;

function loadEvents(client) {
	const fs = require('node:fs');
	const path = require('node:path');

	const foldersPath = path.join(__dirname);

	// Get an array of directory names within the events directory, filtering out all non-folder results (i.e. events-index.js)
	const eventFolders = fs.readdirSync(foldersPath, { withFileTypes: true })
		.filter(dirent => dirent.isDirectory())
		.map(dirent => dirent.name);

	for (const folder of eventFolders) {
		const eventsPath = path.join(foldersPath, folder);
		const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

		for (const file of eventFiles) {
			const filePath = path.join(eventsPath, file);
			const event = require(filePath);

			// Probably events-index.js, so ignore
			if (event.execute === undefined) {
				continue;
			}

			if (event.once !== undefined) {
				client.once(event.name, (...args) => event.execute(...args));
			}
			else {
				client.on(event.name, (...args) => event.execute(...args));
			}
		}
	}
}
