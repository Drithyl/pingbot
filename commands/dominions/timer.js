const { SlashCommandBuilder } = require('discord.js');
const { GameStatus } = require('../../parser/parser-index');
const { HttpRequestError, HttpServerError, MissingHtmlError } = require('../../errors/errors-index');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('timer')
		.setDescription('Fetch the timer of an ongoing lobby game')
		.addStringOption(option =>
			option.setName('name')
				.setDescription('The name of the lobby game')
				.setRequired(true)),

	async execute(interaction) {
		const gameName = interaction.options.getString('name');

		try {
			// Fetch the game's HTML status page and parse it into an object
			const newGameStatus = await GameStatus.parseGameStatus(gameName);
			const timer = newGameStatus.timer;

			// If the game is in the pretender submission phase, there will be no timer
			if (newGameStatus.isBeingSetUp === true) {
				return interaction.reply('The game is being set up and hasn\'t started yet');
			}

			// Notify of the timer in the channel with proper formatting
			return interaction.reply(`Turn ${newGameStatus.turn}\n${_formatTimerAnnouncement(timer)}.`);
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
			return interaction.reply('Something went wrong when fetching the timer.');
		}
	},
};

// Checks whether there's no timer at all, or whether to format one
function _formatTimerAnnouncement(timer) {
	if (timer.isNullTimer === true) {
		return 'No timer set';
	}

	return `${timer.toReadableString()} left`;
}
