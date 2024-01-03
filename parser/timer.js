// Dominions 6 lobby games expose their timer on the header of the HTML table.
// The header HTML text looks like the following string when the timer is enabled:
// 		myGameName, turn 1 (time left: 5 hours and 4 minutes)
// Or like so if there is no timer:
// 		myGameName, turn 61
module.exports.parseTimer = function(tableHeaderText) {
	const { matchFirstGroup } = require('../utils/utils');
	const gameNameRegex = /(\w+),.+/;
	const turnNumberRegex = /turn\s+(\d+)/;
	const daysLeftRegex = /(\d+)\s+days/;
	const hoursLeftRegex = /(\d+)\s+hours/;
	const minutesLeftRegex = /(\d+)\s+minutes/;

	// Extract each data individually. We could use a single match call for all data, but
	// because some of that data might be missing from the header, it would be impossible
	// to predict the length of the returning array and the order of the elements in it.
	// The matchFirstGroup() utility also makes it easier to get the data group or null.
	const gameName = matchFirstGroup(tableHeaderText, gameNameRegex);
	const turnNumber = matchFirstGroup(tableHeaderText, turnNumberRegex);
	const daysLeft = matchFirstGroup(tableHeaderText, daysLeftRegex);
	const hoursLeft = matchFirstGroup(tableHeaderText, hoursLeftRegex);
	const minutesLeft = matchFirstGroup(tableHeaderText, minutesLeftRegex);

	// We expect the header to at least always display the game name
	if (gameName == null) {
		throw new Error(`Table header text provided does not contain a game name: '${tableHeaderText}'`);
	}
	// We expect the header to at least always display the game's turn number
	else if (turnNumber == null) {
		throw new Error(`Table header text provided does not contain a turn number: '${tableHeaderText}'`);
	}

	// Return all relevant values
	return { gameName, turnNumber, daysLeft, hoursLeft, minutesLeft };
};
