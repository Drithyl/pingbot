const Sequelize = require('sequelize');

module.exports = {
	name: 'TagsExample',
	columns: {
		name: {
			type: Sequelize.STRING,
			unique: true,
		},
		description: Sequelize.TEXT,
		username: Sequelize.STRING,
		usage_count: {
			type: Sequelize.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
	},
};