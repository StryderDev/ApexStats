const { Client, CommandInteraction } = require('discord.js');
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
		// https://fn.alphaleagues.com/v2/apex/map/?next=1
		const map = args[0];
		const timeLogs = DateTime.local().toFormat('hh:mm:ss');

		try {
			const response = await axios.get('https://fn.alphaleagues.com/v2/apex/map/?next=1');

			const mapName = response.data.br.map;

			const mapFile = require(`../../data/maps/${mapName}.json`);

			await interaction
				.followUp({ content: 'Choosing a spot to drop...' })
				.then(i =>
					interaction.editReply(
						`Drop in **${mapFile[Math.floor(Math.random() * mapFile.length)]}** on **${mapName}**.`,
					),
				)
				.catch(e => interaction.editReply(e));
		} catch (error) {
			console.error(chalk`{red.bold [${timeLogs}] Error: ${error.code} on Map Rotation API in Drop Command.}`);
			await interaction.followUp({
				content:
					'There was an error loading the Map Rotation API. Try `/drop Kings Canyon` for a manual drop spot.',
			});
		}
	},
};
