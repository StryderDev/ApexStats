function nextMapLength(minutes, hours) {
	function isPlural(number, word) {
		return number !== 1 ? `${number} ${word}s` : `${number} ${word}`;
	}

	return hours === 0 ? isPlural(minutes, 'minute') : `${isPlural(hours, 'hour')} ${isPlural(minutes, 'minute')}`;
}

module.exports = { nextMapLength };
