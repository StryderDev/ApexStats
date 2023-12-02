function nextMapLength(minutes, hours) {
	function isPlural(number, word) {
		return number !== 1 ? `${number} ${word}s` : `${number} ${word}`;
	}

	if (minutes === 0) return isPlural(hours, 'hour');
	else if (hours === 0) return isPlural(minutes, 'minute');
	else return `${isPlural(hours, 'hour')} ${isPlural(minutes, 'minute')}`;
}

module.exports = { nextMapLength };
