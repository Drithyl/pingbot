const CustomError = require('./CustomError');
const { isTrueNumber } = require('../utilities/js-utilities');

module.exports = class TooManyChannelsTrackingGame extends CustomError {
	constructor(numberOfChannels) {
		if (isTrueNumber(numberOfChannels) === true) {
			super(`This game is already being tracked in too many channels (${numberOfChannels}).`);
		}
		else {
			super('This game is already being tracked in too many channels.');
		}
	}
};
