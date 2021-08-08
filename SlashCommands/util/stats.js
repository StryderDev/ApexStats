const { CommandInteraction, MessageEmbed } = require('discord.js');
const config = require('../../config.json');
const axios = require('axios');
const {
	findLegendByID,
	checkStatus,
	getColor,
	getPercent,
	getPercentageBar,
	bpLevel,
	findRank,
	trackerTitle,
	trackerValue,
} = require('../functions/stats.js');

module.exports = {
	name: 'stats',
	description: 'Show your in-game legend stats.',

	options: [
		{
			name: 'platform',
			description: 'Which platform you play on.',
			type: 'STRING',
			required: true,
			choices: [
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
			],
		},
		{
			name: 'username',
			description: 'Your in-game username.',
			type: 'STRING',
			required: true,
		},
	],

	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 */
	run: async (client, interaction) => {
		// Args
		const platform = interaction.options.get('platform');
		const username = interaction.options.get('username');

		interaction.followUp({
			content: `Retreiving user stats...`,
		});

		axios
			.get(
				`https://api.apexstats.dev/stats?platform=${platform.value}&player=${encodeURIComponent(
					username.value,
				)}`,
			)
			.then(function (response) {
				// Set main response to data object
				console.log(`-- Fetching user data --`);
				if (!response.data) {
					console.log('There was an error with this response.');
					interaction.editReply({ content: 'There was an error processing this command. Try again.' });
				} else {
					var response = response.data;
					console.log(`-- Data fetched --`);
				}

				// User Data
				var userData = response.user;
				var username = userData.username;
				var platform = userData.platform;
				var online = userData.status.online;
				var ingame = userData.status.ingame;
				var partyInMatch = userData.status.partyInMatch;
				var matchLength = userData.status.matchLength;

				// Account Info
				var accountInfo = response.account;
				var legend = response.active.legend;
				var level = accountInfo.level;

				// BR Ranked
				var BR = response.ranked.BR;
				var BR_Rank = BR.name;
				var BR_Pos = BR.ladderPos;
				var BR_Div = BR.division;
				var BR_Score = BR.score;

				// Arena Ranked
				var Arena = response.ranked.Arenas;
				var Arena_Rank = Arena.name;
				var Arena_Pos = Arena.ladderPos;
				var Arena_Div = Arena.division;
				var Arena_Score = Arena.score;

				// Trackers
				var tracker = response.active;
				var tOne = tracker.trackers[0];
				var tTwo = tracker.trackers[1];
				var tThree = tracker.trackers[2];

				const stats = new MessageEmbed()
					.setTitle(`Stats for ${username} on ${platform} playing ${findLegendByID(legend)}`)
					.setDescription(checkStatus(online, ingame, partyInMatch, matchLength))
					.setColor(getColor(legend))
					.addField(
						`Account`,
						`Level ${level.toLocaleString()}/500 (${getPercent(level, 500, true)})\n${getPercentageBar(
							500,
							level,
						)}\n\n**Season 10 BattlePass**\nLevel ${bpLevel(
							accountInfo.battlepass.history,
						)}/110 (${getPercent(bpLevel(accountInfo.battlepass.history), 110, false)})\n${getPercentageBar(
							110,
							bpLevel(accountInfo.battlepass.history),
						)}`,
						true,
					)
					.addField(
						'Battle Royale Ranked',
						`${findRank(
							BR_Rank,
							BR_Pos,
							BR_Div,
							'BR',
							BR_Score,
						)}\n${BR_Score.toLocaleString()} RP\n\n**Arenas Ranked**\n${findRank(
							Arena_Rank,
							Arena_Pos,
							Arena_Div,
							'Arena',
							Arena_Score,
						)}\n${Arena_Score.toLocaleString()} RP`,
						true,
					)
					.addField('\u200b', '\u200b', true)
					.addField('Battle Royale Kills', response.data.Total_BR_Kills.toLocaleString(), true)
					.addField('Arenas Kills', response.data.Total_Arenas_Kills.toLocaleString(), true)
					.addField('Total Kills', response.data.Total_Kills.toLocaleString(), true)
					.addField('\u200b', '**Currently Equipped Trackers**')
					.addField(trackerTitle(tOne.id, findLegendByID(legend)), trackerValue(tOne.id, tOne.value), true)
					.addField(trackerTitle(tTwo.id, findLegendByID(legend)), trackerValue(tTwo.id, tTwo.value), true)
					.addField(
						trackerTitle(tThree.id, findLegendByID(legend)),
						trackerValue(tThree.id, tThree.value),
						true,
					)
					.setImage(`https://cdn.apexstats.dev/LegendBanners/${findLegendByID(legend)}.png`)
					.setFooter(
						'Weird tracker name? Let SDCore#1234 know!\nBattlePass level not correct? Equip the badge in-game!\nTotal kills may not be up-to-date. Type /killhelp for info.',
					);

				interaction.editReply({ content: '\u200B', embeds: [stats] });
			})
			.catch(err => {
				console.log(err.response.data);
				interaction.editReply({ content: `**Error**\n${err.response.data.error}` });
			});
	},
};
