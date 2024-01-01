const { SlashCommandBuilder } = require('discord.js');
const { models } = require('../../storage/storage-index');

// For more information:
// https://discordjs.guide/sequelize/#why-use-an-orm
module.exports = {
	data: new SlashCommandBuilder()
		.setName('edittag')
		.setDescription('Edit a tag in the database!')
		.addStringOption(option =>
			option.setName('name')
				.setDescription('The new name for the tag being edited')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('description')
				.setDescription('The new description for the tag being edited')),

	async execute(interaction) {
		const tagName = interaction.options.getString('name');
		const tagDescription = interaction.options.getString('description') ?? 'No description provided';

		try {
			// In SQL, this is equivalent to:
			// UPDATE TagsExample (description) values (?) WHERE name='?';
			const affectedRows = await models.TagsExample.update({ description: tagDescription }, { where: { name: tagName } });

			if (affectedRows > 0) {
				return interaction.reply(`Tag ${tagName} was edited.`);
			}

			return interaction.reply(`Could not find a tag with name ${tagName}.`);
		}
		catch (error) {
			console.error(error);
			return interaction.reply('Something went wrong with editing a tag.');
		}
	},
};
