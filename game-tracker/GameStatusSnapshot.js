const { msToDays, isMoreThan, isLessOrEqualTo } = require('../utils/utils-index');
const constants = require('../utils/constants');

module.exports = class GameStatusSnapshot {
	/**
	 * Encapsulates the current snapshot between the previously known game status and the current one.
	 * @param {Model} gameStatusModel - a specific game status Model
	 * @param {GameStatusParser} currentGameStatus - the current game status parsed from the Illwinter page
	 */
	constructor(gameStatusModel, currentGameStatus) {
		this.gameName = gameStatusModel.name;
		this.prevKnownTurn = gameStatusModel.turn;
		this.currentTurn = currentGameStatus.turn;
		this.hasNewTurn = this.currentTurn > this.prevKnownTurn;
		this.hasRollback = this.currentTurn < this.prevKnownTurn;
		this.hasNoNewTurn = this.currentTurn === this.prevKnownTurn;
		this.isBeingSetUp = this.currentTurn === 0;
		this.prevKnownMsLeft = gameStatusModel.msLeft;
		this.currentTimer = currentGameStatus.timer;
		this.isPreviousTimerAboveLastHour = isMoreThan(msToDays(this.prevKnownMsLeft), constants.MS_IN_AN_HOUR);
		this.isCurrentTimerBelowLastHour = isLessOrEqualTo(this.currentTimer.toMs(), constants.MS_IN_AN_HOUR);
		this.hasLessThanAnHourLeft = this.isPreviousTimerAboveLastHour === true && this.isCurrentTimerBelowLastHour;
	}
};
