module.exports.formatTimerAnnouncement = function(timer) {
	if (timer.isNullTimer === true) {
		return 'No timer set';
	}

	return `${timer.toReadableString()} left`;
};
