const customEvents = require('../custom-events');
const { underline, bold, formatTimerAnnouncement } = require('../../formatter/formatter-index');
const { notifyGameChannels } = require('../../utils/utils-index');

module.exports = {
	name: customEvents.ROLLBACK_TURN,

	async execute(client, gameStatusSnapshot) {
		return _announceRollback(client, gameStatusSnapshot);
	},
};

async function _announceRollback(client, snapshot) {
	const gameName = snapshot.gameName;
	const turn = snapshot.currentTurn;
	const formattedTimer = formatTimerAnnouncement(snapshot.currentTimer);
	const message = `${underline(bold(gameName))}\nRollbacked to turn ${turn}\n${formattedTimer}.`;
	return notifyGameChannels(gameName, client, message);
}
