const Sequelize = require('sequelize');

// This model uses a composite unique key. This means that
// two entries with both the same name and channel id cannot
// exist, but entries with the same name but a different
// channel id can co-exist (and vice versa). This is achieved
// by giving the 'unique' property of two fields the same value
module.exports = {
	name: 'GameTrackedInChannel',
	columns: {
		name: {
			type: Sequelize.STRING,
			unique: 'compositeIndex',
			allowNull: false,
			validate: {
				is: /^\w{3,32}$/,
			},
		},
		channelId: {
			type: Sequelize.STRING,
			unique: 'compositeIndex',
			// Discord IDs are strings of 18 digits
			allowNull: false,
			validate: {
				is: /^\d{18}$/,
			},
		},
		guildId: {
			type: Sequelize.STRING,
			allowNull: false,
			validate: {
				is: /^\d{18}$/,
			},
		},
		wasTurnAnnounced: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
		},
		wasLastHourAnnounced: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
		},
	},
};