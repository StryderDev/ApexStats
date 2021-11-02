const got = require('got');
const chalk = require('chalk');
const { DateTime } = require('luxon');
const { Client, CommandInteraction, MessageEmbed } = require('discord.js');

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
					const headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';
					console.log('Status Code:', res.statusCode);
					console.log('Date in Response header:', headerDate);
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
