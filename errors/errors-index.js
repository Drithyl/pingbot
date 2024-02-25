const ChannelAlreadyTrackingGame = require('./ChannelAlreadyTrackingGame');
const HttpRequestError = require('./HttpRequestError');
const HttpServerError = require('./HttpServerError');
const MissingHtmlError = require('./MissingHtmlError');
const TooManyChannelsTrackingGame = require('./TooManyChannelsTrackingGame');
const TooManyTrackedGames = require('./TooManyTrackedGames');
const UnexpectedHtmlError = require('./UnexpectedHtmlError');
const UserHasTooManyTrackedChannels = require('./UserHasTooManyTrackedChannels');

// Main object that will be exported, gathering
// all custom error types from the other files
const errors = {
	ChannelAlreadyTrackingGame,
	HttpRequestError,
	HttpServerError,
	MissingHtmlError,
	TooManyChannelsTrackingGame,
	TooManyTrackedGames,
	UnexpectedHtmlError,
	UserHasTooManyTrackedChannels,
};

module.exports = errors;
