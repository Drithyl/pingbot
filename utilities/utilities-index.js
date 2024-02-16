const constants = require('./constants');
const jsUtils = require('./js-utilities');
const discordUtils = require('./discord-utilities');

// Main object that will be exported, gathering
// all functions from all other utilities files
const parser = {
	constants,
	...jsUtils,
	...discordUtils,
};

module.exports = parser;
