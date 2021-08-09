const legends = require('../data/legends.json');

function legendName(id) {
	var legend = legends[id].Name;

	if (legend == undefined || legend == null) return 'Unknown';

	return legend;
}

function legendColor(id) {
	var legend = legends[id].Color;

	if (legend == undefined || legend == null) return 'Unknown';

	return legend;
}

module.exports = { legendName, legendColor };
