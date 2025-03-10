const { emoteFile } = require('./misc.js');

const emotes = require(`../data/${emoteFile(process.env.DEBUG)}Emotes.json`);

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

function battlepassProgress(battlepass, season) {
	const seasonName = `${season.Name}_${season.Split}`;

	const rewardLevel = battlepass.history[seasonName] >= 60 ? 60 : battlepass.history[seasonName];
	const rewardPercent = battlepass.history[seasonName] >= 60 ? 100 : Math.floor((battlepass.history[seasonName] / 60) * 100);

	const badgeLevel = battlepass.history[seasonName] >= 100 ? 100 : Math.floor(battlepass.history[seasonName]);

	return `${emotes.listArrow} Reward Completion: ${rewardLevel}/60 (${rewardPercent}%)\n${emotes.listArrow} Badge Completion: ${badgeLevel}/100 (${badgeLevel}%)`;
}

module.exports = { platformName, playerStatus, platformEmote, battlepassProgress };
