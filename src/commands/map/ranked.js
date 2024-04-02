const axios = require('axios');
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

const { nextMapLength } = require('../../utilities/map.js');
const { embedColor, Misc } = require('../../data/utilities.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ranked')
		.setDescription('Shows the current and next Ranked Battle Royale map rotation.')
		.addNumberOption(option =>
			option.setName('next').setDescription('Select the number of future map rotations you want to see').setMaxValue(1).setMaxValue(10).setRequired(false),
		),

	async execute(interaction) {
		// Slash Command Options
		const nextOption = interaction.options.getNumber('next');

		// If the user doesn't specify a number, default to 1
		const nextMapCount = nextOption == null ? 1 : nextOption;

		const loadingEmbed = new EmbedBuilder().setDescription(`${Misc.Loading} Grabbing ranked map data from API...`).setColor(embedColor);

		await interaction.editReply({ embeds: [loadingEmbed] });

		const mapAPI = axios.get(`https://solaris.apexstats.dev/beacon/map/ranked?key=${process.env.SPYGLASS}&next=${nextMapCount}`);
		const seasonAPI = axios.get(`https://api.jumpmaster.xyz/seasons/Current?version=2`);

		await axios
			.all([mapAPI, seasonAPI])
			.then(
				axios.spread((...res) => {
					const mapData = res[0].data;
					const seasonData = res[1].data;

					// Season Data
					const rankedSplit = seasonData.dates.split.timestamp;
					const rankedEnd = seasonData.dates.end.rankedEnd;

					if (nextMapCount === 1) {
						const mapEmbed = new EmbedBuilder()
							.setTitle(`Ranked Squads are currently competing on ${mapData.map.name}`)
							.setDescription(
								`**${mapData.map.name}** ends <t:${mapData.times.nextMap}:R> at <t:${mapData.times.nextMap}:t>.\n**Next Up:** ${mapData.next[0].map.name} for 24 hours.\n**Ranked Period Split:** <t:${rankedSplit}:D> at <t:${rankedSplit}:t>, or <t:${rankedSplit}:R>.\n**Ranked Period End:** <t:${rankedEnd}:D> at <t:${rankedEnd}:t>, or <t:${rankedEnd}:R>.`,
							)
							.setImage(`https://specter.apexstats.dev/ApexStats/Maps/${encodeURIComponent(mapData.map.image)}.png`)
							.setColor(embedColor);

						interaction.editReply({ embeds: [mapEmbed] });
					} else {
						// use the map.next to get the next nextMapCount maps
						const nextMaps = mapData.next.slice(0, nextMapCount);

						let nextMapString = '';

						for (let i = 0; i < nextMaps.length; i++) {
							nextMapString += `**${nextMaps[i].map.name}**\nStarts <t:${nextMaps[i].start}:D> at <t:${nextMaps[i].start}:t> for ${nextMapLength(
								nextMaps[i].duration.minutes,
								nextMaps[i].duration.hours,
							)}\n\n`;
						}

						const mapEmbed = new EmbedBuilder()
							.setTitle(`Next ${nextMapCount} Rank Map Rotations`)
							.setDescription(
								`**Currently:** ${mapData.map.name}\nEnds <t:${mapData.times.nextMap}:D> at <t:${mapData.times.nextMap}:t>.\n**Ranked Period:** Ends <t:${rankedEnd}:D> at <t:${rankedEnd}:t>.\n\n**Up Next:**\n${nextMapString}`,
							)
							.setColor(embedColor);

						interaction.editReply({ embeds: [mapEmbed] });
					}
				}),
			)
			.catch(error => {
				if (error.response) {
					console.log(error.response.data);

					const errorEmbed = new EmbedBuilder().setTitle('Map Lookup Error').setDescription(error.response.data.error).setColor('D0342C').setTimestamp();

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
