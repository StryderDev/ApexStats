const axios = require('axios');
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

const { embedColor, Misc } = require('../../data/utilities.json');

module.exports = {
	data: new SlashCommandBuilder().setName('ranked').setDescription('Shows the current and next Ranked Battle Royale map rotation.'),

	async execute(interaction) {
		const loadingEmbed = new EmbedBuilder().setDescription(`${Misc.Loading} Grabbing ranked map data from API...`).setColor(embedColor);

		await interaction.editReply({ embeds: [loadingEmbed] });

		const mapAPI = axios.get(`https://api.jumpmaster.xyz/map/?next=1&key=${process.env.SPYGLASS}`);
		const seasonAPI = axios.get(`https://api.jumpmaster.xyz/seasons/Current?version=2`);

		await axios
			.all([mapAPI, seasonAPI])
			.then(
				axios.spread((...res) => {
					const mapData = res[0].data.ranked;
					const seasonData = res[1].data;

					// Season Data
					const rankedEnd = seasonData.dates.end.rankedEnd;

					const mapEmbed = new EmbedBuilder()
						.setTitle(`Ranked Squads are currently competing on ${mapData.map.name}`)
						.setDescription(
							`**${mapData.map.name}** ends <t:${mapData.times.next}:R> at <t:${mapData.times.next}:t>.\n**Next Up:** ${mapData.next[0].map.name} for 24 hours.\n**Ranked Period:** Ends <t:${rankedEnd}:D> at <t:${rankedEnd}:t>.`,
						)
						.setImage(`https://cdn.jumpmaster.xyz/Bot/Maps/Season%2019/Ranked/${encodeURIComponent(mapData.map.image)}.png?t=${Math.floor(Math.random() * 10)}`)
						.setColor(embedColor);

					interaction.editReply({ embeds: [mapEmbed] });
				}),
			)
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
	},
};
