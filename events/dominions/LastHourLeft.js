const customEvents = require('../custom-events');
const { underline, bold, formatTimerAnnouncement } = require('../../formatter/formatter-index');
const { notifyGameChannels } = require('../../utils/utils-index');

module.exports = {
	name: customEvents.LAST_HOUR_LEFT,

	async execute(client, gameStatusSnapshot) {
		return _announceLastHourLeft(client, gameStatusSnapshot);
	},
};

async function _announceLastHourLeft(client, snapshot) {
	const gameName = snapshot.gameName;
	const turn = snapshot.currentTurn;
	const formattedTimer = formatTimerAnnouncement(snapshot.currentTimer);
	const message = `${underline(bold(gameName))}\nTurn ${turn}\n${formattedTimer}\n\n${bold('Less than an hour left!')}`;
	return notifyGameChannels(gameName, client, message);
}
