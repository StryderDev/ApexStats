const { emoteFile } = require('./misc.js');
const { ButtonStyle, ButtonBuilder, SectionBuilder, ContainerBuilder, MediaGalleryItem, TextDisplayBuilder, MediaGalleryBuilder, SeparatorSpacingSize } = require('discord.js');

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
	if (platform == 'PlayStation') platform = 'Playstation';

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

function testLoadEmbedThing(emotes, platform) {
	const loadingContainer = new ContainerBuilder();

	const legendBanner = new MediaGalleryBuilder().addItems([
		{
			type: MediaGalleryItem,
			media: {
				url: `https://specter.apexstats.dev/ApexStats/Legends/V2/Loading.png?key=${process.env.SPECTER}`,
			},
		},
	]);

	const legendText = new TextDisplayBuilder().setContent([`# ${platformEmote(platform)} -`, `-# ${emotes.listArrow} Status: -`, `-# ${emotes.listArrow} Level: - · Tier: -/4 · Total: -/2000`].join('\n'));

	const battlepassText = new TextDisplayBuilder().setContent(
		[`## Battle Pass Loading...`, `${emotes.listArrow} Reward Completion: -/60 (0%)\n${emotes.listArrow} Badge Completion: -/100 (0%)`, `${emotes.listArrow} Required Daily Levels till Completion: -/day`].join('\n'),
	);

	const rankedText = new TextDisplayBuilder().setContent(
		[
			`## Battle Royale Ranked - Loading...`,
			`${emotes.listArrow} **Division**: - RP`,
			`${emotes.listArrow} **Total**: - RP`,
			`${emotes.listArrow} **RP to Master**: - RP`,
			`${emotes.listArrow} **RP to Apex Predator**: - RP`,
		].join('\n'),
	);

	const trackerStatsBackground = new MediaGalleryBuilder().addItems([
		{
			type: MediaGalleryItem,
			media: {
				url: `https://specter.apexstats.dev/ApexStats/Legends/Trackers/Background_8.png?key=${process.env.SPECTER}`,
			},
		},
	]);

	const footerText = new TextDisplayBuilder().setContent(`-# Equip the Battle Pass badge in-game to update it!\n-# Equip trackers in-game to update stats`);

	const profileButton = new ButtonBuilder().setLabel('View Stats Profile').setStyle(ButtonStyle.Link).setURL('https://apexstats.dev/').setDisabled(true);

	const legendSection = new SectionBuilder()
		.addTextDisplayComponents(legendText)
		.setThumbnailAccessory(thumbnail => thumbnail.setURL(`https://specter.apexstats.dev/ApexStats/Banners/Empty.png?key=${process.env.SPECTER}`));

	const battlepassSection = new SectionBuilder()
		.addTextDisplayComponents(battlepassText)
		.setThumbnailAccessory(thumbnail => thumbnail.setURL(`https://specter.apexstats.dev/ApexStats/Banners/Empty.png?key=${process.env.SPECTER}`));

	const rankedSection = new SectionBuilder()
		.addTextDisplayComponents(rankedText)
		.setThumbnailAccessory(thumbnail => thumbnail.setURL(`https://specter.apexstats.dev/ApexStats/Banners/Empty.png?key=${process.env.SPECTER}`));

	const footerSection = new SectionBuilder().addTextDisplayComponents(footerText).setButtonAccessory(profileButton);

	loadingContainer.addMediaGalleryComponents(legendBanner);
	loadingContainer.addSectionComponents(legendSection);

	loadingContainer.addSeparatorComponents(separator => separator.setSpacing(SeparatorSpacingSize.Small));

	loadingContainer.addSectionComponents(battlepassSection);
	loadingContainer.addSectionComponents(rankedSection);

	loadingContainer.addSeparatorComponents(separator => separator.setSpacing(SeparatorSpacingSize.Small));

	loadingContainer.addMediaGalleryComponents(trackerStatsBackground);

	loadingContainer.addSeparatorComponents(separator => separator.setSpacing(SeparatorSpacingSize.Small));

	loadingContainer.addSectionComponents(footerSection);

	return loadingContainer;
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
	testLoadEmbedThing,
};
