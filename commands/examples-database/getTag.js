const { SlashCommandBuilder } = require('discord.js');
const { models } = require('../../storage/storage-index');

// For more information:
// https://discordjs.guide/sequelize/#why-use-an-orm
module.exports = {
	data: new SlashCommandBuilder()
		.setName('gettag')
		.setDescription('Fetch a tag from the database!')
		.addStringOption(option =>
			option.setName('name')
				.setDescription('The name of the tag to fetch')
				.setRequired(true)),

	async execute(interaction) {
		const tagName = interaction.options.getString('name');

		try {
			// In SQL, this is equivalent to:
			// SELECT * FROM TagsExample WHERE name = 'tagName' LIMIT 1;
			const tag = await models.TagsExample.findOne({ where: { name: tagName } });

			if (tag != null) {
				// In SQL, this is equivalent to:
				// UPDATE TagsExample SET usage_count = usage_count + 1 WHERE name = 'tagName';
				tag.increment('usage_count');
				return interaction.reply(tag.get('description'));
			}

			return interaction.reply(`Could not find tag: ${tagName}`);
		}
		catch (error) {
			console.error(error);
			return interaction.reply('Something went wrong with fetching a tag.');
		}
	},
};
