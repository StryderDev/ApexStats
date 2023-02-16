const { Emotes } = require('../data/utilities.json');

function getEmote(status) {
	if (status == 'UP') return Emotes.ServerStatus.Online;
	if (status == 'SLOW') return Emotes.ServerStatus.Slow;
	if (status == 'DOWN' || status == 'OVERLOADED') return Emotes.ServerStatus.Down;
}

function statusLayout(type) {
	return `${getEmote(type['US-East']['Status'])} **US East** ${type['US-East']['ResponseTime']}ms
    ${getEmote(type['US-Central']['Status'])} **US Central** ${type['US-Central']['ResponseTime']}ms
    ${getEmote(type['US-West']['Status'])} **US West** ${type['US-West']['ResponseTime']}ms
    ${getEmote(type['EU-East']['Status'])} **EU East** ${type['EU-East']['ResponseTime']}ms
    ${getEmote(type['EU-West']['Status'])} **EU West** ${type['EU-West']['ResponseTime']}ms
    ${getEmote(type['SouthAmerica']['Status'])} **South America** ${type['SouthAmerica']['ResponseTime']}ms
    ${getEmote(type['Asia']['Status'])} **Asia** ${type['Asia']['ResponseTime']}ms`;
}

function statusCount(status) {
	var count = 0;

	if (status['US-East'].Status != 'UP') count += 1;
	if (status['US-Central'].Status != 'UP') count += 1;
	if (status['US-West'].Status != 'UP') count += 1;
	if (status['EU-East'].Status != 'UP') count += 1;
	if (status['EU-West'].Status != 'UP') count += 1;
	if (status['SouthAmerica'].Status != 'UP') count += 1;
	if (status['Asia'].Status != 'UP') count += 1;

	return count;
}

function statusColor(count) {
	if (count <= 4) return '43B581';
	if (count <= 10) return 'FAA61A';

	return 'F04747';
}

module.exports = { statusLayout, statusCount, statusColor };
