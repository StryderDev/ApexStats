const { CommandInteraction, MessageEmbed } = require('discord.js');
const config = require('../../config.json');
const chalk = require('chalk');
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
	description: 'Shows your current legend stats.',

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

	run: async (client, interaction) => {
		// Args
		const platform = interaction.options.get('platform');
		const username = interaction.options.get('username');

		interaction.editReply({ content: 'Retrieving user stats...' });

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

				// Emotes
				var accountLevelEmote = '<:AccountLevel:870568814205624360>';
				var battlepassLevelEmote = '<:Season_9:870570775751573504>';

				// User Data
				var userData = response.userData;
				var username = userData.username;
				var platform = userData.platform;
				var online = userData.online;
				var ingame = userData.ingame;

				// Account Info
				var accountInfo = response.accountInfo;
				var legend = accountInfo.active.legend;
				var level = accountInfo.level;

				// BR Ranked
				var BR = accountInfo.Ranked.BR;
				var BR_Rank = BR.name;
				var BR_Pos = BR.ladderPos;
				var BR_Div = BR.division;
				var BR_Score = BR.score;

				// Arena Ranked
				var Arena = accountInfo.Ranked.Arenas;
				var Arena_Rank = Arena.name;
				var Arena_Pos = Arena.ladderPos;
				var Arena_Div = Arena.division;
				var Arena_Score = Arena.score;

				// Trackers
				var tracker = response.accountInfo.active;
				var tOne = tracker.trackers[0];
				var tTwo = tracker.trackers[1];
				var tThree = tracker.trackers[2];

				const user = new MessageEmbed()
					.setTitle(`Stats for ${username} on ${platform} playing ${findLegendByID(legend)}`)
					.setDescription(checkStatus(online, ingame))
					.setColor(getColor(legend))
					.addField(
						`${accountLevelEmote} Account`,
						`Level ${level.toLocaleString()}/500 (${getPercent(level, 500, true)})\n${getPercentageBar(
							500,
							level,
						)}\n\n**${battlepassLevelEmote} Season 9 BattlePass**\nLevel ${bpLevel(
							accountInfo.battlepass.history,
							accountInfo.battlepass.history.season9,
						)}/110 (${getPercent(
							bpLevel(accountInfo.battlepass.history, accountInfo.battlepass.history.season9),
							110,
							false,
						)})\n${getPercentageBar(
							110,
							bpLevel(accountInfo.battlepass.history, accountInfo.battlepass.history.season9),
						)}`,
						true,
					)
					.addField(
						'Battle Royale Ranked',
						`${findRank(
							BR_Rank,
							BR_Pos,
							BR_Div,
						)}\n<:Season_9:870573880006287392> ${BR_Score.toLocaleString()} RP\n\n**Arenas Ranked**\n${findRank(
							Arena_Rank,
							Arena_Pos,
							Arena_Div,
						)}\n<:Season_9:870573880006287392> ${Arena_Score.toLocaleString()} RP`,
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

				interaction.editReply({ embeds: [user], content: `\u200B` });
			})
			.catch(error => {
				if (config.debug == true) {
					console.log(error.response.data);
				}

				if (
					error.response.data == null ||
					error.response.data == undefined ||
					error.response.data == 'undefined'
				) {
					console.log('-- ERROR WAS NOT DEFINED --');
					return msg.say('There was an error that was not caught. Please try again.');
				}

				function checkErrorType(code) {
					if (code == '1')
						return "**Error**\nThere was no platform and/or username specific. This shouldn't happen, so contact SDCore#1234 if you see this.";

					if (code == '3')
						return '**Error**\nThere was an error connecting to an external API. Please try again or contact SDCore#1234 if the problem persists.';

					if (code == '4')
						return `**Error**\nUsername '${username.value}' on ${platform.value} not found. Either it is incorrect, or it doesn't exist. Try using the username of your Origin account.`;

					if (code == '5')
						return `**Error**\nUsername '${username.value}' on ${platform.value} was found, but that account hasn't played Apex. Try a different username.`;

					return '**Error**\nGeneric, unhandled error. Contact SDCore#1234 if you see this.';
				}

				interaction.editReply({ content: checkErrorType(error.response.data.errorCode) });
			});
	},
};
