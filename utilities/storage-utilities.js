const { Storage, models } = require('../storage/storage-index');

module.exports.getNumberOfTrackedChannels = async function(gameName = null) {
	if (typeof gameName === 'string') {
		return models.GameTrackedInChannel.count({ where: { name: gameName } });
	}
	else {
		return models.GameTrackedInChannel.count();
	}
};


module.exports.getNumberOfTrackedChannels = async function(gameName = null) {
	if (typeof gameName === 'string') {
		return models.GameTrackedInChannel.count({ where: { name: gameName } });
	}
	else {
		return models.GameTrackedInChannel.count();
	}
};
