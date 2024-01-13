const UnexpectedHtmlError = require('./CustomError');

module.exports = class MissingHtmlError extends UnexpectedHtmlError {
	constructor(missingData, parsedData) {
		super(`Parsed HTML text does not contain the following data: ${missingData}`);
		this.missingData = missingData;
		this.parsedData = parsedData;
	}
};