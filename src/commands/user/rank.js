const axios = require('axios');
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

const { embedColor, Account, Misc } = require('../../data/utilities.json');
const { getStatus, rankLayout, platformName, platformEmote, checkUserBan, getRankName, getDivisionCount, calcTillMaster, calcTillPred } = require('../../utilities/stats.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rank')
		.setDescription('Shows your current in-game Battle Royale rank.')
		.addStringOption(option =>
			option.setName('platform').setDescription('The platform you play on').setRequired(true).addChoices(
				{
					name: 'PC (Steam/EA App)',
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
		.addStringOption(option => option.setName('username').setDescription("Your in-game username. If this doesn't work, try a previous username").setRequired(true)),

	async execute(interaction) {
		// Slash Command Options
		const platform = interaction.options.getString('platform');
		const username = interaction.options.getString('username');

		const loadingEmbed = new EmbedBuilder().setDescription(`${Misc.Loading} Loading Ranked Data for ${username} on ${platformName(platform)}...`).setColor(embedColor);

		await interaction.editReply({ embeds: [loadingEmbed] });

		const playerAPI = axios.get(`https://api.jumpmaster.xyz/user/Stats?platform=${platform}&player=${encodeURIComponent(username)}&key=${process.env.SPYGLASS}`);
		const predAPI = axios.get(`https://api.jumpmaster.xyz/misc/predThreshold`);

		await axios
			.all([playerAPI, predAPI])
			.then(
				axios.spread((...res) => {
					// Grabbing the data from the axios requests
					const playerData = res[0].data;
					const predData = res[1].data;

					// User Data
					const user = playerData.user;
					const status = user.status;
					const ranked = playerData.ranked.BR;
					const account = playerData.account;

					// Calculate account and prestige level completion
					const accountCompletion = Math.floor((account.level.current / 500) * 100);
					const prestigeCompletion = Math.floor((account.level.total / 2000) * 100);

					// Rank Embed
					const rank = new EmbedBuilder()
						.setTitle(`${platformEmote(user.platform)} ${user.username}`)
						.setDescription(`**Status:** ${getStatus(status)}\n${checkUserBan(user.bans)}`)
						.addFields([
							{
								name: `${Account.Level} Account`,
								value: `${Misc.GrayBlank} Level ${account.level.current} (${accountCompletion}%)\n${Misc.GrayBlank} Prestige ${account.level.prestige} (${prestigeCompletion}%)\n\n**Battle Royale Ranked**`,
							},
							{
								name: getRankName(ranked),
								value: `${Misc.GrayBlank} Division: ${getDivisionCount(ranked)}/1000 LP\n${Misc.GrayBlank} Total: ${ranked.score.toLocaleString()} LP`,
								inline: true,
							},
							{
								name: `\u200b`,
								value: `${Misc.GrayBlank} Till Master: ${calcTillMaster(ranked)}\n${Misc.GrayBlank} Till Apex Predator: ${calcTillPred(
									ranked,
									predData,
									platform,
								)}`,
								inline: true,
							},
						])
						.setColor(embedColor)
						.setFooter({
							text: `Player Added: ${new Date(user.userAdded * 1000).toUTCString()}`,
						});

					// Logging
					// axios.get(`https://api.jumpmaster.xyz/logs/Stats?type=success&dev=${debug}`);

					interaction.editReply({ embeds: [rank] });
				}),
			)
			.catch(error => {
				if (error.response) {
					console.log(error.response.data);

					const errorEmbed = new EmbedBuilder().setTitle('Player Lookup Error').setDescription(error.response.data.error).setColor('D0342C').setTimestamp();

					// axios.get(`https://api.jumpmaster.xyz/logs/Stats?type=error&dev=${debug}`);

					interaction.editReply({ embeds: [errorEmbed] });
				} else if (error.request) {
					console.log(error.request);

					const errorEmbed = new EmbedBuilder()
						.setTitle('Site Lookup Error')
						.setDescription(`The request was not returned successfully.\nThis is potentially an error with the API.\nPlease try again shortly.`)
						.setColor('D0342C')
						.setTimestamp();

					interaction.editReply({ embeds: [errorEmbed] });
				} else {
					console.log(error.message);

					const errorEmbed = new EmbedBuilder()
						.setTitle('Unknown Error')
						.setDescription(`This should never happen.\nIf you see this error, please contact <@360564818123554836> ASAP.`)
						.setColor('D0342C');

					interaction.editReply({ embeds: [errorEmbed] });
				}
			});
	},
};
