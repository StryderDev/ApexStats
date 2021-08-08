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
	/**
	 *
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	run: async (client, message, args) => {
		// Args
		const platform = args[0].toUpperCase();

		function getUser() {
			if (!args[2]) return args[1];
			if (!args[3]) return `${args[1]} ${args[2]}`;
			if (!args[4]) return `${args[1]} ${args[2]} ${args[3]}`;
			if (!args[5]) return `${args[1]} ${args[2]} ${args[3]} ${args[4]}`;
			if (!args[6]) return `${args[1]} ${args[2]} ${args[3]} ${args[4]} ${args[5]}`;
			if (!args[7]) return `${args[1]} ${args[2]} ${args[3]} ${args[4]} ${args[5]} ${args[6]}`;

			return args[1];
		}

		if (platform != 'PC' && platform != 'X1' && platform != 'PS4')
			return message.reply({ content: 'Please use PC, X1, or PS4 for your platform.' });

		message.reply({ content: 'Fetching user stats...' }).then(msg => {
			axios
				.get(`https://api.apexstats.dev/stats?platform=${platform}&player=${encodeURIComponent(getUser())}`)
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
							)}/110 (${getPercent(
								bpLevel(accountInfo.battlepass.history),
								110,
								false,
							)})\n${getPercentageBar(110, bpLevel(accountInfo.battlepass.history))}`,
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
						.addField(
							trackerTitle(tOne.id, findLegendByID(legend)),
							trackerValue(tOne.id, tOne.value),
							true,
						)
						.addField(
							trackerTitle(tTwo.id, findLegendByID(legend)),
							trackerValue(tTwo.id, tTwo.value),
							true,
						)
						.addField(
							trackerTitle(tThree.id, findLegendByID(legend)),
							trackerValue(tThree.id, tThree.value),
							true,
						)
						.setImage(`https://cdn.apexstats.dev/LegendBanners/${findLegendByID(legend)}.png`)
						.setFooter(
							'Weird tracker name? Let SDCore#1234 know!\nBattlePass level not correct? Equip the badge in-game!\nTotal kills may not be up-to-date. Type /killhelp for info.',
						);

					msg.edit({ content: '\u200B', embeds: [stats] });
				})
				.catch(err => {
					if (!err.response.data) return '**Error**, try again.';

					console.log(err.response.data);
					msg.edit({ content: `**Error**\n${err.response.data.error}` });
				});
		});
	},
};
