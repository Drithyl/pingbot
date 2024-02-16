const { log } = require('../logger/logger-index');
const customEvents = require('../events/custom-events');
const { notifyGameChannels } = require('../utilities/utilities-index');
const { formatTimerAnnouncement } = require('../formatter/formatter-index');
const EventMessage = require('./EventMessage');

module.exports = class GameStatusSnapshotProcessor {
	/**
	 * Parses a GameStatusSnapshot object and emits the relevant game events, if any,
	 * then notifies the game channels of whatever occurred.
	 * @param {GameStatusSnapshot} snapshot - A game's GameStatusSnapshot object
	 * @param {Client} client - The Discord Client object
	 */
	static async processStatusSnapshot(snapshot, client) {
		const eventMessage = new EventMessage(snapshot);

		// New turn event
		if (snapshot.hasNewTurn === true) {
			_logGameStatus(snapshot, `new turn ${snapshot.currentTurn}`);
			await client.emit(customEvents.NEW_TURN, client, snapshot, eventMessage);
		}
		// Turn rollbacked event
		else if (snapshot.hasRollback === true) {
			_logGameStatus(snapshot, `rollback to turn ${snapshot.currentTurn}`);
			await client.emit(customEvents.ROLLBACK_TURN, client, snapshot, eventMessage);
		}

		// Timer change related events
		if (snapshot.timerDifference.wasPaused() === true) {
			_logGameStatus(snapshot, 'timer was paused');
			await client.emit(customEvents.TIMER_PAUSED, client, snapshot, eventMessage);
		}
		else if (snapshot.timerDifference.wasNewTimerSet() === true) {
			_logGameStatus(snapshot, `timer was set to ${snapshot.currentTimer.toReadableString()}`);
			await client.emit(customEvents.TIMER_SET, client, snapshot, eventMessage);
		}
		else if (snapshot.timerDifference.wasDecreased() === true) {
			_logGameStatus(snapshot, `timer was decreased to ${snapshot.currentTimer.toReadableString()}`);
			await client.emit(customEvents.TIMER_DECREASED, client, snapshot, eventMessage);
		}
		else if (snapshot.timerDifference.wasIncreased() === true) {
			_logGameStatus(snapshot, `timer was increased to ${snapshot.currentTimer.toReadableString()}`);
			await client.emit(customEvents.TIMER_INCREASED, client, snapshot, eventMessage);
		}


		if (snapshot.hasLessThanAnHourLeft === true) {
			_logGameStatus(snapshot, 'less than an hour remains');
			await client.emit(customEvents.LAST_HOUR_LEFT, client, snapshot, eventMessage);
		}

		// No new turn
		else if (snapshot.hasNoNewTurn === true) {
			_logGameStatus(snapshot);
		}


		if (eventMessage.hasMessages() === true) {
			await notifyGameChannels(snapshot.gameName, client, eventMessage.getMessage());
		}
	}
};

function _logGameStatus(snapshot, logStr = '') {
	const formattedTimeLeft = formatTimerAnnouncement(snapshot.currentTimer);
	log(`${snapshot.gameName} - \t${formattedTimeLeft}\t\t ${logStr}`);
}
