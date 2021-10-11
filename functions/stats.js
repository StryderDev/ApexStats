const legends = require('../data/legends.json');

function findLegendByID(id) {
	const legend = legends[id];

	if (!legend) return 'Unknown';

	return legend.Name;
}

function userStatus(online, ingame, party, length) {
	return ':white_small_square: Unknown';
}

function BPLevel(current, season) {
	if (!season) {
		if (current > 110) return '110';

		return current;
	}

	if (season > 110) return '110';

	return season;
}

function userRank(name, division, pos) {
	if (name == 'Apex Predator') return `**[#${pos}] Apex Predator**`;

	return `${name} ${division}`;
}

function trackerTitle(id, legend) {
	const tracker = require(`../../data/trackers/${legend}.json`);

	if (id == '1905735931') return 'No Data';

	if (!tracker || !tracker[id]) return id.toString();

	return tracker[id]['Name'];
}

function trackerValue(id, value) {
	if (id == '1905735931') return '-';

	return value.toLocaleString();
}

module.exports = { findLegendByID, userStatus, BPLevel, userRank, trackerTitle, trackerValue };
