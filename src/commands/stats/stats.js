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
	testLoadEmbedThing,
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
		.addStringOption(option => option.setName('username').setDescription('Your in-game username, usually the name linked directly to your EA account').setRequired(true)),

	async execute(interaction) {
		const platform = interaction.options.getString('platform');
		const username = interaction.options.getString('username');

		const playerAPI = axios.get(`https://api.jumpmaster.xyz/user/Stats?platform=${platform}&player=${encodeURIComponent(username)}&key=${process.env.SPYGLASS}`);
		const seasonAPI = axios.get('https://api.jumpmaster.xyz/seasons/Current?version=2');
		const rankedAPI = axios.get('https://api.jumpmaster.xyz/misc/predThreshold');

		const trackerBackground = await loadImage('https://specter.apexstats.dev/ApexStats/Legends/Trackers/Background_8.png?key=LuH8KT5TxF5tPlQq9xVqkrNSxdPnwWYc');

		interaction.editReply({
			components: [testLoadEmbedThing(emotes, platform)],
			flags: MessageFlags.IsComponentsV2,
		});

		await axios.all([playerAPI, seasonAPI, rankedAPI]).then(
			axios.spread(async (...res) => {
				const playerData = res[0].data;
				const seasonData = res[1].data;
				const rankedData = res[2].data;

				const user = playerData.user;
				const account = playerData.account;
				const trackers = playerData.active.trackers;

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

				// function to truncate text if its longer than 21 characters and add an elipsis at the end
				function truncateText(text, length) {
					if (text.length > length) return text.substring(0, length - 3) + '...';

					return text;
				}

				const sections = [
					{ title: truncateText(trackers[0].name_short.toString(), 25), subtitle: trackers[0].value.toLocaleString() },
					{ title: truncateText(trackers[1].name_short.toString(), 25), subtitle: trackers[1].value.toLocaleString() },
					{ title: truncateText(trackers[2].name_short.toString(), 25), subtitle: trackers[2].value.toLocaleString() },
				];

				const sectionWidth = 1200 / sections.length;
				const padding = 20;
				const baseY = 30;
				const titleSize = 25;
				const subtitleSize = 45;

				ctx.drawImage(trackerBackground, 0, 0, 1200, 100);

				function truncateText(text, amount) {
					const words = text.split(' ');
					const lines = [];
					let line = '';

					for (let word of words) {
						const testTextLength = line ? `${line} ${word}` : word;

						if (testTextLength.length <= amount) {
							line = testTextLength;
						} else {
							break;
						}
					}

					if (line.length < text.length) line += '...';

					lines.push(line);

					return lines;
				}

				sections.forEach((section, i) => {
					const baseX = i * sectionWidth + padding;

					ctx.font = `${titleSize}px sans-serif`;
					ctx.fillStyle = 'white';

					const titleLines = truncateText(section.title, 25);

					titleLines.forEach((line, j) => {
						ctx.fillText(line, baseX, baseY + j * (titleSize + 2));
					});

					const subtitleHeight = titleLines.length * (subtitleSize + 2);

					ctx.font = `bold ${subtitleSize}px sans-serif`;

					ctx.fillText(section.subtitle, baseX, baseY + subtitleHeight + 6);
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
	},
};
