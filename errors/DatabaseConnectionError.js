const CustomError = require('./CustomError');

module.exports = class DatabaseConnectionError extends CustomError {
	constructor() {
		super('Unable to connect to the database');
	}
};
