const html = require('./html');
const dominionsStatus = require('./dominions-status');
const timer = require('./timer');

// Main object that will be exported, gathering
// all functions from all other parser files
const parser = {
	...html,
	...dominionsStatus,
	...timer,
};

module.exports = parser;
