const CustomError = require('./CustomError');

const HTTP_RESPONSE_ERROR_CODES = {
	500: 'Internal Server Error',
	501: 'Not Implemented',
	502: 'Bad Gateway',
	503: 'Service Unavailable',
	504: 'Gateway Timeout',
	505: 'HTTP Version Not Supported',
	506: 'Variant Also Negotiates',
	507: 'Insufficient Storage',
	508: 'Loop Detected',
	510: 'Not Extended',
	511: 'Network Authentication Required',
};

module.exports = class HttpServerError extends CustomError {
	constructor(httpErrorCode) {
		super(`Server responded with HTTP error code ${httpErrorCode} (${HTTP_RESPONSE_ERROR_CODES[httpErrorCode]})`);
		this.code = httpErrorCode;
	}
};
