const { Misc, Status, Ranked } = require('../data/utilities.json');

function platformName(name) {
	if (name == 'X1') return 'Xbox';
	if (name == 'PS4') return 'PlayStation';

	return name;
}

function platformEmote(name) {
	if (name == 'PC') return Misc.Platform_PC;
	if (name == 'Xbox' || name == 'X1') return Misc.Platform_Xbox;
	if (name == 'PlayStation' || name == 'PS4') return Misc.Platform_PlayStation;
}

function getStatus(status) {
	const seconds = Math.floor(status.matchLength % 60);
	const minutes = Math.floor(status.matchLength / 60);

	if (status.online === 1) {
		// Player is online but not in a match
		if (status.ingame === 0 && status.partyInMatch === 0) {
			if (status.matchLength == 0) return `${Status.Online} Online`;

			// Player is in an open lobby
			return `${Status.Online} Lobby (${minutes}m ${seconds}s)`;
		}

		if (status.ingame === 1 || status.partyInMatch === 1) {
			// Player is in a lobby with invite only enabled
			if (status.matchLength == 0) return `${Status.inGame} In a Match`;

			// Player is in an open lobby
			return `${Status.inGame} In a Match (${minutes}m ${seconds}s)`;
		}
	}

	return `${Status.Offline} Offline`;
}

function battlepass(data) {
	if (!data.history.Ignite) return data.level;

	return data.history.Breakout;
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

function getRankName(rank) {
	if (rank.name == 'Apex Predator') return `${Ranked[rank.name]} **[#${rank.ladderPos}]** ${rank.name}`;
	if (rank.name == 'Master') return `${Ranked[rank.name]} **[#${rank.ladderPos.toLocaleString()}]** ${rank.name}`;

	return `${Ranked[rank.name]} ${rank.name} ${rank.division}`;
}

function getRankNameNoIcon(rank) {
	if (rank.name == 'Apex Predator' || rank.name == 'Master') return rank.name;

	return `${rank.name} ${rank.division}`;
}

function checkUserBan(bans) {
	var banUntil = Math.floor(Date.now() / 1000 + bans.length);

	if (bans.active === 1) return `:no_entry: Banned until <t:${banUntil}:F>`;

	return '';
}

function calcTillMaster(player) {
	const tillMaster = 24000 - player.score;

	if (tillMaster <= 0) return `0 LP`;

	return `${tillMaster.toLocaleString()} LP`;
}

function calcTillPred(player, pred, platform) {
	if (platform == 'X1') platform = 'Xbox';
	if (platform == 'PS4') platform = 'Playstation';

	const tillPred = pred[platform].value - player.score;

	if (tillPred <= 0) return `0 LP`;

	return `${tillPred.toLocaleString()} LP`;
}

function getDivisionCount(rank) {
	// return rank.score and remove all characters except for the 3 at the end
	return rank.score
		.toString()
		.replace(/[^0-9]/g, '')
		.slice(-3);
}

module.exports = { platformName, platformEmote, getStatus, battlepass, rankLayout, checkUserBan, calcTillMaster, calcTillPred, getRankName, getDivisionCount, getRankNameNoIcon };
