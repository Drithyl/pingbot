const HttpRequestError = require('./HttpRequestError');
const HttpServerError = require('./HttpServerError');
const MissingHtmlError = require('./MissingHtmlError');
const UnexpectedHtmlError = require('./UnexpectedHtmlError');

// Main object that will be exported, gathering
// all custom error types from the other files
const errors = {
	HttpRequestError,
	HttpServerError,
	MissingHtmlError,
	UnexpectedHtmlError,
};

module.exports = errors;
