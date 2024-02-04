const constants = require('../utils/constants');
const { EmbedBuilder } = require('discord.js');
const { formatTimerAnnouncement } = require('../formatter/formatter-index');

module.exports = class EventMessage {
	constructor(gameStatusSnapshot) {
		this.snapshot = gameStatusSnapshot;
		this.gameName = gameStatusSnapshot.gameName;
		this.turn = gameStatusSnapshot.currentTurn;
		this.addedLines = [];
	}

	addMessage(messageText) {
		if (messageText != null && /\S+/.test(messageText) === true) {
			this.addedLines.push(messageText);
		}
	}

	hasMessages() {
		return this.addedLines.length > 0;
	}

	getMessage() {
		return _buildEmbedMessage(this.snapshot, this.addedLines);
	}
};

function _buildEmbedMessage(snapshot, addedMessages) {
	const gameName = snapshot.gameName;
	const formattedTimer = formatTimerAnnouncement(snapshot.currentTimer);
	let description = `Turn ${snapshot.currentTurn}\n${formattedTimer}\n\n`;

	addedMessages.forEach((message) => description += `${message}\n`);

	return new EmbedBuilder()
		.setColor(0x0099FF)
		.setTitle(`Game Status: ${gameName}`)
		.setURL(`${constants.LOBBY_GAME_BASE_URL}${gameName}.html`)
		.setDescription(description);
}
