const { SlashCommandBuilder } = require('discord.js');
const { models } = require('../../storage/storage-index');

// For more information:
// https://discordjs.guide/sequelize/#why-use-an-orm
module.exports = {
	data: new SlashCommandBuilder()
		.setName('taginfo')
		.setDescription('Fetch info on a tag from the database!')
		.addStringOption(option =>
			option.setName('name')
				.setDescription('The name of the tag on which to fetch info')
				.setRequired(true)),

	async execute(interaction) {
		const tagName = interaction.options.getString('name');

		try {
			// In SQL, this is equivalent to:
			// SELECT * FROM TagsExample WHERE name = 'tagName' LIMIT 1;
			const tag = await models.TagsExample.findOne({ where: { name: tagName } });

			if (tag != null) {
				return interaction.reply(`${tagName} was created by ${tag.username} at ${tag.createdAt} and has been used ${tag.usage_count} times.`);
			}

			return interaction.reply(`Could not find tag: ${tagName}`);
		}
		catch (error) {
			console.error(error);
			return interaction.reply('Something went wrong with fetching info on a tag.');
		}
	},
};
