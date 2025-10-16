const axios = require('axios');
const { emoteFile } = require('../../utilities/misc.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const {
	levelBadge,
	formatScore,
	getDivision,
	getRankName,
	playerStatus,
	platformEmote,
	pointsTillMaster,
	pointsTillPredator,
	rankBadgeImageName,
	battlepassProgress,
	calcDailyBPLevelsTillCompletion,
} = require('../../utilities/stats.js');
const {
	ButtonStyle,
	MessageFlags,
	ButtonBuilder,
	SectionBuilder,
	MediaGalleryItem,
	ContainerBuilder,
	TextDisplayBuilder,
	MediaGalleryBuilder,
	SlashCommandBuilder,
	SeparatorSpacingSize,
	AttachmentBuilder,
} = require('discord.js');

const emotes = require(`../../data/${emoteFile(process.env.DEBUG)}Emotes.json`);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('View the stats for your currently selected legend')
		.addStringOption(option =>
			option.setName('platform').setDescription('The platform you play on. Note: For crossplay, use the platform you play on the most').setRequired(true).addChoices(
				{
					name: 'PC',
					value: 'PC',
				},
				{
					name: 'PlayStation',
					value: 'PS4',
				},
				{
					name: 'Xbox',
					value: 'X1',
				},
			),
		)
		.addStringOption(option => option.setName('username').setDescription('Your in-game username, usually the name linked directly to your EA account')),

	async execute(interaction) {
		const platform = interaction.options.getString('platform');
		const username = interaction.options.getString('username');

		const playerAPI = axios.get(`https://api.jumpmaster.xyz/user/Stats?platform=${platform}&player=${encodeURIComponent(username)}&key=${process.env.SPYGLASS}`);
		const seasonAPI = axios.get('https://api.jumpmaster.xyz/seasons/Current?version=2');
		const rankedAPI = axios.get('https://api.jumpmaster.xyz/misc/predThreshold');

		const trackerBackground = await loadImage('https://specter.apexstats.dev/ApexStats/Legends/Trackers/Background_3.png?key=LuH8KT5TxF5tPlQq9xVqkrNSxdPnwWYc');

		const loadingContainer = new ContainerBuilder();

		const legendBanner = new MediaGalleryBuilder().addItems([
			{
				type: MediaGalleryItem,
				media: {
					url: `https://specter.apexstats.dev/ApexStats/Legends/V2/Loading.png?key=${process.env.SPECTER}`,
				},
			},
		]);

		const legendText = new TextDisplayBuilder().setContent(
			[`# ${platformEmote(platform)} Loading...`, `-# ${emotes.listArrow} Status: Loading...`, `-# ${emotes.listArrow} Level: Loading... · Tier: -/4 · Total: -/2000`].join('\n'),
		);

		const battlepassText = new TextDisplayBuilder().setContent(
			[`## Battle Pass Loading...`, `${emotes.listArrow} Reward Completion: -/60 (0%)\n${emotes.listArrow} Badge Completion: -/100 (0%)`, `${emotes.listArrow} Required Daily Levels till Completion: -/day`].join(
				'\n',
			),
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
					url: `https://specter.apexstats.dev/ApexStats/Legends/Trackers/Background_3.png?key=${process.env.SPECTER}`,
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

		interaction.editReply({
			components: [loadingContainer],
			flags: MessageFlags.IsComponentsV2,
		});

		await axios.all([playerAPI, seasonAPI, rankedAPI]).then(
			axios.spread(async (...res) => {
				const playerData = res[0].data;
				const seasonData = res[1].data;
				const rankedData = res[2].data;

				const user = playerData.user;
				const account = playerData.account;

				const playerTag = user.tag ? `[${user.tag}]` : '';

				const statsContainer = new ContainerBuilder();

				const legendBanner = new MediaGalleryBuilder().addItems([
					{
						type: MediaGalleryItem,
						media: {
							url: `https://specter.apexstats.dev/ApexStats/Legends/V2/${encodeURIComponent(playerData.active.legend)}.png?key=${process.env.SPECTER}`,
						},
					},
				]);

				const legendText = new TextDisplayBuilder().setContent(
					[
						`# ${platformEmote(platform)} ${playerTag} ${user.username}`,
						`-# ${emotes.listArrow} Status: ${playerStatus(user.status)}`,
						`-# ${emotes.listArrow} Level: ${account.level.current} · Tier: ${account.level.prestige + 1}/4 · Total: ${account.level.total.toLocaleString()}/2000`,
					].join('\n'),
				);

				const battlepassText = new TextDisplayBuilder().setContent(
					[
						`## ${seasonData.info.title} Split ${seasonData.info.split} Battle Pass`,
						`${battlepassProgress(account.battlepass, seasonData.info)}`,
						`${emotes.listArrow} ${calcDailyBPLevelsTillCompletion(account.battlepass, seasonData)} Levels/day till Completion`,
					].join('\n'),
				);

				const rankedText = new TextDisplayBuilder().setContent(
					[
						`## Battle Royale Ranked - ${getRankName(playerData.ranked.BR)}`,
						`${emotes.listArrow} **Division**: ${getDivision(playerData.ranked.BR)}`,
						`${emotes.listArrow} **Total**: ${formatScore(playerData.ranked.BR)} RP`,
						`${emotes.listArrow} **RP to Master**: ${pointsTillMaster(playerData.ranked.BR)} RP`,
						`${emotes.listArrow} **RP to Apex Predator**: ${pointsTillPredator(playerData.ranked.BR, playerData.user.platform, rankedData)} RP`,
					].join('\n'),
				);

				const footerText = new TextDisplayBuilder().setContent(`-# Equip the Battle Pass badge in-game to update it!\n-# Equip trackers in-game to update stats!`);

				const profileButton = new ButtonBuilder().setLabel('View Stats Profile').setStyle(ButtonStyle.Link).setURL('https://apexstats.dev/').setDisabled(true);

				const legendSection = new SectionBuilder()
					.addTextDisplayComponents(legendText)
					.setThumbnailAccessory(thumbnail => thumbnail.setURL(`https://specter.apexstats.dev/ApexStats/Banners/${levelBadge(account.level.total)}.png?key=${process.env.SPECTER}`));

				const battlepassSection = new SectionBuilder()
					.addTextDisplayComponents(battlepassText)
					.setThumbnailAccessory(thumbnail => thumbnail.setURL(`https://specter.apexstats.dev/ApexStats/Seasons/${seasonData.info.title}.png?key=${process.env.SPECTER}`));

				const rankedSection = new SectionBuilder()
					.addTextDisplayComponents(rankedText)
					.setThumbnailAccessory(thumbnail =>
						thumbnail.setURL(`https://specter.apexstats.dev/ApexStats/Banners/Ranked/${encodeURIComponent(rankBadgeImageName(playerData.ranked.BR))}.png?key=${process.env.SPECTER}`),
					);

				// Tracker Stats Image
				const canvas = createCanvas(1200, 100);
				const ctx = canvas.getContext('2d');

				const sections = [{ title: 'Tracker 1', subtitle: 'Value 1' }];

				const sectionWidth = 1200 / sections.length;
				const padding = 20;
				const baseY = 25;
				const titleSize = 18;
				const subtitleSize = 25;

				ctx.drawImage(trackerBackground, 0, 0, 1200, 100);

				sections.forEach((section, i) => {
					const baseX = 1;

					ctx.fillText(section.title, baseX + padding, baseY);
				});

				const imageBuffer = canvas.toBuffer('image/png');

				const attachment = new AttachmentBuilder(imageBuffer, { name: 'trackerStats.png' });

				const trackerImage = new MediaGalleryBuilder().addItems([
					{
						type: MediaGalleryItem,
						media: {
							url: `attachment://${attachment.name}`,
						},
					},
				]);

				const footerSection = new SectionBuilder().addTextDisplayComponents(footerText).setButtonAccessory(profileButton);

				statsContainer.addMediaGalleryComponents(legendBanner);
				statsContainer.addSectionComponents(legendSection);

				statsContainer.addSeparatorComponents(separator => separator.setSpacing(SeparatorSpacingSize.Small));

				statsContainer.addSectionComponents(battlepassSection);
				statsContainer.addSectionComponents(rankedSection);

				statsContainer.addSeparatorComponents(separator => separator.setSpacing(SeparatorSpacingSize.Small));

				statsContainer.addMediaGalleryComponents(trackerImage);

				statsContainer.addSeparatorComponents(separator => separator.setSpacing(SeparatorSpacingSize.Small));

				statsContainer.addSectionComponents(footerSection);

				interaction.editReply({
					files: [attachment],
					components: [statsContainer],
					flags: MessageFlags.IsComponentsV2,
				});
			}),
		);

		console.log('bread');
	},
};
