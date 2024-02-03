const Sequelize = require('sequelize');

module.exports = {
	name: 'GameStatus',
	columns: {
		name: {
			type: Sequelize.STRING,
			unique: true,
			allowNull: false,
			validate: {
				is: /^\w{3,32}$/,
			},
		},
		turn: {
			type: Sequelize.TINYINT,
			allowNull: false,
			defaultValue: 0,
			validate: {
				min: 0,
				max: 999,
			},
		},
		lastTurn: {
			type: Sequelize.TINYINT,
			allowNull: false,
			defaultValue: 0,
			validate: {
				min: 0,
				max: 999,
			},
		},
		msLeft: {
			type: Sequelize.INTEGER,
			allowNull: true,
			validate: {
				min: 0,
			},
		},
	},
};
