const { SlashCommandBuilder } = require('discord.js');
const { models } = require('../../storage/storage-index');

// For more information:
// https://discordjs.guide/sequelize/#why-use-an-orm
module.exports = {
	data: new SlashCommandBuilder()
		.setName('addtag')
		.setDescription('Add a tag to the database!')
		.addStringOption(option =>
			option.setName('name')
				.setDescription('The name of the tag being added')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('description')
				.setDescription('The description of the tag being added')),

	async execute(interaction) {
		const tagName = interaction.options.getString('name');
		const tagDescription = interaction.options.getString('description') ?? 'No description provided';

		try {
			// In SQL, this is equivalent to:
			// INSERT INTO TagsExample (name, description, username) values (?, ?, ?);
			const tag = await models.TagsExample.create({
				name: tagName,
				description: tagDescription,
				username: interaction.user.username,
			});

			return interaction.reply(`Tag ${tag.name} added.`);
		}
		catch (error) {
			if (error.name === 'SequelizeUniqueConstraintError') {
				return interaction.reply('That tag already exists.');
			}

			console.error(error);
			return interaction.reply('Something went wrong with adding a tag.');
		}
	},
};
