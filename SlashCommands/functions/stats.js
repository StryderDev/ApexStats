const legends = require('../../gameData/legends.json');
const percent = require('percentagebar');

var onlineEmoji = '<:StatusUp:786800700533112872>';
var matchEmoji = '<:StatusSlow:786800700541501461>';
var offlineEmoji = '<:StatusDown:786800700201238570>';

function findLegendByID(ID) {
	var legend = legends[ID].Name;

	if (legend == 'undefined' || legend == null) return 'Unknown';

	return legend;
}

function checkStatus(online, ingame, partyInMatch, matchLength) {
	var minutes = Math.floor(matchLength / 60);
	var seconds = matchLength - minutes * 60;

	function timePadding(string, pad, length) {
		return (new Array(length + 1).join(pad) + string).slice(-length);
	}

	if (partyInMatch == 1 && matchLength >= 1)
		return `${onlineEmoji} In Match (${timePadding(minutes, '0', 2)}:${timePadding(seconds, '0', 2)})`;

	if (partyInMatch == 0 && matchLength >= 1)
		return `${matchEmoji} In Lobby (${timePadding(minutes, '0', 2)}:${timePadding(seconds, '0', 2)})`;

	if (online == 1) eturn`${matchEmoji} Online [Lobby]`;

	return `${offlineEmoji} Offline`;
}

function getColor(legend) {
	return legends[legend].Color;
}

function getPercent(one, two, allowOver) {
	var percent = Math.floor((one / two) * 100);

	if (allowOver == false) {
		if (percent > 100) return '**100%**';

		return `**${percent.toLocaleString()}%**`;
	}

	return `**${percent.toLocaleString()}%**`;
}

function getPercentageBar(total, current) {
	return percent(total, current, 10, '▓', '░', '[', ']', false);
}

function bpLevel(history, current) {
	if (history === null) return 0;

	if (current > 110) return 110;

	return current;
}

function findRank(name, pos, div) {
	function isMaster(rankName, rankDiv) {
		if (rankName == 'Master') return '';

		return rankDiv;
	}

	if (name == 'Apex Predator') return `<:rankedPredator:787174770730336286> **[#${pos}]** Apex Predator`;

	function findBadge(name) {
		if (name == 'Bronze') return '<:rankedBronze:787174769623302204>';
		if (name == 'Silver') return '<:rankedSilver:787174770424021083>';
		if (name == 'Gold') return '<:rankedGold:787174769942462474>';
		if (name == 'Platinum') return '<:rankedPlatinum:787174770780667944>';
		if (name == 'Diamond') return '<:rankedDiamond:787174769728290816>';
		if (name == 'Master') return '<:rankedMaster:787174770680135680>';

		return '<:rankedBronze:787174769623302204>';
	}

	return `${findBadge(name)} ${name} ${isMaster(name, div)}`;
}

function trackerTitle(id, legend) {
	if (id == '1905735931') return 'No data';

	var tracker = require(`../../gameData/trackerData/${legend}.json`);

	if (tracker[id] == 'undefined' || tracker[id] == null) return id;

	return tracker[id].Name;
}

function trackerValue(id, value) {
	if (id == '1905735931') return '-';

	return value.toLocaleString();
}

module.exports = {
	findLegendByID,
	checkStatus,
	getColor,
	getPercent,
	getPercentageBar,
	bpLevel,
	findRank,
	trackerTitle,
	trackerValue,
};
