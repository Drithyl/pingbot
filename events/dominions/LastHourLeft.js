const customEvents = require('../custom-events');
const { bold } = require('../../formatter/formatter-index');

module.exports = {
	name: customEvents.LAST_HOUR_LEFT,

	async execute(client, gameStatusSnapshot, eventMessage) {
		const announcementString = _getAnnouncementString();
		eventMessage.addMessage(announcementString);
	},
};

function _getAnnouncementString() {
	return `${bold('Less than an hour left for next turn!')}`;
}
