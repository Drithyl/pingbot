const { SlashCommandBuilder } = require('discord.js');
const { models } = require('../../storage/storage-index');

// For more information:
// https://discordjs.guide/sequelize/#why-use-an-orm
module.exports = {
	data: new SlashCommandBuilder()
		.setName('deletetag')
		.setDescription('Delete a tag on the database!')
		.addStringOption(option =>
			option.setName('name')
				.setDescription('The name of the tag to delete')
				.setRequired(true)),

	async execute(interaction) {
		try {
			const tagName = interaction.options.getString('name');

			// In SQL, this is equivalent to:
			// DELETE from TagsExample WHERE name = ?;
			const rowCount = await models.TagsExample.destroy({ where: { name: tagName } });

			if (!rowCount) {
				return interaction.reply('That tag doesn\'t exist.');
			}

			return interaction.reply('Tag deleted.');
		}
		catch (error) {
			console.error(error);
			return interaction.reply('Something went wrong with deleting a tag.');
		}
	},
};
