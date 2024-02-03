const { Storage } = require('../storage/storage-index');

module.exports.notifyGameChannels = async function(gameName, client, message, afterNotification) {
	const gameChannels = await Storage.models.GameTrackedInChannel.findAll({
		where: { name: gameName },
	});

	for (let i = 0; i < gameChannels.length; i++) {
		// The model of a specific channel that's tracking this game
		const gameTrackedInAChannel = gameChannels[i];
		const channelId = gameTrackedInAChannel.channelId;

		// Fetch DiscordJS' channel object. They should technically all be cached,
		// but it's a safer practice to assume that they are not
		const channel = await client.channels.fetch(channelId);

		// Send the notification to the channel
		await channel.send(message);

		if (typeof afterNotification === 'function') {
			await afterNotification(channel);
		}
	}
};

module.exports.fetchChannels = async function(client, channelIds) {
	const channels = [];

	for (const channelId of channelIds) {
		try {
			const channel = await client.channels.fetch(channelId);
			channels.push(channel);
		}
		catch (error) {
			console.error(error);
		}
	}

	return channels;
};
