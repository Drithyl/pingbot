const constants = require('./constants');
const jsUtils = require('./js-utils');
const discordUtils = require('./discord-utils');

// Main object that will be exported, gathering
// all functions from all other utils files
const parser = {
	constants,
	...jsUtils,
	...discordUtils,
};

module.exports = parser;
