const legends = require("../../gameData/legends.json");

const percent = require("percentagebar");

var onlineEmoji = "<:StatusUp:786800700533112872>";
var matchEmoji = "<:StatusSlow:786800700541501461>";
var offlineEmoji = "<:StatusDown:786800700201238570>";

function findLegendByID(id) {
	var legend = legends[id].Name;

	if (legend == null || legend == "undefined") return "Unknown";

	return legend;
}

function checkStatus(online, ingame) {
	if (online == "1" && ingame == "1") return `${onlineEmoji} In a Match`;

	if (online == "1") return `${matchEmoji} Online [Lobby]`;

	return `${offlineEmoji} Offline`;
}

function setColor(id) {
	return legends[id].Color;
}

function getPercent(one, two, allowOver) {
	var percent = Math.floor((one / two) * 100);

	if (allowOver == false) {
		if (percent > 100) return "**100%**";

		return `**${percent.toLocaleString()}%**`;
	}

	return `**${percent.toLocaleString()}%**`;
}

function getPercentageBar(total, current) {
	return percent(total, current, 10, "▓", "░", "[", "]", false);
}

function findRank(name, pos, div) {
	function isMaster(rankName, rankDiv) {
		if (rankName == "Master") return "";

		return rankDiv;
	}

	if (name == "Apex Predator") return `<:rankedPredator:787174770730336286> **[#${pos}]** Apex Predator`;

	function findBadge(name) {
		if (name == "Bronze") return "<:rankedBronze:787174769623302204>";
		if (name == "Silver") return "<:rankedSilver:787174770424021083>";
		if (name == "Gold") return "<:rankedGold:787174769942462474>";
		if (name == "Platinum") return "<:rankedPlatinum:787174770780667944>";
		if (name == "Diamond") return "<:rankedDiamond:787174769728290816>";
		if (name == "Master") return "<:rankedMaster:787174770680135680>";

		return "<:rankedBronze:787174769623302204>";
	}

	return `${findBadge(name)} ${name} ${isMaster(name, div)}`;
}

module.exports = { findLegendByID, checkStatus, setColor, getPercent, getPercentageBar, findRank };
