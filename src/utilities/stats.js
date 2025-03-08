const { emoteFile } = require('./misc.js');

const emotes = require(`../data/${emoteFile(process.env.DEBUG)}Emotes.json`);

function platformName(platform) {
	if (platform === 'PC') return 'PC';
	if (platform === 'PS4') return 'PlayStation';
	if (platform === 'X1') return 'Xbox';

	return 'N/A';
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
	const rewardPercent = battlepass.history[seasonName] >= 60 ? 100 : (battlepass.history[seasonName] / 60) * 100;

	const badgeLevel = battlepass.history[seasonName] >= 100 ? 100 : battlepass.history[seasonName];

	return `${emotes.listArrow} Reward Completion: ${rewardLevel}/60 (${rewardPercent}%)\n${emotes.listArrow} Badge Completion: ${badgeLevel}/100 (${badgeLevel}%)`;
}

module.exports = { platformName, platformEmote, battlepassProgress };
