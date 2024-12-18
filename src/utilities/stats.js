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
	if (data.history['From_the_Rift_2'] >= 60) {
		rewardLevel = 60;
		rewardCompletion = 100;
	} else {
		rewardLevel = data.history['From_the_Rift_2'];
		rewardCompletion = Math.floor((data.history['From_the_Rift_2'] / 60) * 100);
	}

	if (data.history['From_the_Rift_2'] >= 100) {
		badgeLevel = 100;
		badgeCompletion = 100;
	} else {
		badgeLevel = data.history['From_the_Rift_2'];
		badgeCompletion = Math.floor((data.history['From_the_Rift_2'] / 100) * 100);
	}

	return `${Misc.GrayBlank} Reward Completion: ${rewardLevel}/60 (${rewardCompletion}%)\n${Misc.GrayBlank} Badge Completion: ${badgeLevel}/100 (${badgeCompletion}%)`;
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

	return `${Ranked[rank.name]} ${showPosition(rank.name, rank.ladderPos)} ${rank.name} ${showDivision(rank.name, rank.division)}\n${Misc.GrayBlank} ${rank.score.toLocaleString()} RP`;
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
	const tillMaster = 16000 - player.score;

	if (tillMaster <= 0) return `0 RP`;

	return `${tillMaster.toLocaleString()} RP`;
}

function calcTillPred(player, pred, platform) {
	if (platform == 'X1') platform = 'Xbox';
	if (platform == 'PS4') platform = 'Playstation';

	const tillPred = pred[platform].value - player.score + 1000;

	if (tillPred <= 0) return `0 RP`;

	return `${tillPred.toLocaleString()} RP`;
}

function getDivisionCount(rank) {
	// return rank.score and remove all characters except for the 3 at the end
	// return rank.score
	// 	.toString()
	// 	.replace(/[^0-9]/g, '')
	// 	.slice(-3);

	const rankScore = rank.score.toString();
	const rankNextDivision = rank.nextDivision.toString();
	const rankNextScore = rank.nextScore.toString();

	if (rankScore < 16000) {
		const finalScore = rankNextDivision - (rankNextScore - rankScore);

		return `${finalScore
			.toString()
			.replace(/[^0-9]/g, '')
			.slice(-3)}/${rankNextDivision} RP`;
	} else {
		return `-`;
	}
}

module.exports = { platformName, platformEmote, getStatus, battlepass, rankLayout, checkUserBan, calcTillMaster, calcTillPred, getRankName, getDivisionCount, getRankNameNoIcon };
