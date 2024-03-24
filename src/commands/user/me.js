// const db = require('sqlite3');
const axios = require('axios');
const { Axiom } = require('@axiomhq/js');
const db = require('../../utilities/database.js');
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

const { embedColor, Account, Misc } = require('../../data/utilities.json');
const { getStatus, battlepass, platformName, platformEmote, checkUserBan, calcTillMaster, calcTillPred, getRankName, getDivisionCount } = require('../../utilities/stats.js');

const axiomIngest = new Axiom({
	token: process.env.AXIOM_TOKEN,
	orgId: process.env.AXIOM_ORG,
});

module.exports = {
	data: new SlashCommandBuilder().setName('me').setDescription('Shows the stats of your linked Apex account.'),

	async execute(interaction) {
		const loadingEmbed = new EmbedBuilder().setDescription(`${Misc.Loading} Loading data for selected account...`).setColor(embedColor);

		await interaction.editReply({ embeds: [loadingEmbed] });

		let linkQuery = 'SELECT * FROM ApexStats_Specter WHERE discordID = ?';

		const discordID = interaction.user.id;

		db.query(linkQuery, [discordID], async (err, row) => {
			if (err) {
				console.log(err);
				return interaction.editReply({ content: 'There was a database error.', embeds: [] });
			}

			if (row.length === 0) {
				return interaction.editReply({ content: `You do not have a linked account. Use \`/link\` to link an Apex account to your Discord account.`, embeds: [] });
			} else {
				// User already has an account linked
				const playerAPI = axios.get(
					`https://api.jumpmaster.xyz/user/Player?platform=${row[0].platform}&ID=${encodeURIComponent(row[0].playerID)}&key=${process.env.SPYGLASS}`,
				);
				const predAPI = axios.get(`https://api.jumpmaster.xyz/misc/predThreshold`);

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
							const ranked = playerData.ranked;
							const trackers = playerData.active.trackers;

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

							const userTag = user.tag ? `[${user.tag}]` : '';
							const totalRankScore =
								ranked.score < 15000 ? `${ranked.score.toLocaleString()}/${ranked.nextScore.toLocaleString()}` : `${ranked.score.toLocaleString()}`;

							const stats = new EmbedBuilder()
								.setTitle(`${platformEmote(row[0].platform)} ${userTag} ${user.username} playing ${legend}`)
								.setDescription(`**Status:** ${getStatus(status)}\n${checkUserBan(user.bans)}`)
								.addFields([
									{
										name: `${Account.Level} Account`,
										value: `${Misc.GrayBlank} Level ${account.level.current.toLocaleString()} (${accountCompletion}%)\n${Misc.GrayBlank} Prestige ${
											account.level.prestige
										} (${prestigeCompletion}%)`,
										inline: true,
									},
									{
										name: `${Account.BattlePass} Breakout Battle Pass`,
										value: `${Misc.GrayBlank} Level ${battlepass(account.battlepass)} (${battlepassCompletion}%)`,
										inline: true,
									},
									{
										name: `\u200b`,
										value: `**Battle Royale Ranked**`,
									},
									{
										name: getRankName(ranked),
										value: `${Misc.GrayBlank} Division: ${getDivisionCount(ranked)} RP\n${Misc.GrayBlank} Total: ${totalRankScore} RP`,
										inline: true,
									},
									{
										name: `\u200b`,
										value: `${Misc.GrayBlank} Till Master: ${calcTillMaster(ranked)}\n${Misc.GrayBlank} Till Apex Predator: ${calcTillPred(
											ranked,
											predData,
											row[0].platform,
										)}`,
										inline: true,
									},
									{
										name: `\u200b`,
										value: '**Active Trackers**',
									},
									{
										name: trackers[0].id.toString(),
										value: trackers[0].value.toLocaleString(),
										inline: true,
									},
									{
										name: trackers[1].id.toString(),
										value: trackers[1].value.toLocaleString(),
										inline: true,
									},
									{
										name: trackers[2].id.toString(),
										value: trackers[2].value.toLocaleString(),
										inline: true,
									},
								])
								.setImage(`https://cdn.jumpmaster.xyz/Bot/Legends/Banners/${encodeURIComponent(legend)}.png?t=${Math.floor(Math.random() * 10)}}`)
								.setColor(embedColor)
								.setFooter({
									text: `Player Added: ${new Date(user.userAdded * 1000).toUTCString()}\nEquip the Battle Pass badge in-game to update it!`,
								});

							axiomIngest.ingest('apex.stats', [{ platform: platformName(row[0].platform), legend: legend }]);

							interaction.editReply({ embeds: [stats] });
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
			}
		});
	},
};
