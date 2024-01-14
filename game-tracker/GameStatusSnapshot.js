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
	}
};
