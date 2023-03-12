const axios = require('axios');
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

const { debug, api } = require('../../config.json');
const { embedColor, Emotes } = require('../../data/utilities.json');
const { getStatus, rankLayout, battlepass, platformName, platformEmote } = require('../../utilities/stats.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('Show currently equipped legend and trackers, account and ranked info, and online status.')
		.addStringOption(option =>
			option.setName('platform').setDescription('The platform you play on').setRequired(true).addChoices(
				{
					name: 'PC (Steam/Origin)',
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

		const loadingEmbed = new EmbedBuilder().setDescription(`${Emotes.Misc.Loading} Loading Data for ${username} on ${platformName(platform)}...`).setColor(embedColor);

		await interaction.editReply({ embeds: [loadingEmbed] });

		await axios
			.get(`https://api.jumpmaster.xyz/user/Stats?platform=${platform}&player=${encodeURIComponent(username)}&key=${api.spyglass}`)
			.then(response => {
				const data = response.data;

				// User Data
				const user = data.user;
				const legend = data.active.legend;
				const status = user.status;
				const ranked = data.ranked.BR;
				const account = data.account;

				// Trackers
				const trackers = data.active.trackers;

				// Calculate account, prestige, and battle pass level completion
				const accountCompletion = Math.floor((account.level.current / 500) * 100);
				const prestigeCompletion = Math.floor((account.level.total / 2000) * 100);
				const battlepassCompletion = Math.floor((battlepass(account.battlepass) / 110) * 100);

				// Stats Embed
				const stats = new EmbedBuilder()
					.setTitle(`${platformEmote(user.platform)} ${user.username} playing ${legend}`)
					.setDescription(`[**Status:** ${getStatus(status)}]`)
					.addFields([
						{
							name: `${Emotes.Account.Level} Account`,
							value: `${Emotes.Misc.GrayBlank} Level ${account.level.current.toLocaleString()} (${accountCompletion}%)\n${Emotes.Misc.GrayBlank} Prestige ${
								account.level.prestige
							} (${prestigeCompletion}%)`,
							inline: true,
						},
						{
							name: `${Emotes.Account.BattlePass} Revelry Battle Pass`,
							value: `${Emotes.Misc.GrayBlank} Level ${battlepass(account.battlepass)} (${battlepassCompletion}%)`,
							inline: true,
						},
						{
							name: `Battle Royale Ranked`,
							value: `${rankLayout(ranked)}\n\n**Active Trackers**`,
						},
						{
							name: trackers[0].id,
							value: trackers[0].value.toLocaleString(),
							inline: true,
						},
						{
							name: trackers[1].id,
							value: trackers[1].value.toLocaleString(),
							inline: true,
						},
						{
							name: trackers[2].id,
							value: trackers[2].value.toLocaleString(),
							inline: true,
						},
					])
					.setImage(`https://cdn.jumpmaster.xyz/Bot/Legends/Banners/${encodeURIComponent(legend)}.png?t=${Math.floor(Math.random() * 10)}`)
					.setColor(embedColor)
					.setFooter({
						text: `Player Added: ${new Date(user.userAdded * 1000).toUTCString()}\nEquip the Battle Pass badge to update it!`,
					});

				// Logging
				axios.get(`https://api.jumpmaster.xyz/logs/Stats?type=success&dev=${debug}`);

				interaction.editReply({ embeds: [stats] });
			})
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
