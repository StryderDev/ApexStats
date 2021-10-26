const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const axios = require('axios');
const chalk = require('chalk');
const { DateTime } = require('luxon');

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
		const amount = args[0];
		const timeLogs = DateTime.local().toFormat('hh:mm:ss');

		function checkAmount(amount) {
			if (amount == null || amount == undefined) return '1';

			if (amount > 10) return '10';

			return amount;
		}

		try {
			const response = await axios.get(`https://fn.alphaleagues.com/v2/apex/map/?next=${checkAmount(amount)}`);

			function nextMaps() {
				return response.data.br.next
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
					`The current map is **${response.data.br.map}** and ends <t:${response.data.br.times.next}:R>.\nThe next map is **${response.data.br.next[0].map}** for ${response.data.br.next[0].duration} minutes.\nThe current ranked map is **${response.data.br.ranked.map}** and ends <t:${response.data.br.ranked.end}:R>.`,
				)
				.setImage(
					`https://cdn.apexstats.dev/Maps/Season%2010/BR/${mapImageName(response.data.br.map)}_00${
						response.data.br.ranked.split
					}.gif`,
				);

			const future = new MessageEmbed().setDescription(nextMaps());

			if (checkAmount(amount) == 1) {
				await interaction
					.followUp({ content: 'Getting current map from map rotation API...', embeds: [] })
					.then(i => interaction.editReply({ content: '\u200b', embeds: [current] }))
					.catch(e => interaction.editReply(e));
			} else {
				await interaction
					.followUp({ content: 'Getting future map rotations from map rotation API...', embeds: [] })
					.then(i => interaction.editReply({ content: '\u200b', embeds: [future] }))
					.catch(e => interaction.editReply(e));
			}
		} catch (error) {
			console.error(chalk`{red.bold [${timeLogs}] Error: ${error} on Map Rotation API in Map Command.}`);
			await interaction.followUp({
				content: 'There was an error loading the Map Rotation API. Try again in a few minutes.',
			});
		}
	},
};
