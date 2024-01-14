const html = require('./html');
const GameStatusParser = require('./GameStatusParser');

// Main object that will be exported, gathering
// all functions from all other parser files
const parser = {
	...html,
	GameStatusParser,
};

module.exports = parser;
