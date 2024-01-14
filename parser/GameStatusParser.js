const { parseHtmlPage } = require('./html');
const Timer = require('./Timer');

// Main class exported, which contains all the information
// parsed from a Dominions 6 lobby game's HTML page
module.exports = class GameStatusParser {
	constructor(gameName, htmlRoot) {
		this.name = gameName;
		this.htmlRoot = htmlRoot;

		try {
			const header = _findHeader(htmlRoot);

			this.timer = Timer.parseTimer(header);
			this.turn = this.timer.turn;
			this.isBeingSetUp = this.timer.isGameBeingSetUp;
		}
		catch (error) {
			this.error = error;
		}
	}

	static async parse(gameName) {
		const htmlRoot = await _parseDominionsStatusHTML(gameName);
		return new GameStatusParser(gameName, htmlRoot);
	}
};

// GET and parse the HTML status of a Dominions 6 lobby game
async function _parseDominionsStatusHTML(gameName) {
	// All lobby games expose their status at the URL below
	const dominionsStatusUrl = `http://ulm.illwinter.com/dom6/server/${gameName}.html`;

	// Try to GET the page and parse its HTML into a node structure
	const $ = await parseHtmlPage(dominionsStatusUrl);
	return $;
}

// Try to find the HTML status table's header contents
// within a provided html root (the output of cheerio.load())
function _findHeader(htmlRoot) {
	const tableHeaderText = htmlRoot('td').first().html();
	return tableHeaderText;
}
