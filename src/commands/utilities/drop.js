const axios = require('axios');
const wait = require('util').promisify(setTimeout);
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

const { embedColor, Emotes } = require('../../data/utilities.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('drop')
		.setDescription('Select a random drop location from the current map, or select a specific map to choose from.')
		.addStringOption(option =>
			option
				.setName('map')
				.setDescription('Manually pick a map')
				.setRequired(false)
				.addChoices(
					{ name: 'Kings Canyon', value: 'Kings Canyon' },
					{ name: "World's Edge", value: "World's Edge" },
					{ name: 'Olympus', value: 'Olympus' },
					{ name: 'Storm Point', value: 'Storm Point' },
					{ name: 'Broken Moon', value: 'Broken Moon' },
				),
		),

	async execute(interaction) {
		// Slash Command Options
		const mapOption = interaction.options.getString('map');

		const loadingEmbed = new EmbedBuilder().setDescription(`${Emotes.Misc.Loading} Selecting a random place to drop...`).setColor(embedColor);

		await interaction.editReply({ embeds: [loadingEmbed] });

		await wait(1000);

		if (mapOption != null) {
			const mapFile = require(`../../data/drops/Season 16/${mapOption}.json`);
			const map = Math.floor(Math.random() * mapFile.length);

			interaction.editReply({ content: `Drop into ${mapFile[map]} on ${mapOption}!`, embeds: [] });
		} else {
			await axios
				.get('https://api.jumpmaster.xyz/map/')
				.then(response => {
					const br = response.data.br.map;

					const mapFile = require(`../../data/drops/Season 16/${br.name}.json`);
					const map = Math.floor(Math.random() * mapFile.length);

					interaction.editReply({ content: `Drop into ${mapFile[map]} on ${br.name}`, embeds: [] });
				})
				.catch(error => {
					if (error.response) {
						console.log(error.response.data);

						const errorEmbed = new EmbedBuilder().setTitle('Map Lookup Error').setDescription(error.response.data.error).setColor('D0342C').setTimestamp();

						axios.get(`https://api.jumpmaster.xyz/logs/Stats?type=error&dev=${debug}`);

						interaction.editReply({ embeds: [errorEmbed] });
					} else if (error.request) {
						console.log(error.request);

						const errorEmbed = new EmbedBuilder()
							.setTitle('Site Lookup Error')
							.setDescription(`The request was not returned successfully.\nThis is potentially an error with the API.\nPlease try again shortly.`)
							.setColor('D0342C')
							.setTimestamp();

						interaction.editReply({ embeds: [errorEmbed] });
					} else {
						console.log(error.message);

						const errorEmbed = new EmbedBuilder()
							.setTitle('Unknown Error')
							.setDescription(`This should never happen.\nIf you see this error, please contact <@360564818123554836> ASAP.`)
							.setColor('D0342C');

						interaction.editReply({ embeds: [errorEmbed] });
					}
				});
		}
	},
};
