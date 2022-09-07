const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const wait = require('util').promisify(setTimeout);

const { debug } = require('../../config.json');
const { Misc } = require('../../data/emotes.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('drop')
		.setDescription('Picks a random place to drop in the current map.')
		.addStringOption(option =>
			option
				.setName('map')
				.setDescription('Manually pick a map.')
				.setRequired(false)
				.addChoices(
					{ name: 'Kings Canyon', value: 'Kings Canyon' },
					{ name: "World's Edge", value: 'Worlds Edge' },
					{ name: 'Olympus', value: 'Olympus' },
					{ name: 'Storm Point', value: 'Storm Point' },
				),
		),
	async execute(interaction) {
		// Options
		const mapOption = interaction.options.getString('map');

		function mapName(map) {
			if (map == 'Kings Canyon') return 'Kings_Canyon';
			if (map == 'Worlds Edge') return 'Worlds_Edge';
			if (map == "World's Edge") return 'Worlds_Edge';
			if (map == 'Storm Point') return 'Storm_Point';

			return map;
		}

		await interaction.editReply({ content: `${Misc.Loading} Choosing a random place to drop...` });
		await wait(1000);

		if (mapOption != null) {
			function mapFilePath(map) {
				return `../../data/drops/Season 14/${map}.json`;
			}

			const mapFile = require(mapFilePath(mapOption));
			const map = Math.floor(Math.random() * mapFile.length);

			const dropText = `Drop into **${mapFile[map]}** on ${mapOption}.`;

			interaction.editReply({ content: dropText });

			axios.get(`https://api.jumpmaster.xyz/logs/Drops?map=${mapName(mapOption)}&dev=${debug.true}`);
		} else {
			await axios
				.get(`https://fn.alphaleagues.com/v2/apex/map/`)
				.then(response => {
					const br = response.data.br;

					function mapFilePath(map) {
						return `../../data/drops/Season 14/${map.replaceAll("'", '')}.json`;
					}

					const mapFile = require(mapFilePath(br.map));
					const map = Math.floor(Math.random() * mapFile.length);

					const dropText = `Drop into **${mapFile[map]}** on ${br.map}.`;

					interaction.editReply({ content: dropText });

					axios.get(`https://api.jumpmaster.xyz/logs/Drops?map=${mapName(br.map)}&dev=${debug.true}`);
				})
				.catch(error => {
					// Request failed with a response outside of the 2xx range
					if (error.response) {
						console.log(error.response.data);
						// console.log(error.response.status);
						// console.log(error.response.headers);

						interaction.editReply({ content: `**Error**\n\`${error.response.data.error}\``, embeds: [] });
					} else if (error.request) {
						console.log(error.request);
						interaction.editReply({
							content: `**Error**\n\`The request was not returned successfully.\``,
							embeds: [],
						});
					} else {
						console.log(error.message);
						interaction.editReply({
							content: `**Error**\n\`Unknown. Try again or tell SDCore#0001.\``,
							embeds: [],
						});
					}
				});
		}
	},
};
