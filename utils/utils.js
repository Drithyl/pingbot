// The string.match() method allows using groups in regular expressions,
// and will return the grouped parameters in the resulting array after the
// first element that returns the whole matched string. This method faciliates
// the task of specifically matching for one group, and returning that one
// group, or otherwise null if that group isn't found.
module.exports.matchFirstGroup = function(string, matchRegex) {
	const match = string.match(matchRegex);

	// If no match, or if the returned array contains no elements
	// or only the whole matched string, without any group results,
	// then the group of the regex failed to match anything
	if (match == null || match.length <= 1) {
		return null;
	}

	return match[1];
};