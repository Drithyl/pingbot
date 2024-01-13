const { models } = require('../storage/storage-index');
const { GameStatus } = require('../parser/parser-index');
const { underline, bold } = require('../formatter/formatter-index');

let trackingIntervalId;

module.exports.resumeGameTracking = function(client) {
	trackingIntervalId = setInterval(checkGameStatus, 60000, client);
};

module.exports.pauseGameTracking = function() {
	clearInterval(trackingIntervalId);
};

async function checkGameStatus(client) {
	const gameStatuses = await models.GameStatus.findAll();

	// Iterate through all the game status records we have to update them
	for (let i = 0; i < gameStatuses.length; i++) {
		const oldgameStatus = gameStatuses[i];
		const gameName = oldgameStatus.name;
		const oldTurn = oldgameStatus.turn;

		const newGameStatus = await GameStatus.parseGameStatus(gameName);
		const updatedTurn = newGameStatus.turn;

		// An error occurred while trying to parse the updated game status
		if (newGameStatus.error) {
			console.log(`${gameName}: ${newGameStatus.error.name} error when trying to update status - ${newGameStatus.error.message}`);
			console.log(newGameStatus.error.stack);
			continue;
		}

		// No new turn - no need to do anything. Continue onto the next game
		if (updatedTurn === oldTurn) {
			const formattedTimeLeft = _formatTimerAnnouncement(newGameStatus.timer);
			console.log(`${gameName}: no new turn. ${formattedTimeLeft}.`);
			continue;
		}


		// Some data that will be used to update the game status and notify channels of the turn change
		const turnDifference = Math.abs(updatedTurn - oldTurn);
		await oldgameStatus.increment('turn', { by: turnDifference });

		// Iterate through all channels in which this game is tracked and notify them
		await _notifyGameChannels(
			client,
			oldgameStatus,
			newGameStatus,
		);
	}
}

async function _notifyGameChannels(client, oldStatusModel, newGameStatus) {
	const gameTrackedInChannels = await models.GameTrackedInChannel.findAll({
		where: { name: oldStatusModel.name },
	});

	for (let i = 0; i < gameTrackedInChannels.length; i++) {
		// The model of a specific channel that's tracking this game
		const gameTrackedInAChannel = gameTrackedInChannels[i];
		const channelId = gameTrackedInAChannel.channelId;

		// Fetch DiscordJS' channel object. They should technically all be cached,
		// but it's a safer practice to assume that they are not
		const channel = await client.channels.fetch(channelId);

		// Send the notification to the channel
		_notifyGameChannel(channel, oldStatusModel, newGameStatus);
	}
}

function _notifyGameChannel(channel, oldStatusModel, newGameStatus) {
	const oldTurn = oldStatusModel.turn;
	const newTurn = newGameStatus.turn;

	if (newTurn > oldTurn) {
		return announceNewTurn(channel, newGameStatus);
	}
	else if (newTurn < oldTurn) {
		return announceRollback(channel, newGameStatus);
	}
}

async function announceNewTurn(channel, newGameStatus) {
	const gameName = newGameStatus.name;
	const turn = newGameStatus.turn;
	const formattedTimer = _formatTimerAnnouncement(newGameStatus.timer);
	const str = `${underline(bold(gameName))}\nNew turn ${turn}\n${formattedTimer}.`;
	return channel.send(str);
}

async function announceRollback(channel, newGameStatus) {
	const gameName = newGameStatus.name;
	const turn = newGameStatus.turn;
	const formattedTimer = _formatTimerAnnouncement(newGameStatus.timer);
	const str = `${underline(bold(gameName))}\nRollbacked to turn ${turn}\n${formattedTimer}.`;
	return channel.send(str);
}

function _formatTimerAnnouncement(timer) {
	if (timer.isNullTimer === true) {
		return 'No timer set';
	}

	return `${timer.toReadableString()} left`;
}
