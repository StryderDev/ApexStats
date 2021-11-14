const { Client, CommandInteraction } = require('discord.js');
const got = require('got');
const chalk = require('chalk');
const { DateTime } = require('luxon');

module.exports = {
	name: 'drop',
	description: 'Returns a random place to drop based on the current map. Use the "map" option to choose a map.',
	type: 'CHAT_INPUT',
	options: [
		{
			name: 'map',
			type: 'STRING',
			description: 'Choose which map you want a rotation from.',
			require: false,
			choices: [
				{
					name: 'Kings Canyon',
					value: 'KingsCanyon',
				},
				{
					name: "World's Edge",
					value: 'WorldsEdge',
				},
				{
					name: 'Olympus',
					value: 'Olympus',
				},
				{
					name: 'Storm Point',
					value: 'StormPoint',
				},
			],
		},
	],
	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 * @param {String[]} args
	 */
	run: async (client, interaction, args) => {
		const map = args[0];
		const timeLogs = DateTime.local().toFormat('hh:mm:ss');

		if (!map) {
			try {
				got.get(`https://fn.alphaleagues.com/v2/apex/map/?next=1`, {
					responseType: 'json',
				}).then(res => {
					var data = res.body;

					function mapName(name) {
						if (name == 'Kings Canyon') return 'KingsCanyon';
						if (name == "World's Edge") return 'WorldsEdge';
						if (name == 'Storm Point') return 'StormPoint';

						return name;
					}

					const mapFile = require(`../../data/maps/${mapName(data.br.map)}.json`);

					interaction
						.followUp({ content: 'Choosing a spot to drop...' })
						.then(i =>
							interaction.editReply(
								`Drop in **${mapFile[Math.floor(Math.random() * mapFile.length)]}** on **${
									data.br.map
								}**.`,
							),
						)
						.catch(e => interaction.editReply(e));
				});
			} catch (error) {
				console.error(chalk`{red.bold [${timeLogs}] Error: ${error} on Map Rotation API in Drop Command.}`);
				interaction.followUp({
					content:
						'There was an error loading the Map Rotation API. Try `/drop Storm Point` for a manual drop spot.',
				});
			}
		} else {
			const mapFile = require(`../../data/maps/${map}.json`);

			function mapName(name) {
				if (name == 'KingsCanyon') return 'Kings Canyon';
				if (name == 'WorldsEdge') return "World's Edge";
				if (name == 'StormPoint') return 'Storm Point';

				return name;
			}

			await interaction
				.followUp({ content: 'Choosing a spot to drop...' })
				.then(i =>
					interaction.editReply(
						`Drop in **${mapFile[Math.floor(Math.random() * mapFile.length)]}** on **${mapName(map)}**.`,
					),
				)
				.catch(e => interaction.editReply(e));
		}
	},
};
