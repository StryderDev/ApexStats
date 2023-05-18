const axios = require('axios');
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

const { debug, api } = require('../../config.json');
const { embedColor, Misc, Account } = require('../../data/utilities.json');
const { getStatus, rankLayout, battlepass, platformName, platformEmote, checkUserBan } = require('../../utilities/stats.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('Show currently equipped legend and trackers, account and ranked info, and online status.')
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

		const loadingEmbed = new EmbedBuilder().setDescription(`${Misc.Loading} Loading Data for ${username} on ${platformName(platform)}...`).setColor(embedColor);

		await interaction.editReply({ embeds: [loadingEmbed] });

		const playerAPI = axios.get(`https://api.jumpmaster.xyz/user/Stats?platform=${platform}&player=${encodeURIComponent(username)}&key=${api.spyglass}`);
		const predAPI = axios.get(`https://api.mozambiquehe.re/predator?auth=${api.als}`);

		await axios
			.all([playerAPI, predAPI])
			.then(
				axios.spread((...res) => {
					// Grabbing the data from the axios requests
					const playerData = res[0].data;
					const predData = res[1].data;

					// Main user data
					const user = playerData.user;
					const legend = playerData.active.legend;
					const status = user.status;
					const account = playerData.account;

					// Calculate account, prestige, and battle pass level completion
					const accountCompletion = Math.floor((account.level.current / 500) * 100);

					function checkPrestigeCompletion(amount) {
						if (amount >= 2000) {
							return 2000;
						} else {
							return amount;
						}
					}

					const prestigeCompletion = Math.floor((checkPrestigeCompletion(account.level.total) / 2000) * 100);

					const battlepassCompletion = Math.floor((battlepass(account.battlepass) / 110) * 100);

					const stats = new EmbedBuilder()
						.setTitle(`${platformEmote(user.platform)} ${user.username} playing ${legend}`)
						.setDescription(`**Status:** ${getStatus(status)}\n${checkUserBan(user.bans)}`)
						.addFields([
							{
								name: `${Account.Level} Account`,
								value: `${Misc.GrayBlank} Level ${account.level.current.toLocaleString()} (${accountCompletion}%)\n${Misc.GrayBlank} Prestige ${
									account.level.prestige
								} (${prestigeCompletion}%)`,
							},
						]);

					interaction.editReply({ embeds: [stats] });
				}),
			)
			.catch(error => {
				if (error.response) {
					console.log(error.response.data);

					const errorEmbed = new EmbedBuilder().setTitle('Player Lookup Error').setDescription(error.response.data.error).setColor('D0342C').setTimestamp();

					axios.get(`https://api.jumpmaster.xyz/logs/Stats?type=error&dev=${debug}`);

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
