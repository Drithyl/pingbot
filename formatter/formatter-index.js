const dominions = require('./dominions');
const markdown = require('./markdown');

// Main object that will be exported, gathering
// all functions from all other parser files
const formatter = {
	...dominions,
	...markdown,
};

module.exports = formatter;
