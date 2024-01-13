const { Events } = require('discord.js');
const { resumeGameTracking } = require('../../game-tracker/game-tracker-index');

module.exports = {
	name: Events.ClientReady,
	once: true,

	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		resumeGameTracking(client);
	},
};
