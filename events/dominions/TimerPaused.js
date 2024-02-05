const customEvents = require('../custom-events');
const { bold } = require('../../formatter/formatter-index');

module.exports = {
	name: customEvents.TIMER_PAUSED,

	async execute(client, gameStatusSnapshot, eventMessage) {
		const announcementString = _getAnnouncementString();
		eventMessage.addMessage(announcementString);
	},
};

function _getAnnouncementString() {
	return `${bold('Timer was paused!')}`;
}
