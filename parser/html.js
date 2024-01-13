const { HttpRequestError, HttpServerError } = require('../errors/errors-index');

// Performs a GET request to the given URL, and retrieves
// whatever HTML data is contained in the response, using axios:
// https://www.npmjs.com/package/axios
module.exports.httpGet = async function(url) {
	const axios = require('axios');

	try {
		const response = await axios.get(url);
		const rawHtml = response.data;
		return rawHtml;
	}
	catch (error) {
		// Server responded to HTTP request with error
		if (error.response) {
			console.error(error.response.data);
			console.error(error.response.headers);
			throw new HttpServerError(error.response.status);
		}
		// HTTP request was made, but received no response
		else if (error.request) {
			console.error(error.request);
			throw new HttpRequestError();
		}
		// An error happened when setting up the request itself
		else {
			throw error;
		}
	}
};

// Turns a raw string of HTML into a node structure using Cheerio:
// https://www.npmjs.com/package/cheerio
module.exports.parseHtml = function(rawHtml) {
	const cheerio = require('cheerio');
	const parsedHtml = cheerio.load(rawHtml, null, false);
	return parsedHtml;
};

// The above two functions in one call; gets and parses an HTML page
module.exports.parseHtmlPage = async function(url) {
	const rawHtml = await module.exports.httpGet(url);
	const parsedHtml = module.exports.parseHtml(rawHtml);
	return parsedHtml;
};
