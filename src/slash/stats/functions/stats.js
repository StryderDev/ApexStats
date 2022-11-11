const { Misc } = require('../../../data/emotes.json');

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
		if (status.matchLength != 0) return `${inGame} In a Match (${minutes}m ${seconds}s)`;

		return `${inGame} In a Match`;
	}

	return `${offline} Offline / Invite Only`;
}

function battlepass(data) {
	if (!data.history.Eclipse) return data.level;

	return data.history.Eclipse;
}

function rankLayout(type, rank, emote) {
	function showDiv(name, div) {
		if (name == 'Master' || name == 'Apex Predator' || name == 'Unranked') return '';

		return div;
	}

	function showPos(name, pos) {
		if (name == 'Apex Predator') return `**[#${pos}]**`;
		if (name == 'Master') return `**[#${pos}]**`;

		return '';
	}

	return `${emote[rank.name]} ${showPos(rank.name, rank.ladderPos)} ${rank.name} ${showDiv(rank.name, rank.division)}\n${Misc.GrayBlank} ${rank.score.toLocaleString()} ${type}`;
}

function getPlatformEmote(platform) {
	if (platform == 'PC') return Misc.Platform_PC;
	if (platform == 'Xbox') return Misc.Platform_Xbox;
	if (platform == 'PlayStation') return Misc.Platform_PlayStation;
}

module.exports = { platformName, getStatus, battlepass, rankLayout, getPlatformEmote };
