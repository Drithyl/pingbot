const CustomError = require('./CustomError');

module.exports = class HttpRequestError extends CustomError {
	constructor() {
		super('HTTP request was made but received no answer.');
	}
};