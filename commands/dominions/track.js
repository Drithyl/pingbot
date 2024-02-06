const { SlashCommandBuilder } = require('discord.js');
const { Storage } = require('../../storage/storage-index');
const { GameStatusParser } = require('../../parser/parser-index');
const { HttpRequestError, HttpServerError, MissingHtmlError } = require('../../errors/errors-index');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('track')
		.setDescription('Keep track of a Dominions 6 lobby game in this channel')
		.addStringOption(option =>
			option.setName('name')
				.setDescription('The name of the lobby game')
				.setRequired(true)),

	async execute(interaction) {
		const models = Storage.models;
		const channelId = interaction.channelId;
		const gameName = interaction.options.getString('name');
		const guildId = interaction.guildId;

		try {
			const numberOfGamesBeingTracked = await models.GameStatus.count();
			const numberOfChannelsTrackingGame = await models.GameTrackedInChannel.count({ where: { name: gameName } });
			const gameTrackedInChannel = await models.GameTrackedInChannel.findOne({ where: { name: gameName, channelId } });

			if (numberOfGamesBeingTracked >= +process.env.MAX_TRACKED_GAMES) {
				return interaction.reply(`There are already too many games being tracked (${numberOfGamesBeingTracked})`);
			}

			if (numberOfChannelsTrackingGame >= +process.env.MAX_CHANNELS_FOR_TRACKED_GAME) {
				return interaction.reply(`This game is already being tracked in too many channels (${numberOfChannelsTrackingGame}).`);
			}

			// If model for this game and channel pair exists, then it's already tracked
			if (gameTrackedInChannel != null) {
				return interaction.reply('The game is already being tracked in this channel.');
			}

			// Get the model for this game, if it exists
			const storedGameStatus = await models.GameStatus.findOne({ where: { name: gameName } });

			// Parse the current game status from the webpage
			const parsedGameStatus = GameStatusParser.parse(gameName);

			// Create a model for our game status if one doesn't already exist
			// All channel/game pairs will pull the status info from this record
			if (storedGameStatus == null) {
				await models.GameStatus.create({
					name: gameName,
					turn: parsedGameStatus.turn,
				});
			}

			// Create a model for our game/channel tracking pair
			await models.GameTrackedInChannel.create({
				name: gameName,
				channelId,
				guildId,
			});

			return interaction.reply(`The game ${gameName} is now being tracked on this channel.`);
		}
		catch (error) {
			if (error.name === HttpServerError.name) {
				if (error.response.status === 404) {
					return interaction.reply('The game was not found on the server. Are you sure the name is correct?');
				}
				return interaction.reply(`The server returned an error: ${error.code}`);
			}
			else if (error.name === HttpRequestError.name) {
				return interaction.reply('The request received no answer from the server.');
			}
			else if (error.name === MissingHtmlError.name) {
				return interaction.reply('The timer data could not be found on the game\'s status page.');
			}

			console.error(error);
			return interaction.reply('Something went wrong when trying to track this game.');
		}
	},
};
