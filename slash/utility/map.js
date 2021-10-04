const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const axios = require('axios');
const chalk = require('chalk');
const { DateTime } = require('luxon');

module.exports = {
	name: 'map',
	description: 'Returns current and future map rotation info.',
	type: 'CHAT_INPUT',
	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 * @param {String[]} args
	 */
	run: async (client, interaction, args) => {
		const timeLogs = DateTime.local().toFormat('hh:mm:ss');

		try {
			const response = await axios.get('https://fn.alphaleagues.com/v2/apex/map/?next=1');

			const map = new MessageEmbed().setDescription(
				`The current map is **${response.data.br.map}** and ends <t:${response.data.br.times.next}:R>.\nThe next map is **${response.data.br.next[0].map}** for ${response.data.br.next[0].duration} minutes.\nThe current ranked map is **${response.data.br.ranked.map}** and ends <t:${response.data.br.ranked.end}:R>.`,
			);

			await interaction
				.followUp({ content: 'Getting current map from map rotation API...', embeds: [] })
				.then(i => interaction.editReply({ content: '\u200b', embeds: [map] }))
				.catch(e => interaction.editReply(e));
		} catch (error) {
			console.error(chalk`{red.bold [${timeLogs}] Error: ${error.code} on Map Rotation API in Map Command.}`);
			await interaction.followUp({
				content: 'There was an error loading the Map Rotation API. Try again in a few minutes.',
			});
		}
	},
};
