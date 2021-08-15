const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const got = require('got');
const { version } = require('../../package.json');
const { legendInfo, rankedTitle, getBP, trackerTitle, trackerValue } = require('../../functions/stats.js');
const { DateTime } = require('luxon');
const chalk = require('chalk');

module.exports = {
	name: 'stats',
	description: 'Show your current in-game stats.',

	options: [
		{
			name: 'platform',
			description: 'Which platform your account is on.',
			type: 'STRING',
			required: true,
			choices: [
				{
					name: 'PC (Steam/Origin)',
					value: 'PC',
				},
				{
					name: 'X1 (Xbox)',
					value: 'X1',
				},
				{
					name: 'PS4 (PlayStation)',
					value: 'PS4',
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
		const platform = interaction.options.get('platform').value;
		const username = interaction.options.get('username').value.toString();
		const time = `[${DateTime.local().toFormat('hh:mm:ss')}]`;

		got.get(`https://api.apexstats.dev/stats?platform=${platform}&player=${encodeURIComponent(username)}`, {
			responseType: 'json',
		})
			.then(res => {
				const data = JSON.parse(res.body);

				console.log(chalk`{yellow ${time} Searching for user...}`);

				if (!data) return console.log(chalk`{red Error}`);
				if (!data.user.username) return interaction.followUp({ content: 'Error. Try again.' });

				console.log(chalk`{green ${time} Data found for ${data.user.username} on ${data.user.platform}}`);

				// User Data
				var user = data.user;
				var name = user.username;

				// Account Info
				var account = data.account;
				var level = account.level;
				var bp = account.battlepass.history;

				// Active Data
				var active = data.active;
				var legend = legendInfo(active.legend, 'Name');

				// BR Ranked
				var br = data.ranked.BR;
				var BR_Score = br.score;
				var BR_Name = br.name;
				var BR_Division = br.division;
				var BR_ladderPos = br.ladderPos;

				// Arenas Ranked
				var arenas = data.ranked.Arenas;
				var Arenas_Score = arenas.score;
				var Arenas_Name = arenas.name;
				var Arenas_Division = arenas.division;
				var Arenas_ladderPos = arenas.ladderPos;

				// Trackers
				var trackers = data.active.trackers;
				var tOne = trackers[0];
				var tTwo = trackers[1];
				var tThree = trackers[2];

				var title = `Stats for ${name} on ${platform} playing ${legend}`;

				const stats = new MessageEmbed()
					.setTitle(title)
					.setColor(legendInfo(active.legend, 'Color'))
					.addField(
						'Account Level',
						`:small_blue_diamond: ${level.toLocaleString()}/500\n\n**Battle Royale Ranked**\n:small_blue_diamond: ${rankedTitle(
							BR_Score,
							BR_Name,
							BR_Division,
							BR_ladderPos,
							'RP',
						)}`,
						true,
					)
					.addField(
						'Season 10 BattlePass',
						`:small_blue_diamond: ${getBP(bp)}/110\n\n**Arenas Ranked**\n:small_blue_diamond: ${rankedTitle(
							Arenas_Score,
							Arenas_Name,
							Arenas_Division,
							Arenas_ladderPos,
							'AP',
						)}`,
						true,
					)
					.addField('\u200B', '**Currently Equipped Trackers**')
					.addField(trackerTitle(tOne, legend), trackerValue(tOne), true)
					.addField(trackerTitle(tTwo, legend), trackerValue(tTwo), true)
					.addField(trackerTitle(tThree, legend), trackerValue(tThree), true)
					.setImage(`https://cdn.apexstats.dev/LegendBanners/${legend}.png?q=${version}`)
					.setFooter('BattlePass level incorrect? Equip the badge in-game!');

				interaction.followUp({ embeds: [stats] }).catch(err => {
					console.log(err);
					interaction.followUp({ content: `\`${err}\`` });
				});
			})
			.catch(err => {
				if (!err.body) console.log(err);

				var error = JSON.parse(err.body);

				console.log(chalk`{red ${time} Error: ${error.error}}`);
				interaction.followUp({ content: `Error: \`${error.error}\`` }).catch(err => {
					console.log(err);
					interaction.followUp({ content: `\`${err}\`` });
				});
			});
	},
};
