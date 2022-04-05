const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');
const wait = require('util').promisify(setTimeout);

const { api } = require('../config.json');
const { Misc } = require('../data/emotes.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('drop')
		.setDescription('Picks a random place to drop in the current map.')
		.addStringOption(option =>
			option
				.setName('map')
				.setDescription('Manually pick a map.')
				.setRequired(false)
				.addChoice('Kings Canyon', 'Kings Canyon')
				.addChoice("World's Edge", 'Worlds Edge')
				.addChoice('Olympus', 'Olympus')
				.addChoice('Storm Point', 'Storm Point'),
		),
	async execute(interaction) {
		// Options
		const mapOption = interaction.options.getString('map');

		await interaction.editReply({ content: `${Misc.Loading} Choosing a random place to drop...` });
		await wait(1000);

		if (mapOption != null) {
			function mapFilePath(map) {
				return `../data/drops/Season 12/${map}.json`;
			}

			const mapFile = require(mapFilePath(mapOption));
			const map = Math.floor(Math.random() * mapFile.length);

			const dropText = `Drop into **${mapFile[map]}** on ${mapOption}.`;

			interaction.editReply({ content: dropText });
		} else {
			await axios
				.get(`https://api.mozambiquehe.re/maprotation?version=5&auth=${api.apex}`)
				.then(response => {
					const br = response.data.battle_royale;

					function mapFilePath(map) {
						return `../data/drops/Season 12/${map}.json`;
					}

					const mapFile = require(mapFilePath(br.current.map));
					const map = Math.floor(Math.random() * mapFile.length);

					const dropText = `Drop into **${mapFile[map]}** on ${br.current.map}.`;

					interaction.editReply({ content: dropText });
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
