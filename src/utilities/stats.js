const { Misc, Status, Ranked } = require('../data/utilities.json');

function platformName(name) {
	if (name == 'X1') return 'Xbox';
	if (name == 'PS4') return 'PlayStation';

	return name;
}

function platformEmote(name) {
	if (name == 'PC') return Misc.Platform_PC;
	if (name == 'Xbox') return Misc.Platform_Xbox;
	if (name == 'PlayStation') return Misc.Platform_PlayStation;
}

function getStatus(status) {
	const seconds = Math.floor(status.matchLength % 60);
	const minutes = Math.floor(status.matchLength / 60);

	if (status.online == 1) {
		// Player is online but not in a match
		if (status.ingame == 0 && status.partyInMatch == 0) {
			if (status.matchLength == 0) return `${Status.Online} Online (Lobby)`;

			// Player is in an open lobby
			return `${Status.Online} Lobby (${minutes}m ${seconds}s)`;
		}

		if (status.ingame == 1 || status.partyInMatch == 1) {
			// Player is in a lobby with invite only enabled
			if (status.matchLength == 0) return `${Status.inGame} In a Match`;

			// Player is in an open lobby
			return `${Status.inGame} In a Match (${minutes}m ${seconds}s)`;
		}
	}

	return `${Status.Offline} Offline`;
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

	return `${Ranked[rank.name]} ${showPosition(rank.name, rank.ladderPos)} ${rank.name} ${showDivision(rank.name, rank.division)}\n${
		Misc.GrayBlank
	} ${rank.score.toLocaleString()} LP`;
}

function checkUserBan(bans) {
	var banUntil = Math.floor(Date.now() / 1000 + bans.length);

	if (bans.active == 1) return `:no_entry: Banned until <t:${banUntil}:F>`;

	return '';
}

module.exports = { platformName, platformEmote, getStatus, battlepass, rankLayout, checkUserBan };
