const axios = require('axios');
const chalk = require('chalk');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const { emoteFile } = require('../../utilities/misc.js');
const {
	AttachmentBuilder,
	SlashCommandBuilder,
	EmbedBuilder,
	SectionBuilder,
	ComponentType,
	ButtonBuilder,
	MessageFlags,
	ButtonStyle,
	MediaGalleryBuilder,
	ContainerBuilder,
	TextDisplayBuilder,
	MediaGalleryItem,
	SeparatorSpacingSize,
} = require('discord.js');
const { levelBadge, getRankName, formatScore, getDivision, platformName, playerStatus, platformEmote, pointsTillMaster, pointsTillPredator, battlepassProgress } = require('../../utilities/stats.js');

const emotes = require(`../../data/${emoteFile(process.env.DEBUG)}Emotes.json`);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('View the in-game stats of your currently selected legend')
		.addStringOption(option =>
			option.setName('platform').setDescription('Which platform you play on. Note: For crossplay, use the platform you play on the most').setRequired(true).addChoices(
				{
					name: 'PC (Steam/EA App/Epic Games)',
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
		.addStringOption(option => option.setName('username').setDescription('Your in-game username').setRequired(true)),

	async execute(interaction) {
		const platform = interaction.options.getString('platform');
		const username = interaction.options.getString('username');

		// const loadingEmbed = new EmbedBuilder().setDescription(`${emotes.loading} Loading player data for ${username} on ${platformName(platform)}...`);
		// await interaction.editReply({ embeds: [loadingEmbed] });

		const playerAPI = axios.get(`https://api.jumpmaster.xyz/user/Stats?platform=${platform}&player=${encodeURIComponent(username)}&key=${process.env.SPYGLASS}`);
		const seasonAPI = axios.get('https://api.jumpmaster.xyz/seasons/Current');
		const rankedAPI = axios.get('https://api.jumpmaster.xyz/misc/predThreshold');

		await axios
			.all([playerAPI, seasonAPI, rankedAPI])
			.then(
				axios.spread(async (...res) => {
					const playerData = res[0].data;
					const seasonData = res[1].data;
					const rankedData = res[2].data;

					const user = playerData.user;
					const account = playerData.account;
					const trackers = playerData.active.trackers;

					const playerTag = user.tag ? `[${user.tag}]` : '';

					const statsContainer = new ContainerBuilder();

					const profileButton = new ButtonBuilder().setLabel('View Profile').setStyle(ButtonStyle.Link).setURL('https://apexstats.dev/').setDisabled(true);

					const profileButtonDisplay = new TextDisplayBuilder().setContent(`\u200b`);

					const legendBanner = new MediaGalleryBuilder().addItems([
						{ type: MediaGalleryItem, media: { url: 'https://specter.apexstats.dev/ApexStats/Legends/V2/Conduit.png?key=LuH8KT5TxF5tPlQq9xVqkrNSxdPnwWYc' } },
					]);

					const background = await loadImage('https://specter.apexstats.dev/ApexStats/Legends/Trackers/Background_3.png?key=LuH8KT5TxF5tPlQq9xVqkrNSxdPnwWYc');

					// Canvas settings
					const width = 1000;
					const height = 100;
					const canvas = createCanvas(width, height);
					const ctx = canvas.getContext('2d');

					// Text for each section
					const sections = [
						{ title: trackers[0].id.toString(), subtitle: trackers[0].value.toLocaleString() },
						{ title: trackers[1].id.toString(), subtitle: trackers[1].value.toLocaleString() },
						{ title: trackers[2].id.toString(), subtitle: trackers[2].value.toLocaleString() },
					];

					// Text layout settings
					const sectionWidth = width / sections.length;
					const paddingLeft = 20;
					const baseY = 25;
					const titleFontSize = 18;
					const subtitleFontSize = 25;

					// Text wrapping helper
					function wrapText(ctx, text, maxWidth) {
						const words = text.split(' ');
						const lines = [];
						let line = '';

						for (let word of words) {
							const testLine = line ? `${line} ${word}` : word;
							const metrics = ctx.measureText(testLine);

							if (metrics.width <= maxWidth) {
								line = testLine;
							} else {
								if (line) lines.push(line);
								line = word;
							}
						}

						if (line) lines.push(line);
						return lines;
					}

					ctx.drawImage(background, 0, 0, width, height);

					sections.forEach((section, i) => {
						const baseX = i * sectionWidth + paddingLeft;
						const maxTextWidth = sectionWidth - 2 * paddingLeft;

						// Draw title
						ctx.font = `${titleFontSize}px sans-serif`;
						ctx.fillStyle = 'white';
						ctx.textAlign = 'left';
						ctx.textBaseline = 'top';

						const titleLines = wrapText(ctx, section.title, maxTextWidth);
						titleLines.forEach((line, j) => {
							ctx.fillText(line, baseX, baseY + j * (titleFontSize + 2));
						});

						// Draw subtitle
						const titleHeight = titleLines.length * (titleFontSize + 2);
						ctx.font = `bold ${subtitleFontSize}px sans-serif`;
						ctx.fillText(section.subtitle, baseX, baseY + titleHeight + 6);
					});

					// Convert canvas to Discord attachment
					const buffer = canvas.toBuffer('image/png');
					const attachment = new AttachmentBuilder(buffer, { name: 'banner.png' });

					const trackerBackground = new MediaGalleryBuilder().addItems([{ type: MediaGalleryItem, media: { url: `attachment://${attachment.name}` } }]);

					const legendText = new TextDisplayBuilder().setContent(
						[
							`# ${platformEmote(user.platform)} ${playerTag} SDCore`,
							`-# ${emotes.listArrow} Status: ${playerStatus(user.status)}`,
							`-# ${emotes.listArrow} Level ${account.level.current} · Tier: ${account.level.prestige + 1}/4 · Total: ${account.level.total.toLocaleString()}/2000`,
						].join('\n'),
					);

					const accountText = new TextDisplayBuilder().setContent(
						[
							'## Account',
							`${emotes.listArrow} Level: ${account.level.current}/500`,
							`${emotes.listArrow} Tier: ${account.level.prestige + 1}`,
							`${emotes.listArrow} Total: ${account.level.total.toLocaleString()}/2000`,
						].join('\n'),
					);
					const battlepassText = new TextDisplayBuilder().setContent(
						['## Takeover Split 2 Battlepass', `${emotes.listArrow} Reward Progress: 30/60 (50%)`, `${emotes.listArrow} Badge Progress: 50/100 (50%)`].join('\n'),
					);
					const rankText = new TextDisplayBuilder().setContent(['## Ranked', `${emotes.listArrow} Rank: Rank`, `${emotes.listArrow} Division: Division`, `${emotes.listArrow} Total: Total RP`].join('\n'));

					const profileButtonSection = new SectionBuilder().addTextDisplayComponents(profileButtonDisplay).setButtonAccessory(profileButton);

					const headerSection = new SectionBuilder()
						.addTextDisplayComponents(legendText)
						.setThumbnailAccessory(thumbnail => thumbnail.setURL(`https://specter.apexstats.dev/ApexStats/Banners/${levelBadge(account.level.total)}.png?key=LuH8KT5TxF5tPlQq9xVqkrNSxdPnwWYc`));

					const battlepassSection = new SectionBuilder()
						.addTextDisplayComponents(battlepassText)
						.setThumbnailAccessory(thumbnail => thumbnail.setURL(`https://specter.apexstats.dev/ApexStats/Seasons/Takeover.png?key=LuH8KT5TxF5tPlQq9xVqkrNSxdPnwWYc`));

					const rankedSection = new SectionBuilder()
						.addTextDisplayComponents(rankText)
						.setThumbnailAccessory(thumbnail => thumbnail.setURL(`https://specter.apexstats.dev/ApexStats/Banners/2000.png?key=LuH8KT5TxF5tPlQq9xVqkrNSxdPnwWYc`));

					statsContainer.addMediaGalleryComponents(legendBanner);
					statsContainer.addSectionComponents(headerSection);

					statsContainer.addSeparatorComponents(separator => separator.setSpacing(SeparatorSpacingSize.Small));

					statsContainer.addSectionComponents(battlepassSection);
					statsContainer.addSectionComponents(rankedSection);

					statsContainer.addSeparatorComponents(separator => separator.setSpacing(SeparatorSpacingSize.Small));

					statsContainer.addMediaGalleryComponents(trackerBackground);

					statsContainer.addSectionComponents(profileButtonSection);

					// const statsEmbed = new EmbedBuilder()
					// 	.setTitle(`${platformEmote(user.platform)} ${playerTag} ${user.username} playing ${playerData.active.legend}`)
					// 	.setDescription(`**Status**: ${playerStatus(user.status)}\n-# **Player Added**: <t:${user.userAdded}:d> - **Last Updated**: <t:${user.userUpdated}:d>`)
					// 	.addFields([
					// 		{
					// 			name: `${emotes.account} Account Level`,
					// 			value: `${emotes.listArrow} Current: ${account.level.current}/500\n${emotes.listArrow} Tier: ${account.level.prestige + 1}/4\n${
					// 				emotes.listArrow
					// 			} Total: ${account.level.total.toLocaleString()}/2,000`,
					// 			inline: true,
					// 		},
					// 		{
					// 			name: `${emotes.apexIcon} ${seasonData.info.Name} Split ${seasonData.info.Split} Battle Pass`,
					// 			value: `${battlepassProgress(account.battlepass, seasonData.info)}`,
					// 			inline: true,
					// 		},
					// 		{
					// 			name: `\u200b`,
					// 			value: `${emotes.ranked} **Battle Royale Ranked**`,
					// 			inline: false,
					// 		},
					// 		{
					// 			name: `${getRankName(playerData.ranked.BR)}`,
					// 			value: `${emotes.listArrow} **Division**: ${getDivision(playerData.ranked.BR)}\n${emotes.listArrow} **Total**: ${formatScore(playerData.ranked.BR)} RP`,
					// 			inline: true,
					// 		},
					// 		{
					// 			name: `\u200b`,
					// 			value: `${emotes.listArrow} **RP to Master**: ${pointsTillMaster(playerData.ranked.BR)} RP\n${emotes.listArrow} **RP to Apex Predator**: ${pointsTillPredator(
					// 				playerData.ranked.BR,
					// 				playerData.user.platform,
					// 				rankedData,
					// 			)} RP`,
					// 			inline: true,
					// 		},
					// 		{
					// 			name: `\u200b`,
					// 			value: `${emotes.tracker} **Active Trackers**`,
					// 			inline: false,
					// 		},
					// 		{
					// 			name: trackers[0].id.toString(),
					// 			value: `${emotes.listArrow} ${trackers[0].value.toLocaleString()}`,
					// 			inline: true,
					// 		},
					// 		{
					// 			name: trackers[1].id.toString(),
					// 			value: `${emotes.listArrow} ${trackers[1].value.toLocaleString()}`,
					// 			inline: true,
					// 		},
					// 		{
					// 			name: trackers[2].id.toString(),
					// 			value: `${emotes.listArrow} ${trackers[2].value.toLocaleString()}`,
					// 			inline: true,
					// 		},
					// 	])
					// 	.setImage(`https://specter.apexstats.dev/ApexStats/Legends/${encodeURIComponent(playerData.active.legend)}.png?key=${process.env.SPECTER}`)
					// 	.setFooter({
					// 		text: `Equip the Battle Pass badge in-game to update it!`,
					// 	});

					// interaction.editReply({ embeds: [statsEmbed] });

					interaction.editReply({
						embeds: [],
						components: [statsContainer],
						files: [attachment],
						flags: MessageFlags.IsComponentsV2,
					});
				}),
			)
			.catch(err => {
				if (err.response) {
					console.log(`${chalk.red(`${chalk.bold('[STATS]')} Axios error: ${err.response.data.errorShort}`)}`);

					const errorEmbed = new EmbedBuilder().setTitle('Player Lookup Error').setDescription(`${err.response.data.error}`);

					interaction.editReply({ embeds: [errorEmbed] });
				} else {
					console.error(chalk.red(`${chalk.bold('[STATS]')} Axios error: ${err}`));

					const errorEmbed = new EmbedBuilder().setDescription(`${emotes.listArrow} An error occurred while fetching player data. Please try again later.`);

					interaction.editReply({ embeds: [errorEmbed] });
				}
			});
	},
};
