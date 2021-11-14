const got = require('got');
const chalk = require('chalk');
const { DateTime } = require('luxon');
const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const { findLegendByID, userRank, BPLevel, trackerTitle, trackerValue } = require('../../functions/stats.js');

module.exports = {
	name: 'stats',
	description: 'Show you in-game legend stats.',
	type: 'CHAT_INPUT',
	options: [
		{
			name: 'platform',
			type: 'STRING',
			description: 'The platform you play on.',
			required: true,
			choices: [
				{
					name: 'PC (Origin/Steam)',
					value: 'PC',
				},
				{
					name: 'PlayStation (PS4/PS5)',
					value: 'PS4',
				},
				{
					name: 'Xbox (Xbox 1/Xbox Series S/Xbox Series X)',
					value: 'X1',
				},
				{
					name: 'Nintendo Switch',
					value: 'Switch',
				},
			],
		},
		{
			name: 'username',
			type: 'STRING',
			description: 'Your in-game username.',
			required: true,
		},
	],
	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 * @param {String[]} args
	 */
	run: async (client, interaction, args) => {
		const timeLogs = DateTime.local().toFormat('hh:mm:ss');
		const platform = args[0];
		const username = args[1];

		if (platform == 'Switch')
			return await interaction
				.followUp({
					content: 'Unfortunately, stats for the **Nintendo Switch** are currently **not** supported.',
				})
				.catch(e => interaction.followUp(e));

		try {
			got.get(`https://api.apexstats.dev/stats?platform=${platform}&player=${encodeURIComponent(username)}`, {
				responseType: 'json',
			})
				.then(res => {
					// General Data
					var data = res.body;

					// User Data
					var user = data.user;
					var name = user.username;
					var platform = user.platform;
					var updated = user.lastUpdated;

					// Account Data
					var account = data.account;
					var level = account.level.toLocaleString();
					var currentBP = account.battlepass.level;

					if (!account.battlepass.history || account.battlepass.history == undefined) {
						var seasonBP = '0';
					} else {
						var seasonBP = account.battlepass.history.season11;
					}

					// Battle Royale Ranked Data
					var br = data.ranked.BR;
					var BR_Score = br.score.toLocaleString();
					var BR_Name = br.name;
					var BR_Division = br.division;
					var BR_Pos = br.ladderPos;

					// Arenas Ranked Data
					var arenas = data.ranked.Arenas;
					var Arenas_Score = arenas.score.toLocaleString();
					var Arenas_Name = arenas.name;
					var Arenas_Division = arenas.division;
					var Arenas_Pos = arenas.ladderPos;

					// Active Data
					var active = data.active;
					var legend = active.legend;

					// Tracker Data
					var trackers = active.trackers;
					var trackerOne = trackers[0];
					var trackerTwo = trackers[1];
					var trackerThree = trackers[2];

					const stats = new MessageEmbed()
						.setTitle(`Stats for ${name} playing ${findLegendByID(legend)} on ${platform}`)
						.addField('<:ApexIcon:909362743885332482> User Status', '<:BlackDot:742540201473343529> N/A')
						.addField(
							'<:ApexIcon:909362743885332482> Account',
							`<:AccountLevel:824571962420101122> Level ${level}\n\n<:ApexIcon:909362743885332482> **Battle Royale Ranked**\n<:BlackDot:742540201473343529> ${userRank(
								BR_Name,
								BR_Division,
								BR_Pos,
							)}\n<:BlankIcon:909366278727303168> ${BR_Score} RP`,
							true,
						)
						.addField(
							'<:ApexIcon:909362743885332482> Escape Battlepass',
							`<:Season11:909367844335128596> Level ${BPLevel(
								currentBP,
								seasonBP,
							)}\n\n<:ApexIcon:909362743885332482> **Arenas Ranked**\n<:BlackDot:742540201473343529> ${userRank(
								Arenas_Name,
								Arenas_Division,
								Arenas_Pos,
							)}\n<:BlankIcon:909366278727303168> ${Arenas_Score} AP`,
							true,
						)
						.addField('\u200b', '**Currently Equipped Trackers**')
						.addField(
							trackerTitle(trackerOne.id, findLegendByID(legend)),
							trackerValue(trackerOne.id, trackerOne.value),
							true,
						)
						.addField(
							trackerTitle(trackerTwo.id, findLegendByID(legend)),
							trackerValue(trackerTwo.id, trackerTwo.value),
							true,
						)
						.addField(
							trackerTitle(trackerThree.id, findLegendByID(legend)),
							trackerValue(trackerThree.id, trackerThree.value),
							true,
						)
						.setImage(`https://cdn.apexstats.dev/LegendBanners/${findLegendByID(legend)}.png`)
						.setFooter(
							`Incorrect BP Level? Equip the latest BP badge in-game!\nAccount Last Updated: ${updated} UTC.`,
						);

					return interaction
						.followUp({
							embeds: [stats],
						})
						.catch(err => interaction.followUp(err));
				})
				.catch(err => {
					if (err.response) {
						console.log(chalk`{red.bold [${timeLogs}] Error: ${err.response.body.error}}`);
						return interaction
							.followUp({
								content: `There was an error processing your request\n\`${err.response.body.error}\``,
							})
							.catch(e => interaction.followUp(e));
					} else {
						console.log(chalk`{red.bold [${timeLogs}] Error: ${err.message}}`);
						return interaction
							.followUp({
								content: `There was an error processing your request\n\`${err.message}\``,
							})
							.catch(e => interaction.followUp(e));
					}
				});
		} catch (e) {
			console.error(chalk`{red.bold [${timeLogs}] Error: ${e}}`);

			return await interaction
				.followUp({
					content: `There was an error processing your request\n\`${e}\``,
				})
				.catch(err => interaction.followUp(err));
		}
	},
};
