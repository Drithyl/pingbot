const { SlashCommandBuilder } = require('discord.js');
const { parseDominionsStatusTableHeaderText, parseTimer } = require('../../parser/parser-index');

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
			// Parse the text inside the header of the game's HTML status table
			const tableHeaderText = await parseDominionsStatusTableHeaderText(gameName);

			// Extract the relevant data from the header of the table
			const { turnNumber, daysLeft, hoursLeft, minutesLeft } = parseTimer(tableHeaderText);
			const baseTimerString = `Turn ${turnNumber}`;

			// No timer set if the header does not contain hours or minutes
			if (daysLeft == null && hoursLeft == null && minutesLeft == null) {
				return interaction.reply(`${baseTimerString}\nNo timer set.`);
			}
			// Otherwise format the timer into a readable string and send it
			else {
				const formattedTimer = _formatTimer(daysLeft, hoursLeft, minutesLeft);
				return interaction.reply(`${baseTimerString}\n${formattedTimer} left.`);
			}
		}
		catch (error) {
			console.error(error);
			return interaction.reply('Something went wrong when fetching the timer.');
		}
	},
};

function _formatTimer(days, hours, minutes) {
	let formattedTimer = '';

	if (days != null) {
		formattedTimer += `${days} days, `;
	}

	if (hours != null) {
		formattedTimer += `${hours} hours, `;
	}

	if (minutes != null) {
		formattedTimer += `${minutes} minutes`;
	}
	// If there are no minutes, the timer format will have a
	// stranded comma at the end, so remove it
	else {
		formattedTimer = formattedTimer.replace(/,\s*$/, '');
	}


	return formattedTimer;
}