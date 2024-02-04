const customEvents = require('../custom-events');
const { bold } = require('../../formatter/formatter-index');

module.exports = {
	name: customEvents.ROLLBACK_TURN,

	async execute(client, gameStatusSnapshot, eventMessage) {
		const announcementString = _getAnnouncementString(gameStatusSnapshot);
		eventMessage.addMessage(announcementString);
	},
};

function _getAnnouncementString(snapshot) {
	const turn = snapshot.currentTurn;
	return `${bold(`Rollbacked to turn ${turn}`)}`;
}
