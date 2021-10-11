function isPlural(int, text) {
	if (int > 1 || int < 1) return `${int} ${text}s`;

	return `${int} ${text}`;
}

module.exports = { isPlural };
