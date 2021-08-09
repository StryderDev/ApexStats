const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const axios = require('axios');
const { version } = require('../../package.json');
const { legendName, legendColor } = require('../../functions/stats.js');
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
		const username = interaction.options.get('username').value;
		const time = `[${DateTime.local().toFormat('hh:mm:ss')}]`;

		axios
			.get(`https://api.apexstats.dev/stats?platform=${platform}&player=${encodeURIComponent(username)}`)
			.then(response => {
				console.log(chalk`{yellow ${time} Searching for user...}`);
				if (!response.data) return console.log(chalk`{red Error}`);
				console.log(
					chalk`{green ${time} Data found for ${response.data.user.username} on ${response.data.user.platform}}`,
				);

				// User Data
				var user = response.data.user;
				var name = user.username;

				// Account Info
				var account = response.data.account;
				var level = account.level;
				var bp = account.battlepass.level;

				// Active Data
				var active = response.data.active;
				var legend = legendName(active.legend);

				// BR Ranked
				var br = response.data.ranked.BR;
				var BR_Score = br.score;
				var BR_Name = br.name;
				var BR_Division = br.division;

				// Arenas Ranked
				var arenas = response.data.ranked.Arenas;
				var Arenas_Score = arenas.score;
				var Arenas_Name = arenas.name;
				var Arenas_Division = arenas.division;

				var title = `Stats for ${name} on ${platform} playing ${legend}`;

				const stats = new MessageEmbed()
					.setTitle(title)
					.setColor(legendColor(active.legend))
					.addField(':crown: Account Level', `:small_blue_diamond: ${level}/500`, true)
					.addField(':medal: Season 10 BattlePass', `:small_blue_diamond: ${bp}/110`, true)
					.addField('\u200B', '\u200B', true)
					.addField('BR Ranked', `:small_blue_diamond: ${BR_Name} ${BR_Division} (${BR_Score} RP)`, true)
					.addField(
						'Arenas Ranked',
						`:small_blue_diamond: ${Arenas_Name} ${Arenas_Division} (${Arenas_Score} RP)`,
						true,
					)
					.addField('\u200B', '\u200B', true)
					.setImage(`https://cdn.apexstats.dev/LegendBanners/${legend}.png?q=${version}`);

				interaction.followUp({ embeds: [stats] }).catch(err => {
					console.log(err);
					interaction.followUp({ content: `\`${err}\`` });
				});
			})
			.catch(err => {
				if (!err || !err.response || !err.response.data) return console.log(`Unknown Error.\n${err}`);

				console.log(err.response.data.error);

				function getError(code) {
					if (code == 1) return 'Player or Platform not specified.';

					if (code == 2) return 'There was not a valid platform provided';

					if (code == 3) return 'Error loading search API. Try again later.';

					if (code == 4) return 'Could not find a user with that username.';

					if (code == 5) return "This player exists, but they haven't played Apex. Try another username.";

					return `Error: ${code}`;
				}

				interaction.followUp({ content: `\`${getError(err.response.data.errorCode)}\`` }).catch(err => {
					console.log(err);
					interaction.followUp({ content: `\`${err}\`` });
				});
			});
	},
};
