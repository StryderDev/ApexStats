function platformName(name) {
	if (name == 'PS4') return 'PlayStation';
	if (name == 'X1') return 'Xbox';

	return name;
}

function getStatus(status, emotes) {
	const offline = emotes.Offline;
	const online = emotes.Online;
	const inGame = emotes.inGame;

	const seconds = Math.floor(status.matchLength % 60);
	const minutes = Math.floor(status.matchLength / 60);

	if (status.online == 1 && status.ingame == 0) {
		if (status.matchLength != -1) return `${online} Lobby (${minutes}m ${seconds}s)`;

		return `${online} Online (Lobby)`;
	}

	if (status.online == 1 && status.ingame == 1) {
		if (status.matchLength != -1) return `${inGame} In a Match (${minutes}m ${seconds}s)`;

		return `${inGame} In a Match`;
	}

	return `${offline} Offline / Invite Only`;
}

function battlepass(data) {
	if (!data.history.Hunted) return data.level;

	return data.history.Hunted;
}

function rankLayout(type, rank, emote) {
	function showDiv(name, div) {
		if (name == 'Master' || name == 'Apex Predator' || name == 'Unranked') return '';

		return div;
	}

	function showPos(name, pos) {
		if (name == 'Apex Predator') return `**[#${pos}]**`;

		return '';
	}

	return `${emote[rank.name]} ${showPos(rank.name, rank.ladderPos)} ${rank.name} ${showDiv(rank.name, rank.division)}\n${rank.score.toLocaleString()} ${type}`;
}

function trackerName(legend, id, emote) {
	if (id == '1905735931') return 'No Data';

	const legendTrackers = require(`../../../data/trackers/${legend}.json`);
	const globalTrackers = require('../../../data/globalTrackers.json');

	function text(text) {
		return text ? text : '';
	}

	function checkEmote(emote, icons) {
		if (emote != null && emote != 'undefined' && emote.length != 0) return icons[emote];

		return '';
	}

	if (globalTrackers[id] == null || globalTrackers[id] == 'undefined') {
		// If the tracker ID doesn't exist in the global trackers file, check the legend trackers file
		if (legendTrackers[id] == null || legendTrackers[id] == 'undefined') {
			// If the tracker ID doesn't exist in the legend trackers file, just return the ID of the tracker
			return id;
		} else {
			// The tracker ID exists in the legend trackers file
			return `${checkEmote(legendTrackers[id].Emote, emote)} ${text(legendTrackers[id].Type)} ${legendTrackers[id].Name}`;
		}
	} else {
		return globalTrackers[id];
	}
}

function trackerValue(id, value) {
	if (id == '1905735931') return '-';

	return value.toLocaleString();
}

module.exports = { platformName, getStatus, battlepass, rankLayout, trackerName, trackerValue };
