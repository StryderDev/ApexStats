const axios = require('axios');
const { Axiom } = require('@axiomhq/js');
const wait = require('util').promisify(setTimeout);
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

const { embedColor, Misc } = require('../../data/utilities.json');

const axiomIngest = new Axiom({
	token: process.env.AXIOM_TOKEN,
	orgId: process.env.AXIOM_ORG,
});

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
					{ name: 'E-District', value: 'E-District' },
				),
		),

	async execute(interaction) {
		// Slash Command Options
		const mapOption = interaction.options.getString('map');

		const loadingEmbed = new EmbedBuilder().setDescription(`${Misc.Loading} Selecting a random place to drop...`).setColor(embedColor);

		await interaction.editReply({ embeds: [loadingEmbed] });

		await wait(1000);

		if (mapOption != null) {
			const mapFile = require(`../../data/drops/Season 22/${mapOption}.json`);
			const map = Math.floor(Math.random() * mapFile.length);

			interaction.editReply({ content: `Drop into **${mapFile[map]}** on ${mapOption}!`, embeds: [] });

			axiomIngest.ingest('apex.stats', [{ map: mapOption, mapDrop: mapFile[map] }]);
		} else {
			await axios
				.get(`https://solaris.apexstats.dev/beacon/map/br?key=${process.env.SPYGLASS}`)
				.then(response => {
					const br = response.data.map;

					const mapFile = require(`../../data/drops/Season 22/${br}.json`);
					const map = Math.floor(Math.random() * mapFile.length);

					interaction.editReply({ content: `Drop into **${mapFile[map]}** on ${br}`, embeds: [] });

					axiomIngest.ingest('apex.stats', [{ map: br, mapDrop: mapFile[map] }]);
				})
				.catch(error => {
					if (error.response) {
						console.log(error.response.data);

						const errorEmbed = new EmbedBuilder().setTitle('Map Lookup Error').setDescription(error.response.data.error).setColor('D0342C').setTimestamp();

						// axios.get(`https://api.jumpmaster.xyz/logs/Stats?type=error&dev=${debug}`);

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

						const errorEmbed = new EmbedBuilder().setTitle('Unknown Error').setDescription(`This should never happen.\nIf you see this error, please contact <@360564818123554836> ASAP.`).setColor('D0342C');

						interaction.editReply({ embeds: [errorEmbed] });
					}
				});
		}
	},
};
