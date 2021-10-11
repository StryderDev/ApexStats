const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const chalk = require('chalk');
const axios = require('axios');
const { DateTime } = require('luxon');
const {
	findLegendByID,
	userStatus,
	BPLevel,
	userRank,
	trackerTitle,
	trackerValue,
} = require('../../functions/stats.js');

module.exports = {
	name: 'stats',
	description: 'Show your in-game legend stats.',
	type: 'CHAT_INPUT',
	options: [
		{
			name: 'platform',
			type: 'STRING',
			description: 'Pick your platform.',
			required: true,
			choices: [
				{
					name: 'PC (Origin/Steam)',
					value: 'PC',
				},
				{
					name: 'Xbox',
					value: 'X1',
				},
				{
					name: 'PlayStation (PS4/PS5)',
					value: 'PS4',
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

		// If the selected platform is the Switch, return and error
		// since it's not possible to get those stats (yet).
		if (platform == 'Switch')
			return await interaction
				.followUp({
					content: 'Unfortunately, stats for the **Nintendo Switch** are currently **not** supported.',
				})
				.catch(e => interaction.editReply(e));

		try {
			const response = await axios.get(
				`https://api.apexstats.dev/stats?platform=${platform}&player=${encodeURIComponent(username)}`,
			);

			// User Data
			var user = response.data.user;
			var name = user.username;
			var updated = user.lastUpdated;
			var online = user.status.online;
			var ingame = user.status.ingame;
			var party = user.status.partyInMatch;
			var length = user.status.matchLength;

			// Account Data
			var account = response.data.account;
			var level = account.level.toLocaleString();
			var currentBP = account.battlepass.level;
			var seasonBP = account.battlepass.history.season10;

			// Battle Royale Ranked Data
			var br = response.data.ranked.BR;
			var BR_Score = br.score.toLocaleString();
			var BR_Name = br.name;
			var BR_Division = br.division;
			var BR_Pos = br.ladderPos;

			// Arenas Ranked Data
			var arenas = response.data.ranked.Arenas;
			var Arenas_Score = arenas.score.toLocaleString();
			var Arenas_Name = arenas.name;
			var Arenas_Division = arenas.division;
			var Arenas_Pos = arenas.ladderPos;

			// Active Data
			var active = response.data.active;
			var legend = active.legend;

			// Tracker Data
			var trackers = active.trackers;
			var trackerOne = trackers[0];
			var trackerTwo = trackers[1];
			var trackerThree = trackers[2];

			const userStats = new MessageEmbed()
				.setTitle(`Stats for ${name} playing ${findLegendByID(legend)} on ${response.data.user.platform}`)
				.addField(':small_blue_diamond: User Status', userStatus(online, ingame, party, length))
				.addField(
					':small_blue_diamond: Account',
					`:small_orange_diamond: Level ${level}\n\n**:small_blue_diamond: Battle Royale Ranked**\n:small_orange_diamond: ${userRank(
						BR_Name,
						BR_Division,
						BR_Pos,
					)}\n:small_orange_diamond: ${BR_Score} RP`,
					true,
				)
				.addField(
					':small_blue_diamond: Emergence BattlePass',
					`:small_orange_diamond: Level ${BPLevel(
						currentBP,
						seasonBP,
					)}\n\n**:small_blue_diamond: Arenas Ranked**\n:small_orange_diamond: ${userRank(
						Arenas_Name,
						Arenas_Division,
						Arenas_Pos,
					)}\n:small_orange_diamond: ${Arenas_Score} RP`,
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

			await interaction.followUp({ embeds: [userStats] }).catch(e => interaction.editReply(e));
		} catch (error) {
			if (!error.response) {
				return console.error(chalk`{red.bold [${timeLogs}] Error: ${error}}`);
			}

			console.error(
				chalk`{red.bold [${timeLogs}] Error Code: ${error.response.data.errorCode}, "${error.response.data.error}" on Stats API in Stats Command.}`,
			);

			if (error.response.data.errorCode == '3' || error.response.data.errorCode == '4')
				return await interaction.followUp({
					content: 'Could not find that username. Try again.',
				});

			return await interaction.followUp({
				content: 'There was an error loading the Stats API. Try again in a few minutes.',
			});
		}
	},
};
