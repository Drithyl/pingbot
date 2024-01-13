const html = require('./html');
const GameStatus = require('./GameStatus');

// Main object that will be exported, gathering
// all functions from all other parser files
const parser = {
	...html,
	GameStatus,
};

module.exports = parser;
