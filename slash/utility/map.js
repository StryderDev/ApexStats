const got = require('got');
const chalk = require('chalk');
const { DateTime } = require('luxon');
const { Client, CommandInteraction, MessageEmbed } = require('discord.js');

module.exports = {
	name: 'map',
	description: 'Returns current and future map rotation info.',
	type: 'CHAT_INPUT',
	options: [
		{
			name: 'amount',
			type: 'INTEGER',
			description: 'The amount of upcoming rotations you want to see (up to 10).',
			require: false,
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
		const amount = args[0];

		function checkAmount(amount) {
			if (amount == null || amount == undefined) return '1';

			if (amount > 10) return '10';

			return amount;
		}

		try {
			got.get(`https://fn.alphaleagues.com/v2/apex/map/?next=${checkAmount(amount)}`, {
				responseType: 'json',
			})
				.then(res => {
					// General Data
					var data = res.body;

					function nextMaps() {
						return data.br.next
							.map(
								x =>
									`**${x.map}**\nStarts in <t:${x.timestamp}:R> and lasts for **${x.duration} minutes**.\n\n`,
							)
							.join(``);
					}

					function mapImageName(name) {
						if (name == 'Kings Canyon') return 'KingsCanyon';
						if (name == "World's Edge") return 'WorldsEdge';
						if (name == 'Storm Point') return 'StormPoint';

						return name;
					}

					const current = new MessageEmbed()
						.setDescription(
							`The current map is **${data.br.map}** and ends <t:${data.br.times.next}:R>.\nThe next map is **${data.br.next[0].map}** for ${data.br.next[0].duration} minutes.\nThe current ranked map is **${data.br.ranked.map}** and ends <t:${data.br.ranked.end}:R>.`,
						)
						.setImage(
							`https://cdn.apexstats.dev/Maps/Season%2011/BR/${mapImageName(data.br.map)}_00${
								data.br.ranked.split
							}.gif`,
						);

					const future = new MessageEmbed().setDescription(nextMaps());

					if (checkAmount(amount) == 1) {
						interaction
							.followUp({ content: 'Getting current map from map rotation API...', embeds: [] })
							.then(i => interaction.editReply({ content: '\u200b', embeds: [current] }))
							.catch(e => interaction.editReply(e));
					} else {
						interaction
							.followUp({ content: 'Getting future map rotations from map rotation API...', embeds: [] })
							.then(i => interaction.editReply({ content: '\u200b', embeds: [future] }))
							.catch(e => interaction.editReply(e));
					}
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
