const legends = require('../data/legends.json');

function legendInfo(id, type) {
	var legend = legends[id][type];

	if (legend == undefined || legend == null) return 'Unknown';

	return legend;
}

function rankedTitle(score, name, division, ladderPos, type) {
	function hasDivision(name, div) {
		if (name == 'Master' || name == 'Unranked') return name;

		return `${name} ${div}`;
	}

	if (name == 'Apex Predator')
		return `**[#${ladderPos}]** Apex Predator\n:small_orange_diamond: ${score.toLocaleString()} ${type}`;

	return `${hasDivision(name, division)}\n:small_orange_diamond: ${score.toLocaleString()} ${type}`;
}

function getBP(history) {
	if (history == null || history.season10 == null) return 0;

	if (history.season > 110) return 110;

	return history.season10;
}

function trackerTitle(tracker, legend) {
	var trackers = require(`../data/trackers/${legend}.json`);

	if (tracker.id == '1905735931') return 'No Data';

	if (trackers[tracker.id] == undefined || trackers[tracker.id] == null) return tracker.id.toString();

	return trackers[tracker.id].Name;
}

function trackerValue(tracker) {
	if (tracker.id == '1905735931') return '-';

	return tracker.value.toLocaleString();
}

module.exports = { legendInfo, rankedTitle, getBP, trackerTitle, trackerValue };
