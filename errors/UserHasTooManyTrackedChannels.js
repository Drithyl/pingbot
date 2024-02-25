const CustomError = require('./CustomError');
const { isTrueNumber } = require('../utilities/js-utilities');

module.exports = class UserHasTooManyTrackedChannels extends CustomError {
	constructor(numberOfChannels) {
		if (isTrueNumber(numberOfChannels) === true) {
			super(`User has too many tracking channels (${numberOfChannels}).`);
		}
		else {
			super('User has too many tracking channels.');
		}
	}
};
