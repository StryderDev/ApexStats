const axios = require('axios');
const chalk = require('chalk');
const { emoteFile } = require('../../utilities/misc.js');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getRankName, formatScore, getDivision, platformName, playerStatus, platformEmote, pointsTillMaster, pointsTillPredator, battlepassProgress } = require('../../utilities/stats.js');

const emotes = require(`../../data/${emoteFile(process.env.DEBUG)}Emotes.json`);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rank')
		.setDescription('View your current in-game ranked stats')
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

		const loadingEmbed = new EmbedBuilder().setDescription(`${emotes.loading} Loading ranked data for ${username} on ${platformName(platform)}...`);
		await interaction.editReply({ embeds: [loadingEmbed] });

		const playerAPI = axios.get(`https://api.jumpmaster.xyz/user/Stats?platform=${platform}&player=${encodeURIComponent(username)}&key=${process.env.SPYGLASS}`);
		const seasonAPI = axios.get('https://api.jumpmaster.xyz/seasons/Current?version=2');
		const rankedAPI = axios.get('https://api.jumpmaster.xyz/misc/predThreshold');

		await axios
			.all([playerAPI, seasonAPI, rankedAPI])
			.then(
				axios.spread((...res) => {
					const playerData = res[0].data;
					const seasonData = res[1].data.dates;
					const rankedData = res[2].data;

					const user = playerData.user;

					const split = seasonData.split.timestamp;
					const end = seasonData.end.rankedEnd;

					const playerTag = user.tag ? `[${user.tag}]` : '';

					const statsEmbed = new EmbedBuilder().setTitle(`${platformEmote(user.platform)} ${playerTag} ${user.username}`).addFields([
						{ name: ':calendar: Ranked Split', value: `${emotes.listArrow} <t:${split - 1800}:D>\n${emotes.listArrow} <t:${split - 1800}:t>`, inline: true },
						{ name: ':calendar: Ranked End', value: `${emotes.listArrow} <t:${end}:D>\n${emotes.listArrow} <t:${end}:t>`, inline: true },
						{
							name: `\u200b`,
							value: `${emotes.ranked} **Battle Royale Ranked**`,
							inline: false,
						},
						{
							name: `${getRankName(playerData.ranked.BR)}`,
							value: `${emotes.listArrow} **Division**: ${getDivision(playerData.ranked.BR)}\n${emotes.listArrow} **Total**: ${formatScore(playerData.ranked.BR)} RP`,
							inline: true,
						},
						{
							name: `\u200b`,
							value: `${emotes.listArrow} **RP to Master**: ${pointsTillMaster(playerData.ranked.BR)} RP\n${emotes.listArrow} **RP to Apex Predator**: ${pointsTillPredator(
								playerData.ranked.BR,
								playerData.user.platform,
								rankedData,
							)} RP`,
							inline: true,
						},
					]);

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
