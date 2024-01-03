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
		console.error(error);
		throw error;
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
	try {
		const rawHtml = await module.exports.httpGet(url);
		const parsedHtml = module.exports.parseHtml(rawHtml);
		return parsedHtml;
	}
	catch (error) {
		return null;
	}
};
