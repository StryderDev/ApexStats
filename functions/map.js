const { isPlural } = require('./misc.js');

function checkAmount(amount) {
	if (amount == null || amount == undefined) return 1;
	if (amount >= 10) return 10;
	if (amount <= 1) return 1;

	return amount;
}

function getTime(timestamp) {
	var time = Math.floor(Date.now() / 1000);
	var seconds = timestamp - time + 60;

	var days = Math.floor(seconds / (3600 * 24));
	var hours = Math.floor(seconds / 3600) % 24;
	var minutes = Math.floor(seconds / 60) % 60;
	var seconds = Math.floor(seconds) % 60;

	if (days > 0) return `${isPlural(days, 'day')}, ${isPlural(hours, 'hour')}, ${isPlural(minutes, 'minute')}`;

	return `${isPlural(hours, 'hour')}, ${isPlural(minutes, 'minute')}`;
}

function nextMap(map) {
	return map
		.map(x => `**${x.map}**\nStarts in ${getTime(x.timestamp)} and lasts for ${x.duration} minutes.\n\n`)
		.join(``);
}

function mapImage(map) {
	if (map == 'Kings Canyon') return 'KingsCanyon_001';
	if (map == "World's Edge") return 'WorldsEdge_001';
	if (map == 'Olympus') return 'Olympus_001';

	return 'NoMapData';
}

module.exports = { getTime, nextMap, checkAmount, mapImage };
