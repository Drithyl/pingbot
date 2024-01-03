const { parseHtmlPage } = require('./html');

// GET and parse the HTML table of a Dominions 6 lobby game
module.exports.parseDominionsStatusHTML = async function(gameName) {
	// All lobby games expose their status at the URL below
	const dominionsStatusUrl = `http://ulm.illwinter.com/dom6/server/${gameName}.html`;

	// Try to GET the page and parse its HTML into a node structure
	const $ = await parseHtmlPage(dominionsStatusUrl);

	// If it's null/undefined, either the game doesn't exist, or something else went wrong.
	// It could be the HTTP GET request that errored, or some error during the parsing
	if ($ == null) {
		return;
	}

	return $;
};

// Use the above method to parse the HTML status table and then
// specifically extract the text of the table's header
module.exports.parseDominionsStatusTableHeaderText = async function(gameName) {
	const $ = await module.exports.parseDominionsStatusHTML(gameName);
	const tableHeaderText = $('td').first().html();


	// If the parsed HTML does not contain a table cell, then something is wrong;
	// the status page does not have the format we expected
	if (tableHeaderText == null) {
		throw new Error(`The status page for game ${gameName} does not contain a table!`);
	}

	return tableHeaderText;
};