const constants = require('../utilities/constants');

module.exports.TimerDifference = class TimerDifference {
	/**
	 * Uses a GameStatusSnapshot to determine whether the timer has been changed or not.
	 * If the difference between the previous timer and the current one significantly
	 * deviates from the time between the last check and now, we can assume it has been changed.
	 * @param {GameStatusSnapshot} gameStatusSnapshot - the current game status snapshot
	 */
	constructor(gameStatusSnapshot) {
		this.now = new Date();
		this.timerLastCheckedAt = new Date(gameStatusSnapshot.lastChecked);

		this.prevKnownMsLeft = gameStatusSnapshot.prevKnownMsLeft;
		this.currentMsLeft = gameStatusSnapshot.currentTimer.toMs();

		this.timerDifferenceInMs = this.calculate();
		this.dateDifferenceInMs = this.now - this.timerLastCheckedAt;
		this.deviationInMs = this.timerDifferenceInMs - this.dateDifferenceInMs;
	}

	calculate() {
		const prevMs = (this.prevKnownMsLeft != null) ? this.prevKnownMsLeft : 0;
		const currMs = (this.currentMsLeft != null) ? this.currentMsLeft : 0;

		return prevMs - currMs;
	}

	wasPaused() {
		return this.prevKnownMsLeft != null && this.currentMsLeft == null;
	}

	wasNewTimerSet() {
		return this.prevKnownMsLeft == null && this.currentMsLeft != null;
	}

	didTimerChange() {
		if (this.wasPaused === true || this.wasNewTimerSet === true) {
			return false;
		}

		// Timer difference compared to date difference is within expected boundaries
		if (Math.abs(this.deviationInMs) < constants.TIMER_DIFFERENCE_TOLERANCE) {
			return false;
		}

		return true;
	}

	wasDecreased() {
		if (this.didTimerChange() === false) {
			return false;
		}

		return this.timerDifferenceInMs > 0;
	}

	wasIncreased() {
		if (this.didTimerChange() === false) {
			return false;
		}

		return this.timerDifferenceInMs < 0;
	}
};
