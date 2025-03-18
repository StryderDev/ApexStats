const { emoteFile } = require('./misc.js');

const emotes = require(`../data/${emoteFile(process.env.DEBUG)}Emotes.json`);

function getRankName(rank) {
	if (rank.name == 'Apex Predator') return `${emotes.ApexPredator} **[#${rank.ladderPos}]** ${rank.name}`;
	if (rank.name == 'Master') return `${emotes.Master} ${rank.name}`;

	return `${emotes[rank.name]} ${rank.name} ${rank.division}`;
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
	if (platform === 'PlayStation') return emotes.playstation;
	if (platform === 'Xbox') return emotes.xbox;

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
	const seasonName = `${season.Name}_${season.Split}`;

	const rewardLevel = battlepass.history[seasonName] >= 60 ? 60 : battlepass.history[seasonName];
	const rewardPercent = battlepass.history[seasonName] >= 60 ? 100 : Math.floor((battlepass.history[seasonName] / 60) * 100);

	const badgeLevel = battlepass.history[seasonName] >= 100 ? 100 : Math.floor(battlepass.history[seasonName]);

	return `${emotes.listArrow} Reward Completion: ${rewardLevel}/60 (${rewardPercent}%)\n${emotes.listArrow} Badge Completion: ${badgeLevel}/100 (${badgeLevel}%)`;
}

module.exports = { getRankName, formatScore, getDivision, platformName, playerStatus, platformEmote, pointsTillMaster, pointsTillPredator, battlepassProgress };
