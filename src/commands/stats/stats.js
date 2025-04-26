const axios = require('axios');
const chalk = require('chalk');
const { emoteFile } = require('../../utilities/misc.js');
const {
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
const { getRankName, formatScore, getDivision, platformName, playerStatus, platformEmote, pointsTillMaster, pointsTillPredator, battlepassProgress } = require('../../utilities/stats.js');

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
				axios.spread((...res) => {
					const playerData = res[0].data;
					const seasonData = res[1].data;
					const rankedData = res[2].data;

					const user = playerData.user;
					const account = playerData.account;
					const trackers = playerData.active.trackers;

					const playerTag = user.tag ? `[${user.tag}]` : '';

					const statsContainer = new ContainerBuilder();

					const legendBanner = new MediaGalleryBuilder().addItems([
						{ type: MediaGalleryItem, media: { url: 'https://specter.apexstats.dev/ApexStats/Legends/V2/Conduit.png?key=LuH8KT5TxF5tPlQq9xVqkrNSxdPnwWYc' } },
					]);

					const profileButton = new ButtonBuilder().setLabel('View Profile').setStyle(ButtonStyle.Link).setURL('https://apexstats.dev/').setDisabled(true);

					const legendText = new TextDisplayBuilder().setContent([`# ${platformEmote(user.platform)} ${playerTag} SDCore`, `-# Status: ${playerStatus(user.status)}`].join('\n'));

					const headerSection = new SectionBuilder().addTextDisplayComponents(legendText).setButtonAccessory(profileButton);

					statsContainer.addMediaGalleryComponents(legendBanner);
					statsContainer.addSectionComponents(headerSection);

					statsContainer.addSeparatorComponents(separator => separator.setSpacing(SeparatorSpacingSize.Small));

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
