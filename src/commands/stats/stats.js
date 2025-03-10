const axios = require('axios');
const chalk = require('chalk');
const { emoteFile } = require('../../utilities/misc.js');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { platformName, playerStatus, platformEmote, battlepassProgress } = require('../../utilities/stats.js');

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

		const loadingEmbed = new EmbedBuilder().setDescription(`${emotes.loading} Loading player data for ${username} on ${platformName(platform)}...`);
		await interaction.editReply({ embeds: [loadingEmbed] });

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

					const statsEmbed = new EmbedBuilder()
						.setTitle(`${platformEmote(user.platform)} ${playerTag} ${user.username} playing ${playerData.active.legend}`)
						.setDescription(`**Status**: ${playerStatus(user.status)}\n-# **Player Added**: <t:${user.userAdded}:d> - **Last Updated**: <t:${user.userUpdated}:d>`)
						.addFields([
							{
								name: `${emotes.account} Account Level`,
								value: `${emotes.listArrow} Current: ${account.level.current}/500\n${emotes.listArrow} Tier: ${account.level.prestige + 1}/4\n${
									emotes.listArrow
								} Total: ${account.level.total.toLocaleString()}/2,000`,
								inline: true,
							},
							{
								name: `${emotes.apexIcon} ${seasonData.info.Name} Split ${seasonData.info.Split} Battle Pass`,
								value: `${battlepassProgress(account.battlepass, seasonData.info)}`,
								inline: true,
							},
							{
								name: `\u200b`,
								value: '**Battle Royale Ranked**',
								inline: false,
							},
							{
								name: `Ranked Data`,
								value: `Ranked Data Part 2`,
								inline: true,
							},
							{
								name: `\u200b`,
								value: `RP Stuff`,
								inline: true,
							},
							{
								name: `\u200b`,
								value: '**Active Trackers**',
								inline: false,
							},
							{
								name: trackers[0].id.toString(),
								value: `${emotes.listArrow} ${trackers[0].value.toLocaleString()}`,
								inline: true,
							},
							{
								name: trackers[1].id.toString(),
								value: `${emotes.listArrow} ${trackers[1].value.toLocaleString()}`,
								inline: true,
							},
							{
								name: trackers[2].id.toString(),
								value: `${emotes.listArrow} ${trackers[2].value.toLocaleString()}`,
								inline: true,
							},
						])
						.setImage(`https://specter.apexstats.dev/ApexStats/Legends/${encodeURIComponent(playerData.active.legend)}.png?key=${process.env.SPECTER}`)
						.setFooter({
							text: `Equip the Battle Pass badge in-game to update it!`,
						});

					interaction.editReply({ embeds: [statsEmbed] });
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
