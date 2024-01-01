const { SlashCommandBuilder } = require('discord.js');
const { models } = require('../../storage/storage-index');

// For more information:
// https://discordjs.guide/sequelize/#why-use-an-orm
module.exports = {
	data: new SlashCommandBuilder()
		.setName('taglist')
		.setDescription('Fetch a list of all the created tags on the database!'),

	async execute(interaction) {
		try {
			// In SQL, this is equivalent to:
			// SELECT name FROM TagsExample;
			const tagList = await models.TagsExample.findAll({ attributes: ['name'] });
			const tagString = tagList.map(t => t.name).join(', ') || 'No tags set.';

			return interaction.reply(`List of tags: ${tagString}`);
		}
		catch (error) {
			console.error(error);
			return interaction.reply('Something went wrong with listing all tags.');
		}
	},
};
