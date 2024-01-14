const { Storage } = require('../storage/storage-index');
const { GameStatusParser } = require('../parser/parser-index');
const GameStatusSnapshot = require('./GameStatusSnapshot');
const { underline, bold } = require('../formatter/formatter-index');

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

		// Test the db connection, then update turn number and/or timer ms left as needed
		const connection = await Storage.connect();
		const msLeft = parsedGameStatus.timer.toMs();
		await connection.transaction(async () => {
			if (snapshot.hasNoNewTurn === false) {
				await storedGameStatus.update({ turn: snapshot.currentTurn });
			}

			if (msLeft != null && isNaN(msLeft) === false) {
				await storedGameStatus.update({ msLeft });
			}
		});

		// No new turn - no need to do anything. Continue onto the next game
		if (snapshot.hasNoNewTurn === true) {
			const formattedTimeLeft = _formatTimerAnnouncement(parsedGameStatus.timer);
			console.log(`${gameName}: no new turn. ${formattedTimeLeft}.`);
			continue;
		}

		// Iterate through all channels in which this game is tracked and notify them
		await _notifyGameChannels(
			client,
			snapshot,
		);
	}
}

async function _notifyGameChannels(client, snapshot) {
	const gameTrackedInChannels = await Storage.models.GameTrackedInChannel.findAll({
		where: { name: snapshot.gameName },
	});

	for (let i = 0; i < gameTrackedInChannels.length; i++) {
		// The model of a specific channel that's tracking this game
		const gameTrackedInAChannel = gameTrackedInChannels[i];
		const channelId = gameTrackedInAChannel.channelId;

		// Fetch DiscordJS' channel object. They should technically all be cached,
		// but it's a safer practice to assume that they are not
		const channel = await client.channels.fetch(channelId);

		// Send the notification to the channel
		await _notifyGameChannel(channel, snapshot);
	}
}

async function _notifyGameChannel(channel, snapshot) {
	if (snapshot.hasNewTurn === true) {
		return announceNewTurn(channel, snapshot);
	}
	else if (snapshot.hasRollback === true) {
		return announceRollback(channel, snapshot);
	}
}

async function announceNewTurn(channel, snapshot) {
	const gameName = snapshot.gameName;
	const turn = snapshot.currentTurn;
	const formattedTimer = _formatTimerAnnouncement(snapshot.currentTimer);
	const str = `${underline(bold(gameName))}\nNew turn ${turn}\n${formattedTimer}.`;
	return channel.send(str);
}

async function announceRollback(channel, snapshot) {
	const gameName = snapshot.gameName;
	const turn = snapshot.currentTurn;
	const formattedTimer = _formatTimerAnnouncement(snapshot.currentTimer);
	const str = `${underline(bold(gameName))}\nRollbacked to turn ${turn}\n${formattedTimer}.`;
	return channel.send(str);
}

function _formatTimerAnnouncement(timer) {
	if (timer.isNullTimer === true) {
		return 'No timer set';
	}

	return `${timer.toReadableString()} left`;
}
