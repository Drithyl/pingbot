const customEvents = require('../custom-events');
const { bold } = require('../../formatter/formatter-index');

module.exports = {
	name: customEvents.TIMER_DECREASED,

	async execute(client, gameStatusSnapshot, eventMessage) {
		const announcementString = _getAnnouncementString(gameStatusSnapshot);
		eventMessage.addMessage(announcementString);
	},
};

function _getAnnouncementString(snapshot) {
	return `${bold(`Timer was decreased to ${snapshot.currentTimer.toReadableString()}`)}`;
}
