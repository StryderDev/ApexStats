const got = require('got');
const chalk = require('chalk');
const { DateTime } = require('luxon');
const { Client, CommandInteraction, MessageEmbed } = require('discord.js');

module.exports = {
	name: 'arenas',
	description: 'Returns current and future arena map rotation info.',
	type: 'CHAT_INPUT',
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
			got.get(`https://fn.alphaleagues.com/v2/apex/map/?next=1`, {
				responseType: 'json',
			})
				.then(res => {
					// General Data
					var data = res.body;

					const map = new MessageEmbed().setDescription(
						`The current map is **${data.arenas.map}** and ends <t:${data.arenas.times.next}:R>.\nThe next map is **${data.arenas.next[0].map}** for ${data.arenas.next[0].duration} minutes.`,
					);

					interaction
						.followUp({ content: 'Getting current arena map from map rotation API...', embeds: [] })
						.then(i => interaction.editReply({ content: '\u200b', embeds: [map] }))
						.catch(e => interaction.editReply(e));
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
