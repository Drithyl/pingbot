const CustomError = require('./CustomError');

module.exports = class ChannelAlreadyTrackingGame extends CustomError {
	constructor() {
		super('This game is already being tracked in this channel.');
	}
};
