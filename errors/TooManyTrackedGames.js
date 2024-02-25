const CustomError = require('./CustomError');
const { isTrueNumber } = require('../utilities/js-utilities');

module.exports = class TooManyTrackedGames extends CustomError {
	constructor(numberOfGames) {
		if (isTrueNumber(numberOfGames) === true) {
			super(`There are already too many games being tracked (${numberOfGames}).`);
		}
		else {
			super('There are already too many games being tracked.');
		}
	}
};
