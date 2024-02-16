module.exports = Object.freeze({
	MS_IN_A_DAY: 86400000,
	MS_IN_AN_HOUR: 3600000,
	MS_IN_A_MINUTE: 60000,
	TIMER_DIFFERENCE_TOLERANCE: parseInt(process.env.MS_TO_UPDATE_GAME_STATUS) + 30000,
	LOBBY_GAME_BASE_URL: 'http://ulm.illwinter.com/dom6/server/',
});
