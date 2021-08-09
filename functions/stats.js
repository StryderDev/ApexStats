const legends = require('../data/legends.json');

function legendInfo(id, type) {
	var legend = legends[id][type];

	if (legend == undefined || legend == null) return 'Unknown';

	return legend;
}

function rankedTitle(score, name, division, ladderPos) {
	function isMaster(name, div) {
		if (name == 'Master') return '';

		return div;
	}

	if (name == 'Apex Predator') return `**[#${ladderPos}]** Apex Predator (${score.toLocaleString()} RP)`;

	return `${name} ${isMaster(name, division)} (${score.toLocaleString()} RP)`;
}

module.exports = { legendInfo, rankedTitle };
