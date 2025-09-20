const { emoteFile } = require('./misc.js');

const emotes = require(`../data/${emoteFile(process.env.DEBUG)}Emotes.json`);

function levelBadge(level) {
	if (level < 501) return 500;
	if (level < 1001) return 1000;
	if (level < 1501) return 1500;

	return 2000;
}

function getRankName(rank) {
	if (rank.name == 'Apex Predator') return `**[#${rank.ladderPos}]** ${rank.name}`;
	if (rank.name == 'Master') return `${rank.name}`;

	return `${rank.name} ${rank.division}`;
}

function formatScore(rank) {
	if (rank.score < 16000) return `${rank.score.toLocaleString()}/${rank.nextScore.toLocaleString()}`;

	return `${rank.score.toLocaleString()}`;
}

function getDivision(rank) {
	const finalScore = rank.nextDivision - (rank.nextScore - rank.score);

	if (rank.score > 16000) return '-';

	return `${finalScore
		.toString()
		.replace(/[^0-9]/g, '')
		.slice(-3)}/${rank.nextDivision} RP`;
}

function platformName(platform) {
	if (platform === 'PC') return 'PC';
	if (platform === 'PS4') return 'PlayStation';
	if (platform === 'X1') return 'Xbox';

	return 'N/A';
}

function playerStatus(status) {
	if (status.online === 1) {
		if (status.ingame === 0 && status.partyInMatch === 0) {
			if (status.matchLength == 0) return `${emotes.online} Online`;

			return `${emotes.online} In the Lobby (since <t:${Math.floor(Date.now() / 1000) - status.matchLength}:t>)`;
		}

		if (status.ingame === 1 || status.partyInMatch === 1) {
			if (status.matchLength == 0) return `${emotes.busy} In a Match`;

			return `${emotes.busy} In a Match (since <t:${Math.floor(Date.now() / 1000) - status.matchLength}:t>)`;
		}
	}

	return `${emotes.offline} Offline [Last Seen <t:${status.lastOnline}:R>]`;
}

function platformEmote(platform) {
	if (platform === 'PC') return emotes.pc;
	if (platform === 'PS4') return emotes.playstation;
	if (platform === 'X1') return emotes.xbox;

	return emotes.apexIcon;
}

function pointsTillMaster(player) {
	const pointsTillMaster = 16000 - player.score;

	if (pointsTillMaster <= 0) return '0';

	return `${pointsTillMaster.toLocaleString()}`;
}

function pointsTillPredator(player, platform, ranked) {
	if (platform == 'X1') platform = 'Xbox';
	if (platform == 'PS4') platform = 'PlayStation';

	const pointsTillPredator = ranked[platform].value - player.score;

	if (pointsTillPredator <= 0) return '0';

	return `${pointsTillPredator.toLocaleString()}`;
}

function battlepassProgress(battlepass, season) {
	const seasonName = `${season.title}_${season.split}`;

	const rewardLevel = battlepass.history[seasonName] >= 60 ? 60 : battlepass.history[seasonName];
	const rewardPercent = battlepass.history[seasonName] >= 60 ? 100 : Math.floor((battlepass.history[seasonName] / 60) * 100);

	const badgeLevel = battlepass.history[seasonName] >= 100 ? 100 : Math.floor(battlepass.history[seasonName]);

	return `${emotes.listArrow} Reward Completion: ${rewardLevel}/60 (${rewardPercent}%)\n${emotes.listArrow} Badge Completion: ${badgeLevel}/100 (${badgeLevel}%)`;
}

function rankBadgeImageName(rank) {
	if (rank.name == 'Apex Predator') return 'Apex Predator';
	if (rank.name == 'Master') return 'Master';

	return `${rank.name}_${rank.division}`;
}

function calcDailyBPLevelsTillCompletion(battlepass, seasonInfo) {
	const currentTime = Math.floor(Date.now() / 1000);

	if (currentTime < seasonInfo.dates.split.timestamp) {
		const totalLevelsNeeded = 100 - (battlepass.history[`${seasonInfo.info.title}_${seasonInfo.info.split}`] || 1);
		const daysLeft = Math.ceil((seasonInfo.dates.split.timestamp - currentTime) / 86400);

		return `${Math.ceil(totalLevelsNeeded / daysLeft)}`;
	} else {
		const totalLevelsNeeded = 100 - (battlepass.history[`${seasonInfo.info.title}_${seasonInfo.info.split}`] || 1);
		const daysLeft = Math.ceil((seasonInfo.dates.end.timestamp - currentTime) / 86400);

		return `${Math.ceil(totalLevelsNeeded / daysLeft)}`;
	}
}

module.exports = {
	levelBadge,
	getRankName,
	formatScore,
	getDivision,
	platformName,
	playerStatus,
	platformEmote,
	pointsTillMaster,
	pointsTillPredator,
	battlepassProgress,
	rankBadgeImageName,
	calcDailyBPLevelsTillCompletion,
};
