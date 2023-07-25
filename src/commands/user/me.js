// const db = require('sqlite3');
const axios = require('axios');
const db = require('../../utilities/database.js');
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

const { debug, api } = require('../../config.json');
const { embedColor, Account, Misc } = require('../../data/utilities.json');
const { getStatus, rankLayout, battlepass, platformName, platformEmote } = require('../../utilities/stats.js');

module.exports = {
	data: new SlashCommandBuilder().setName('me').setDescription('Shows the stats of your linked Apex account.'),

	async execute(interaction) {
		const loadingEmbed = new EmbedBuilder().setDescription(`${Misc.Loading} Loading data for selected account...`).setColor(embedColor);

		await interaction.editReply({ embeds: [loadingEmbed] });

		let linkQuery = 'SELECT * FROM specter_dev WHERE discordID = ?';

		const discordID = interaction.user.id;

		db.query(linkQuery, [discordID], (err, row) => {
			if (err) {
				console.log(err);
				return interaction.editReply({ content: 'There was a database error.', embeds: [] });
			}

			if (row.length === 0) {
				return interaction.editReply({ content: `You do not have a linked account. Use \`/link\` to link an Apex account to your Discord account.`, embeds: [] });
			} else {
				// User already has an account linked
				axios
					.get(`https://api.jumpmaster.xyz/user/Player?platform=${row[0].platform}&ID=${encodeURIComponent(row[0].playerID)}&key=${api.spyglass}`)
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
									name: `${Account.Level} Account`,
									value: `${Misc.GrayBlank} Level ${account.level.current.toLocaleString()} (${accountCompletion}%)\n${Misc.GrayBlank} Prestige ${
										account.level.prestige
									} (${prestigeCompletion}%)`,
									inline: true,
								},
								{
									name: `${Account.BattlePass} Revelry Battle Pass`,
									value: `${Misc.GrayBlank} Level ${battlepass(account.battlepass)} (${battlepassCompletion}%)`,
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
			}
		});
	},
};
