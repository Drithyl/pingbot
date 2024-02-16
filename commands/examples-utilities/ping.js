const { SlashCommandBuilder } = require('discord.js');

// For more information:
// https://discordjs.guide/creating-your-bot/slash-commands.html#before-you-continue
module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),

	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};
