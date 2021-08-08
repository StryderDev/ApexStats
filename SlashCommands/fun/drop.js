const { Client, CommandInteraction } = require('discord.js');
const axios = require('axios');

module.exports = {
	name: 'drop',
	description: 'Picks a random place to drop based on the current map.',

	options: [
		{
			name: 'map',
			description: 'Which map you want to drop in.',
			type: 'STRING',
			required: false,
			choices: [
				{
					name: 'Kings Canyon',
					value: 'Kings Canyon',
				},
				{
					name: "World's Edge",
					value: "World's Edge",
				},
				{
					name: 'Olympus',
					value: 'Olympus',
				},
			],
		},
	],

	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 */
	run: async (client, interaction) => {
		// Args
		const map = interaction.options.get('map');

		function compress(string) {
			function isWhiteSpace(text) {
				return ' \t\n'.includes(text);
			}

			function isPunct(text) {
				return ';:.,?!-\'"(){}'.includes(text);
			}

			return string
				.split('')
				.filter(char => !isWhiteSpace(char) && !isPunct(char))
				.join('');
		}

		function getMap(map) {
			mapFile = require(`../../data/drops/season10/${compress(map)}.json`);

			return `Drop in **${mapFile[Math.floor(Math.random() * mapFile.length)]}** on ${map}!`;
		}

		if (map == null || map == undefined) {
			axios.get(`https://fn.alphaleagues.com/v2/apex/map/`).then(result => {
				var map = result.data.br.map;

				interaction.followUp({ content: getMap(map) });
			});
		} else {
			interaction.followUp({ content: getMap(map.value) });
		}
	},
};
