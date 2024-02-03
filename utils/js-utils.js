const constants = require('./constants');

// The string.match() method allows using groups in regular expressions,
// and will return the grouped parameters in the resulting array after the
// first element that returns the whole matched string. This method faciliates
// the task of specifically matching for one group, and returning that one
// group, or otherwise null if that group isn't found.
module.exports.matchFirstGroup = function(string, matchRegex) {
	if (typeof string !== 'string') {
		return null;
	}

	const match = string.match(matchRegex);

	// If no match, or if the returned array contains no elements
	// or only the whole matched string, without any group results,
	// then the group of the regex failed to match anything
	if (match == null || match.length <= 1) {
		return null;
	}

	return match[1];
};

module.exports.isLessThan = function(a, b) {
	if (module.exports.isTrueNumber(a) === false) {
		return false;
	}
	else if (module.exports.isTrueNumber(b) === false) {
		return false;
	}
	return a < b;
};

module.exports.isLessOrEqualTo = function(a, b) {
	if (module.exports.isTrueNumber(a) === false) {
		return false;
	}
	else if (module.exports.isTrueNumber(b) === false) {
		return false;
	}
	return a <= b;
};

module.exports.isMoreThan = function(a, b) {
	if (module.exports.isTrueNumber(a) === false) {
		return false;
	}
	else if (module.exports.isTrueNumber(b) === false) {
		return false;
	}
	return a > b;
};

module.exports.isMoreOrEqualTo = function(a, b) {
	if (module.exports.isTrueNumber(a) === false) {
		return false;
	}
	else if (module.exports.isTrueNumber(b) === false) {
		return false;
	}
	return a >= b;
};

module.exports.isTrueNumber = function(number) {
	if (number == null) {
		return false;
	}
	return isNaN(number) === false;
};

module.exports.daysToMs = function daysToMs(days) {
	return days * constants.MS_IN_A_DAY;
};

module.exports.hoursToMs = function hoursToMs(hours) {
	return hours * constants.MS_IN_AN_HOUR;
};

module.exports.minutesToMs = function minutesToMs(minutes) {
	return minutes * constants.MS_IN_A_MINUTE;
};

module.exports.msToDays = function msToDays(ms) {
	return ms / constants.MS_IN_A_DAY;
};

module.exports.msToHours = function msToHours(ms) {
	return ms / constants.MS_IN_AN_HOUR;
};

module.exports.msToMinutes = function msToMinutes(ms) {
	return ms / constants.MS_IN_A_MINUTE;
};
