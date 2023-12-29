module.exports = loadEvents;

function loadEvents(client) {
	const fs = require('node:fs');
	const path = require('node:path');
	const eventsPath = path.join(__dirname);
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