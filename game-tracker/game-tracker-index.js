const { Storage } = require('../storage/storage-index');
const { GameStatusParser } = require('../parser/parser-index');
const GameStatusSnapshot = require('./GameStatusSnapshot');
const { isTrueNumber } = require('../utils/utils-index');
const GameStatusSnapshotProcessor = require('./GameStatusSnapshotProcessor');

let trackingIntervalId;

module.exports.resumeGameTracking = function(client) {
	trackingIntervalId = setInterval(checkGameStatus, process.env.MS_TO_UPDATE_GAME_STATUS, client);
};

module.exports.pauseGameTracking = function() {
	clearInterval(trackingIntervalId);
};

async function checkGameStatus(client) {
	const gameStatuses = await Storage.models.GameStatus.findAll();

	// Iterate through all the game status records we have to update them
	for (let i = 0; i < gameStatuses.length; i++) {
		const storedGameStatus = gameStatuses[i];
		const gameName = storedGameStatus.name;

		// Parse the current status of the game on the webpage
		const parsedGameStatus = await GameStatusParser.parse(gameName);

		// Create a snapshot that compares the last stored model and the current parsed status
		const snapshot = new GameStatusSnapshot(storedGameStatus, parsedGameStatus);

		// An error occurred while trying to parse the updated game status
		if (parsedGameStatus.error) {
			console.log(`${gameName}: ${parsedGameStatus.error.name} error when trying to update status - ${parsedGameStatus.error.message}`);
			console.log(parsedGameStatus.error.stack);
			continue;
		}

		// Updates the record of the status of this game, if needed
		await _updateGameStatusRecord(storedGameStatus, snapshot);

		// Decides if a game event has occurred that needs to be emitted
		await GameStatusSnapshotProcessor.processStatusSnapshot(snapshot, client);
	}
}

async function _updateGameStatusRecord(storedGameStatus, snapshot) {
	// Test the db connection
	const connection = await Storage.connect();
	const msLeft = snapshot.currentTimer.toMs();

	// Update turn number and/or timer ms left as needed
	await connection.transaction(async () => {
		if (snapshot.hasNoNewTurn === false) {
			await storedGameStatus.update({ turn: snapshot.currentTurn });
		}

		if (isTrueNumber(msLeft) === true) {
			await storedGameStatus.update({ msLeft });
		}
	});
}
