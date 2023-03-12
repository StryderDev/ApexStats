const axios = require('axios');
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

const { debug, api } = require('../../config.json');
const { embedColor, Emotes } = require('../../data/utilities.json');
const { getStatus, rankLayout, platformName, platformEmote } = require('../../utilities/stats.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rank')
		.setDescription('Shows your current in-game Battle Royale rank.')
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

		const loadingEmbed = new EmbedBuilder().setDescription(`${Emotes.Misc.Loading} Loading Ranked Data for ${username} on ${platformName(platform)}...`).setColor(embedColor);

		await interaction.editReply({ embeds: [loadingEmbed] });

		await axios
			.get(`https://api.jumpmaster.xyz/user/Stats?platform=${platform}&player=${encodeURIComponent(username)}&key=${api.spyglass}`)
			.then(response => {
				const data = response.data;

				// User Data
				const user = data.user;
				const status = user.status;
				const ranked = data.ranked.BR;

				// Rank Embed
				const rank = new EmbedBuilder()
					.setTitle(`${platformEmote(user.platform)} ${user.username}`)
					.setDescription(`[**Status:** ${getStatus(status)}]`)
					.addFields([
						{
							name: `${Emotes.Account.Level} Account`,
							value: `${Emotes.Misc.GrayBlank} Level ${data.account.level.current}\n${Emotes.Misc.GrayBlank} Prestige ${data.account.level.prestige}`,
							inline: true,
						},
						{
							name: `Battle Royale Ranked`,
							value: rankLayout(ranked),
							inline: true,
						},
					])
					.setColor(embedColor)
					.setFooter({
						text: `Player Added: ${new Date(user.userAdded * 1000).toUTCString()}`,
					});

				// Logging
				axios.get(`https://api.jumpmaster.xyz/logs/Stats?type=success&dev=${debug}`);

				interaction.editReply({ embeds: [rank] });
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
