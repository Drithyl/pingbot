const { matchFirstGroup, daysToMs, hoursToMs, minutesToMs } = require('../utils/utils-index');
const { MissingHtmlError } = require('../errors/errors-index');

// Main class exported, which represents a Dominions timer,
// but could represent a more general timer as well
class Timer {
	constructor(turn, daysLeft, hoursLeft, minutesLeft) {
		this.turn = turn;
		this.daysLeft = daysLeft;
		this.hoursLeft = hoursLeft;
		this.minutesLeft = minutesLeft;
		this.isNullTimer = true;
		this.isGameBeingSetUp = false;


		// If at least one of the times left is a number,
		// then the timer isn't entirely null
		if (isNaN(this.daysLeft) === false) {
			this.isNullTimer = false;
		}
		else if (isNaN(this.hoursLeft) === false) {
			this.isNullTimer = false;
		}
		else if (isNaN(this.minutesLeft) === false) {
			this.isNullTimer = false;
		}

		// If the turn number given is specifically 0, then
		// we think of it as being in the pretender submission lobby
		if (turn === 0) {
			this.isGameBeingSetUp = true;
		}
	}

	// Parse an input into a Timer object
	static parseTimer(input) {
		try {
			if (typeof input === 'string') {
				return _parseTimerFromText(input);
			}
		}

		catch (error) {
			console.error(error);
			return new Timer();
		}

		return new Timer();
	}

	// Convert to ms left
	toMs() {
		if (this.isNullTimer === true) {
			return null;
		}

		const days = (isNaN(this.daysLeft)) ? 0 : this.daysLeft;
		const hours = (isNaN(this.hoursLeft)) ? 0 : this.hoursLeft;
		const minutes = (isNaN(this.minutesLeft)) ? 0 : this.minutesLeft;

		return daysToMs(days) + hoursToMs(hours) + minutesToMs(minutes);
	}

	// Convert the timer to a comma-separated readable string of text
	toReadableString() {
		let formattedTimer = '';

		if (isNaN(this.daysLeft) === false) {
			formattedTimer += `${this.daysLeft} days, `;
		}

		if (isNaN(this.hoursLeft) === false) {
			formattedTimer += `${this.hoursLeft} hours, `;
		}

		if (isNaN(this.minutesLeft) === false) {
			formattedTimer += `${this.minutesLeft} minutes`;
		}
		// If there are no minutes, the timer format will have a
		// stranded comma at the end, so remove it
		else {
			formattedTimer = formattedTimer.replace(/,\s*$/, '');
		}

		return formattedTimer;
	}
}

module.exports = Timer;

// Dominions 6 lobby games expose their timer on the header of the HTML table.
// The header HTML text looks like the following string when the timer is enabled:
// 		myGameName, turn 1 (time left: 5 hours and 4 minutes)
// Or like so if there is no timer:
// 		myGameName, turn 61
function _parseTimerFromText(text) {
	const gameNameRegex = /(\w+),.+/;
	const turnNumberRegex = /turn\s+(\d+)/;
	const daysLeftRegex = /(\d+)\s+days/;
	const hoursLeftRegex = /(\d+)\s+hours/;
	const minutesLeftRegex = /(\d+)\s+minutes/;
	const parsedTimer = {};

	if (_isGameBeingSetUp(text) === true) {
		parsedTimer.turnNumber = 0;
		return parsedTimer;
	}

	// Extract each data individually. We could use a single match call for all data, but
	// because some of that data might be missing from the header, it would be impossible
	// to predict the length of the returning array and the order of the elements in it.
	// The matchFirstGroup() utility also makes it easier to get the data group or null.
	const gameName = matchFirstGroup(text, gameNameRegex);
	const turnNumber = parseInt(matchFirstGroup(text, turnNumberRegex));
	const daysLeft = parseInt(matchFirstGroup(text, daysLeftRegex));
	const hoursLeft = parseInt(matchFirstGroup(text, hoursLeftRegex));
	const minutesLeft = parseInt(matchFirstGroup(text, minutesLeftRegex));


	// We expect the text to at least always display the game name
	if (gameName == null) {
		throw new MissingHtmlError('Game name', text);
	}
	// We expect the text to at least always display the game's turn number
	else if (turnNumber == null) {
		throw new MissingHtmlError('Turn number', text);
	}

	return new Timer(turnNumber, daysLeft, hoursLeft, minutesLeft);
}

// Parse a game's HTML table's header to check if it's still in pretender submission lobby
function _isGameBeingSetUp(tableHeaderText) {
	const setupMessage = 'Game is being setup';
	return tableHeaderText.includes(setupMessage) === true;
}
