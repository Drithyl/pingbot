const markdown = require('./markdown');

// Main object that will be exported, gathering
// all functions from all other parser files
const formatter = {
	...markdown,
};

module.exports = formatter;
