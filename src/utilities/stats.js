const { Emotes } = require('../data/utilities.json');

function platformName(name) {
	if (name == 'X1') return 'Xbox';
	if (name == 'PS4') return 'PlayStation';

	return name;
}

function platformEmote(name) {
	if (name == 'PC') return Emotes.Misc.Platform_PC;
	if (name == 'Xbox') return Emotes.Misc.Platform_Xbox;
	if (name == 'PlayStation') return Emotes.Misc.Platform_PlayStation;
}

function getStatus(status) {
	const seconds = Math.floor(status.matchLength % 60);
	const minutes = Math.floor(status.matchLength / 60);

	if (status.online == 1) {
		// Player is online but not in a match
		if (status.ingame == 0 && status.partyInMatch == 0) {
			if (status.matchLength == 0) return `${Emotes.Status.Online} Online (Lobby)`;

			// Player is in an open lobby
			return `${Emotes.Status.Online} Lobby (${minutes}m ${seconds}s)`;
		}

		if (status.ingame == 1 || status.partyInMatch == 1) {
			// Player is in a lobby with invite only enabled
			if (status.matchLength == 0) return `${Emotes.Status.inGame} In a Match`;

			// Player is in an open lobby
			return `${Emotes.Status.inGame} In a Match (${minutes}m ${seconds}s)`;
		}
	}

	return `${Emotes.Status.Offline} Offline`;
}

function battlepass(data) {
	if (!data.history.Arsenal) return data.level;

	return data.history.Arsenal;
}

function rankLayout(rank) {
	function showPosition(name, position) {
		if (name == 'Apex Predator') return `**[#${position}]**`;
		if (name == 'Master') return `**[#${position.toLocaleString()}]**`;

		return '';
	}

	function showDivision(name, division) {
		if (name == 'Apex Predator' || name == 'Master' || name == 'Unranked') return '';

		return division;
	}

	return `${Emotes.Ranked[rank.name]} ${showPosition(rank.name, rank.ladderPos)} ${rank.name} ${showDivision(rank.name, rank.division)}\n${
		Emotes.Misc.GrayBlank
	} ${rank.score.toLocaleString()} LP`;
}

module.exports = { platformName, platformEmote, getStatus, battlepass, rankLayout };
