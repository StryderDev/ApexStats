const { CommandInteraction, MessageEmbed } = require('discord.js');
const axios = require('axios');
const WorldsEdgeDrops = require('../../gameData/mapDrops/Season09/we.json');
const OlympusDrops = require('../../gameData/mapDrops/Season09/olympus.json');
const KingsCanyonDrops = require('../../gameData/mapDrops/Season09/kc.json');

module.exports = {
	name: 'drop',
	description: 'Choose a random place on the current map to drop.',

	options: [
		{
			name: 'map',
			description: 'Which map to choose a location to drop.',
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

	run: async (client, interaction) => {
		// Args
		const map = interaction.options.get('map');

		function getMap(map) {
			if (map == 'Kings Canyon')
				return `Drop in ${
					KingsCanyonDrops[Math.floor(Math.random() * KingsCanyonDrops.length)]
				} on Kings Canyon!`;

			if (map == "World's Edge")
				return `Drop in ${
					WorldsEdgeDrops[Math.floor(Math.random() * WorldsEdgeDrops.length)]
				} on World's Edge!`;

			if (map == 'Olympus')
				return `Drop in ${OlympusDrops[Math.floor(Math.random() * OlympusDrops.length)]} on Olympus!`;
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
