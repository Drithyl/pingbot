const customEvents = require('../custom-events');
const { underline, bold, formatTimerAnnouncement } = require('../../formatter/formatter-index');
const { notifyGameChannels } = require('../../utils/utils-index');

module.exports = {
	name: customEvents.NEW_TURN,

	async execute(client, gameStatusSnapshot) {
		return _announceNewTurn(client, gameStatusSnapshot);
	},
};

async function _announceNewTurn(client, snapshot) {
	const gameName = snapshot.gameName;
	const turn = snapshot.currentTurn;
	const formattedTimer = formatTimerAnnouncement(snapshot.currentTimer);
	const message = `${underline(bold(gameName))}\nNew turn ${turn}\n${formattedTimer}.`;
	return notifyGameChannels(gameName, client, message);
}
